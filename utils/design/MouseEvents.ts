import { DesignProps, ObjectProps } from "@/utils/design/Interfaces";
import { GetObjectDimensions } from "./Helper";
import defaultDesign from "../../data/defaultdesign.json";

export default function SetupMouseEvents(
	canvas: HTMLCanvasElement,
	trayObject: ObjectProps,
	currentDesign: DesignProps,
	setCurrentDesign: (design: DesignProps) => void,
	selectedObjectID: number | null,
	setSelectedObjectID: (id: number | null) => void,
	selectedTool: "select" | "text" | "image" | "rectangle",
	setSelectedTool: (tool: "select" | "text" | "image" | "rectangle") => void,
	designEditorElement: HTMLDivElement | null,
	Draw: (design: DesignProps) => void,
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
	let mouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };

	function onMouseDown(e: any) {
		const { clickX, clickY } = GetCoordsFromEvent(e, canvas);
		mouseDownPosition = { x: clickX, y: clickY };

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

			if (
				dragObject.type === "image" ||
				dragObject.type === "rectangle"
			) {
				if (clickX >= x + width - 8 && clickY >= y + height - 8) {
					dragType = "resize";
					resizeDirection = "bottom-right";
				} else if (clickX >= x + width - 8 && clickY <= y + 8) {
					dragType = "resize";
					resizeDirection = "top-right";
				} else if (clickX <= x + 8 && clickY >= y + height - 8) {
					dragType = "resize";
					resizeDirection = "bottom-left";
				} else if (clickX <= x + 8 && clickY <= y + 8) {
					dragType = "resize";
					resizeDirection = "top-left";
				} else if (clickX >= x + width - 8) {
					dragType = "resize";
					resizeDirection = "right";
				} else if (clickX <= x + 8) {
					dragType = "resize";
					resizeDirection = "left";
				} else if (clickY >= y + height - 8) {
					dragType = "resize";
					resizeDirection = "bottom";
				} else if (clickY <= y + 8) {
					dragType = "resize";
					resizeDirection = "top";
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
		);

		const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

		const distanceX = clickX - mouseDownPosition.x;
		const distanceY = clickY - mouseDownPosition.y;

		if (
			(!object || object.type !== "text") &&
			selectedTool === "text" &&
			selectedObjectID === null
		) {
			addObject("text", clickX, clickY);
		} else if (
			(!object || object.type !== "image") &&
			selectedTool === "image"
		) {
			if (Math.abs(distanceX) > 5 || Math.abs(distanceY) > 5) {
				addObject(
					"image",
					distanceX > 0 ? mouseDownPosition.x : clickX,
					distanceY > 0 ? mouseDownPosition.y : clickY,
					distanceX > 0 ? clickX : mouseDownPosition.x,
					distanceY > 0 ? clickY : mouseDownPosition.y,
				);
			} else {
				addObject("image", clickX, clickY);
			}
		} else if (
			(!object || object.type !== "rectangle") &&
			selectedTool === "rectangle"
		) {
			if (Math.abs(distanceX) > 5 || Math.abs(distanceY) > 5) {
				addObject(
					"rectangle",
					distanceX > 0 ? mouseDownPosition.x : clickX,
					distanceY > 0 ? mouseDownPosition.y : clickY,
					distanceX > 0 ? clickX : mouseDownPosition.x,
					distanceY > 0 ? clickY : mouseDownPosition.y,
				);
			} else {
				addObject("rectangle", clickX, clickY);
			}
		} else {
			setSelectedObjectID(object?.id ?? null);
		}
	}

	function onMouseMove(e: any) {
		e.preventDefault();
		const object = GetObjectFromPointer(
			e,
			canvas,
			trayObject,
			currentDesign,
		);
		canvas.style.cursor =
			selectedTool === "text" ? "text" : object ? "pointer" : "default";

		// If the mouse is down right corner of an image, show resize cursor
		if (selectedObject && selectedObject === object && ctx) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				selectedObject,
			);

			const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

			if (
				selectedObject.type === "image" ||
				selectedObject.type === "rectangle"
			) {
				if (clickX >= x + width - 8 && clickY >= y + height - 8) {
					canvas.style.cursor = "nwse-resize";
				} else if (clickX >= x + width - 8 && clickY <= y + 8) {
					canvas.style.cursor = "nesw-resize";
				} else if (clickX <= x + 8 && clickY >= y + height - 8) {
					canvas.style.cursor = "nesw-resize";
				} else if (clickX <= x + 8 && clickY <= y + 8) {
					canvas.style.cursor = "nwse-resize";
				} else if (clickX >= x + width - 8) {
					canvas.style.cursor = "ew-resize";
				} else if (clickX <= x + 8) {
					canvas.style.cursor = "ew-resize";
				} else if (clickY >= y + height - 8) {
					canvas.style.cursor = "ns-resize";
				} else if (clickY <= y + 8) {
					canvas.style.cursor = "ns-resize";
				} else {
					canvas.style.cursor = "move";
				}
			}
		}

		if (dragObject && ctx) {
			const { clickX, clickY } = GetCoordsFromEvent(e, canvas);

			if (designEditorElement) {
				designEditorElement.style.pointerEvents = "none";
				designEditorElement.style.opacity = "0";
			}

			if (dragType === "move") {
				dragObject.x =
					(clickX - dragObjectOffset.x - trayObject.x) /
					(trayObject.width || 1);
				dragObject.y =
					(clickY - dragObjectOffset.y - trayObject.y) /
					(trayObject.height || 1);

				SnapObject(dragObject, ctx, trayObject);
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

			Draw({
				...currentDesign,
				objects: currentDesign.objects.map((obj) =>
					dragObject && obj.id === dragObject.id ? dragObject : obj,
				),
			});
		}
	}

	function addObject(
		type: "text" | "image" | "rectangle",
		pointerX: number = 0,
		pointerY: number = 0,
		pointerEndX?: number,
		pointerEndY?: number,
	) {
		const x = (pointerX - trayObject.x) / (trayObject.width || 1);
		const y = (pointerY - trayObject.y) / (trayObject.height || 1);

		const width = pointerEndX
			? (pointerEndX - pointerX) / (trayObject.width || 1)
			: 0.5;
		const height = pointerEndY
			? (pointerEndY - pointerY) / (trayObject.height || 1)
			: 0.5;

		const id =
			currentDesign.objects.length > 0
				? Math.max(...currentDesign.objects.map((o) => o.id)) + 1
				: 1;

		setCurrentDesign({
			...currentDesign,
			objects: [
				...currentDesign.objects,
				{
					...defaultDesign[type],
					id,
					x,
					y,
					width,
					height,
					order:
						Math.max(
							...currentDesign.objects.map((obj) => obj.order),
							0,
						) + 1,
				},
			],
		});

		setSelectedObjectID(id);

		if (selectedTool === "image" || selectedTool === "rectangle") {
			setSelectedTool("select");
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

	if (Math.abs(x) < snapDistance) {
		object.x = 0;
	}
	if (Math.abs(x + width - 1) < snapDistance) {
		object.x = 1 - width;
	}
	if (Math.abs(y) < snapDistance) {
		object.y = 0;
	}
	if (Math.abs(y + height - 1) < snapDistance) {
		object.y = 1 - height;
	}
	if (Math.abs(x + width / 2 - 0.5) < snapDistance) {
		object.x = 0.5 - width / 2;
	}
	if (Math.abs(y + height / 2 - 0.5) < snapDistance) {
		object.y = 0.5 - height / 2;
	}
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
	padding: number = 8,
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
