import { DesignProps, ObjectProps } from "@/utils/designer/Interfaces";
import { GetObjectDimensions, GetTextSize } from "./Helper";

export default function SetupMouseEvents(
	canvas: HTMLCanvasElement,
	trayObject: ObjectProps,
	currentDesign: DesignProps,
	setCurrentDesign: (design: DesignProps) => void,
	selectedObjectID: number | null,
	setSelectedObjectID: (id: number | null) => void,
	designEditorElement: HTMLDivElement | null,
	Draw: (
		design: DesignProps,
		snapLineX: number | null,
		snapLineY: number | null,
	) => void,
) {
	const ctx = canvas.getContext("2d");

	const selectedObject = currentDesign.objects.find(
		(obj) => obj.id === selectedObjectID,
	);

	let dragObject: ObjectProps | undefined = undefined;
	let dragObjectOffset: { x: number; y: number } = { x: 0, y: 0 };
	let dragType: "move" | "resize" | undefined = undefined;
	let resizeDirection:
		| "top"
		| "bottom"
		| "left"
		| "right"
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| undefined = undefined;

	function onMouseDown(e: any) {
		const { clickX, clickY } = GetCoordsFromEvent(e, canvas);
		dragObject = GetObjectFromPointer(e, canvas, trayObject, currentDesign);

		if (dragObject && ctx && selectedObjectID !== null) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				dragObject,
			);

			dragObjectOffset = {
				x: clickX - x,
				y: clickY - y,
			};

			const resizeDir = GetResizeDirection(
				clickX,
				clickY,
				x,
				y,
				width,
				height,
			);

			if (resizeDir) {
				if (
					dragObject.type !== "text" ||
					resizeDir === "left" ||
					resizeDir === "right"
				) {
					dragType = "resize";
					resizeDirection = resizeDir;
				} else {
					dragType = "move";
				}
			} else {
				dragType = "move";
			}
		} else {
			dragType = undefined;
		}
	}

	function onMouseUp() {
		if (dragObject) {
			setCurrentDesign({
				...currentDesign,
				objects: currentDesign.objects.map((obj) =>
					dragObject && obj.id === dragObject.id ? dragObject : obj,
				),
			});
			dragObject = undefined;
		}

		if (designEditorElement) {
			designEditorElement.style.pointerEvents = "auto";
			designEditorElement.style.opacity = "1";
		}
	}

	function onClick(e: any) {
		const object = GetObjectFromPointer(
			e,
			canvas,
			trayObject,
			currentDesign,
			0,
		);

		setSelectedObjectID(object?.id ?? null);
	}

	function onMouseMove(e: any) {
		e.preventDefault();
		const object = GetObjectFromPointer(
			e,
			canvas,
			trayObject,
			currentDesign,
			selectedObject ? 16 : 0,
		);

		canvas.style.cursor = object ? "pointer" : "default";

		// If the mouse is down right corner of an image, show resize cursor
		if (selectedObject && selectedObject === object && ctx) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				selectedObject,
			);

			const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

			const resizeDir = GetResizeDirection(
				clickX,
				clickY,
				x,
				y,
				width,
				height,
			);

			if (resizeDir) {
				if (
					(resizeDir === "top" || resizeDir === "bottom") &&
					selectedObject.type !== "text"
				) {
					canvas.style.cursor = "ns-resize";
				} else if (resizeDir === "left" || resizeDir === "right") {
					canvas.style.cursor = "ew-resize";
				} else if (
					(resizeDir === "top-left" ||
						resizeDir === "bottom-right") &&
					selectedObject.type !== "text"
				) {
					canvas.style.cursor = "nwse-resize";
				} else if (
					(resizeDir === "top-right" ||
						resizeDir === "bottom-left") &&
					selectedObject.type !== "text"
				) {
					canvas.style.cursor = "nesw-resize";
				} else {
					canvas.style.cursor = "move";
				}
			} else {
				canvas.style.cursor = "move";
			}
		}

		if (dragObject && ctx) {
			const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

			if (designEditorElement) {
				designEditorElement.style.pointerEvents = "none";
				designEditorElement.style.opacity = "0";
			}

			let snapLineX = null;
			let snapLineY = null;

			if (dragType === "move") {
				dragObject.x =
					(clickX - dragObjectOffset.x - trayObject.x) /
					(trayObject.width || 1);
				dragObject.y =
					(clickY - dragObjectOffset.y - trayObject.y) /
					(trayObject.height || 1);

				const { snapLineX: snapX, snapLineY: snapY } = SnapObject(
					dragObject,
					ctx,
					trayObject,
				);

				snapLineX = snapX;
				snapLineY = snapY;
			} else if (dragType === "resize") {
				if (
					resizeDirection === "top-right" ||
					resizeDirection === "right" ||
					resizeDirection === "bottom-right"
				) {
					dragObject.width = Math.max(
						0.001,
						(clickX - trayObject.x) / (trayObject.width || 1) -
							dragObject.x,
					);

					if (dragObject.type === "text") {
						const fontSize = GetTextSize(
							ctx,
							trayObject,
							dragObject,
						);
						dragObject.size = fontSize / (trayObject.height || 1);
					}
				} else if (
					resizeDirection === "top-left" ||
					resizeDirection === "left" ||
					resizeDirection === "bottom-left"
				) {
					const oldX = dragObject.x ?? 0;
					const newX =
						(clickX - trayObject.x) / (trayObject.width || 1);
					dragObject.x =
						newX < newX + (dragObject.width ?? 0) ? newX : oldX;

					dragObject.width = Math.max(
						0.001,
						oldX - dragObject.x + (dragObject.width ?? 0),
					);

					if (dragObject.type === "text") {
						const fontSize = GetTextSize(
							ctx,
							trayObject,
							dragObject,
						);
						dragObject.size = fontSize / (trayObject.height || 1);
					}
				}

				if (
					resizeDirection === "top-left" ||
					resizeDirection === "top" ||
					resizeDirection === "top-right"
				) {
					const oldY = dragObject.y ?? 0;
					const newY =
						(clickY - trayObject.y) / (trayObject.height || 1);
					dragObject.y =
						newY < newY + (dragObject.height ?? 0) ? newY : oldY;
					dragObject.height = Math.max(
						0.001,
						oldY - dragObject.y + (dragObject.height ?? 0),
					);
				} else if (
					resizeDirection === "bottom-left" ||
					resizeDirection === "bottom" ||
					resizeDirection === "bottom-right"
				) {
					dragObject.height = Math.max(
						0.001,
						(clickY - trayObject.y) / (trayObject.height || 1) -
							dragObject.y,
					);
				}
			}

			Draw(
				{
					...currentDesign,
					objects: currentDesign.objects.map((obj) =>
						dragObject && obj.id === dragObject.id
							? dragObject
							: obj,
					),
				},
				snapLineX,
				snapLineY,
			);
		}
	}

	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("click", onClick);

	canvas.addEventListener("touchstart", onMouseDown);
	canvas.addEventListener("touchend", onMouseUp);
	canvas.addEventListener("touchmove", onMouseMove);
	canvas.addEventListener("touchcancel", onMouseUp);

	return () => {
		canvas.removeEventListener("mousedown", onMouseDown);
		canvas.removeEventListener("mouseup", onMouseUp);
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("click", onClick);

		canvas.removeEventListener("touchstart", onMouseDown);
		canvas.removeEventListener("touchend", onMouseUp);
		canvas.removeEventListener("touchmove", onMouseMove);
		canvas.removeEventListener("touchcancel", onMouseUp);
	};
}

