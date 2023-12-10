import { DesignProps, ObjectProps } from "@/pages/design";
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
	Draw: (design: DesignProps) => void
) {
	const ctx = canvas.getContext("2d");
	const rect = canvas.getBoundingClientRect();

	const selectedObject = currentDesign.objects.find(
		(obj) => obj.id === selectedObjectID
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
		const clickX = e.offsetX * (canvas.width / rect.width);
		const clickY = e.offsetY * (canvas.height / rect.height);
		mouseDownPosition = { x: clickX, y: clickY };

		dragObject = GetObjectFromPointer(e, canvas, trayObject, currentDesign);

		if (dragObject && ctx && selectedObjectID !== null) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				dragObject
			);

			dragObjectOffset = {
				x:
					clickX -
					x -
					(dragObject.align === "center" ? width / 2 : 0) -
					(dragObject.align === "right" ? width : 0),
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
					dragObject && obj.id === dragObject.id ? dragObject : obj
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
			currentDesign
		);

		const clickX = e.offsetX * (canvas.width / rect.width);
		const clickY = e.offsetY * (canvas.height / rect.height);

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
					distanceY > 0 ? clickY : mouseDownPosition.y
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
					distanceY > 0 ? clickY : mouseDownPosition.y
				);
			} else {
				addObject("rectangle", clickX, clickY);
			}
		} else {
			setSelectedObjectID(object?.id ?? null);
		}
	}

	function onMouseMove(e: any) {
		const object = GetObjectFromPointer(
			e,
			canvas,
			trayObject,
			currentDesign
		);
		canvas.style.cursor =
			selectedTool === "text" ? "text" : object ? "pointer" : "default";

		// If the mouse is down right corner of an image, show resize cursor
		if (selectedObject && selectedObject === object && ctx) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				selectedObject
			);

			const mouseX = e.offsetX * (canvas.width / rect.width);
			const mouseY = e.offsetY * (canvas.height / rect.height);

			if (
				selectedObject.type === "image" ||
				selectedObject.type === "rectangle"
			) {
				if (mouseX >= x + width - 8 && mouseY >= y + height - 8) {
					canvas.style.cursor = "nwse-resize";
				} else if (mouseX >= x + width - 8 && mouseY <= y + 8) {
					canvas.style.cursor = "nesw-resize";
				} else if (mouseX <= x + 8 && mouseY >= y + height - 8) {
					canvas.style.cursor = "nesw-resize";
				} else if (mouseX <= x + 8 && mouseY <= y + 8) {
					canvas.style.cursor = "nwse-resize";
				} else if (mouseX >= x + width - 8) {
					canvas.style.cursor = "ew-resize";
				} else if (mouseX <= x + 8) {
					canvas.style.cursor = "ew-resize";
				} else if (mouseY >= y + height - 8) {
					canvas.style.cursor = "ns-resize";
				} else if (mouseY <= y + 8) {
					canvas.style.cursor = "ns-resize";
				} else {
					canvas.style.cursor = "move";
				}
			}
		}

		if (dragObject && ctx) {
			const rect = canvas.getBoundingClientRect();

			const clickX = e.offsetX * (canvas.width / rect.width);
			const clickY = e.offsetY * (canvas.height / rect.height);

			if (designEditorElement) {
				designEditorElement.style.pointerEvents = "none";
				designEditorElement.style.opacity = "0";
			}

			if (dragType === "move") {
				const width =
					dragObject.width ||
					GetObjectDimensions(ctx, trayObject, dragObject).width /
						(trayObject.width || 1);
				const height =
					dragObject.height ||
					GetObjectDimensions(ctx, trayObject, dragObject).height /
						(trayObject.height || 1);

				dragObject.x =
					(clickX - dragObjectOffset.x - trayObject.x) /
					(trayObject.width || 1);
				dragObject.y =
					(clickY - dragObjectOffset.y - trayObject.y) /
					(trayObject.height || 1);

				SnapObject(dragObject);
			} else if (dragType === "resize") {
				if (
					resizeDirection === "top-right" ||
					resizeDirection === "right" ||
					resizeDirection === "bottom-right"
				) {
					dragObject.width = Math.max(
						0,
						(clickX - trayObject.x) / (trayObject.width || 1) -
							dragObject.x
					);
				} else if (
					resizeDirection === "top-left" ||
					resizeDirection === "left" ||
					resizeDirection === "bottom-left"
				) {
					const oldX = dragObject.x ?? 0;
					dragObject.x =
						(clickX - trayObject.x) / (trayObject.width || 1);
					dragObject.width = Math.max(
						0,
						oldX - dragObject.x + (dragObject.width ?? 0)
					);
				}

				if (
					resizeDirection === "top-left" ||
					resizeDirection === "top" ||
					resizeDirection === "top-right"
				) {
					const oldY = dragObject.y ?? 0;
					dragObject.y =
						(clickY - trayObject.y) / (trayObject.height || 1);
					dragObject.height = Math.max(
						0,
						oldY - dragObject.y + (dragObject.height ?? 0)
					);
				} else if (
					resizeDirection === "bottom-left" ||
					resizeDirection === "bottom" ||
					resizeDirection === "bottom-right"
				) {
					dragObject.height = Math.max(
						(clickY - trayObject.y) / (trayObject.height || 1) -
							dragObject.y
					);
				}
			}

			Draw({
				...currentDesign,
				objects: currentDesign.objects.map((obj) =>
					dragObject && obj.id === dragObject.id ? dragObject : obj
				),
			});
		}
	}

	function addObject(
		type: "text" | "image" | "rectangle",
		pointerX: number = 0,
		pointerY: number = 0,
		pointerEndX?: number,
		pointerEndY?: number
	) {
		const x = (pointerX - trayObject.x) / (trayObject.width || 1);
		const y = (pointerY - trayObject.y) / (trayObject.height || 1);

		const width = pointerEndX
			? (pointerEndX - pointerX) / (trayObject.width || 1)
			: 0.2;
		const height = pointerEndY
			? (pointerEndY - pointerY) / (trayObject.height || 1)
			: 0.2;

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
							0
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

	return () => {
		canvas.removeEventListener("mousedown", onMouseDown);
		canvas.removeEventListener("mouseup", onMouseUp);
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("click", onClick);
	};
}

function SnapObject(object: ObjectProps) {
	const snapDistance = 0.01;

	const width = object.width || 0;
	const height = object.height || 0;

	if (Math.abs(object.x) < snapDistance) {
		object.x = 0;
	}
	if (Math.abs(object.x + width - 1) < snapDistance) {
		object.x = 1 - width;
	}
	if (Math.abs(object.y) < snapDistance) {
		object.y = 0;
	}
	if (Math.abs(object.y + height - 1) < snapDistance) {
		object.y = 1 - height;
	}
	if (Math.abs(object.x + width / 2 - 0.5) < snapDistance) {
		object.x = 0.5 - width / 2;
	}
	if (Math.abs(object.y + height / 2 - 0.5) < snapDistance) {
		object.y = 0.5 - height / 2;
	}
}

function GetObjectFromPointer(
	e: any,
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	currentDesign: DesignProps,
	padding: number = 8
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const rect = canvas.getBoundingClientRect();

	const clickX = e.offsetX * (canvas.width / rect.width);
	const clickY = e.offsetY * (canvas.height / rect.height);

	return currentDesign.objects
		.sort((a, b) => b.order - a.order)
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