function SnapObject(
	object: ObjectProps,
	ctx: CanvasRenderingContext2D,
	trayObject: ObjectProps,
) {
	const snapDistance = 0.01;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		trayObject,
		object,
		true,
	);

	let snapLineX = null;
	let snapLineY = null;

	if (Math.abs(x) < snapDistance) {
		object.x = 0;
		snapLineX = 0;
	}
	if (Math.abs(x + width - 1) < snapDistance) {
		object.x = 1 - width;
		snapLineX = 1;
	}
	if (Math.abs(y) < snapDistance) {
		object.y = 0;
		snapLineY = 0;
	}
	if (Math.abs(y + height - 1) < snapDistance) {
		object.y = 1 - height;
		snapLineY = 1;
	}
	if (Math.abs(x + width / 2 - 0.5) < snapDistance) {
		object.x = 0.5 - width / 2;
		snapLineX = 0.5;
	}
	if (Math.abs(y + height / 2 - 0.5) < snapDistance) {
		object.y = 0.5 - height / 2;
		snapLineY = 0.5;
	}

	return { snapLineX, snapLineY };
}

function GetCoordsFromEvent(e: any, canvas: HTMLCanvasElement) {
	const rect = canvas.getBoundingClientRect();

	if (e.touches) {
		const touch = e.touches[0];
		const clickX = (touch.clientX - rect.x) * (canvas.width / rect.width);
		const clickY = (touch.clientY - rect.y) * (canvas.height / rect.height);

		return { clickX, clickY };
	}

	const clickX = e.offsetX * (canvas.width / rect.width);
	const clickY = e.offsetY * (canvas.height / rect.height);

	return { clickX, clickY };
}

function GetObjectFromPointer(
	e: any,
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	currentDesign: DesignProps,
	padding: number = 16,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

	return currentDesign.objects
		.sort((a, b) => b.order - a.order)
		.filter((obj) => !obj.template)
		.find((obj) => {
			const { x, y, width, height } = GetObjectDimensions(ctx, tray, obj);

			// If the clicked position is inside the object
			if (
				clickX >= x - padding &&
				clickX <= x + width + padding &&
				clickY >= y - padding &&
				clickY <= y + height + padding
			) {
				return true;
			}
		});
}

function GetResizeDirection(
	clickX: number,
	clickY: number,
	x: number,
	y: number,
	width: number,
	height: number,
) {
	const handleHeight = 16;

	if (clickX >= x + width && clickY >= y + height) {
		return "bottom-right";
	} else if (clickX >= x + width && clickY <= y) {
		return "top-right";
	} else if (clickX <= x && clickY >= y + height) {
		return "bottom-left";
	} else if (clickX <= x && clickY <= y) {
		return "top-left";
	} else if (
		clickX >= x + width &&
		clickY >= y + height / 2 - handleHeight / 2 &&
		clickY <= y + height / 2 + handleHeight / 2
	) {
		return "right";
	} else if (
		clickX <= x &&
		clickY >= y + height / 2 - handleHeight / 2 &&
		clickY <= y + height / 2 + handleHeight / 2
	) {
		return "left";
	} else if (
		clickY >= y + height &&
		clickX >= x + width / 2 - handleHeight / 2 &&
		clickX <= x + width / 2 + handleHeight / 2
	) {
		return "bottom";
	} else if (
		clickY <= y &&
		clickX >= x + width / 2 - handleHeight / 2 &&
		clickX <= x + width / 2 + handleHeight / 2
	) {
		return "top";
	}

	return undefined;
}
