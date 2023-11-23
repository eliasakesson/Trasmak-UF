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
    Draw: (
	    design: DesignProps
    ) => void,
){
    console.log("Setup")
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    const selectedObject = currentDesign.objects.find((obj) => obj.id === selectedObjectID)

    let dragObject: ObjectProps | undefined = undefined;
    let dragObjectOffset: { x: number; y: number } = { x: 0, y: 0 };
    let dragType: "move" | "resize" | undefined = undefined;
    let mouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };

		function onMouseDown(e: any) {
			const clickX = e.offsetX * (canvas.width / rect.width);
			const clickY = e.offsetY * (canvas.height / rect.height);
			mouseDownPosition = { x: clickX, y: clickY };

			dragObject = GetObjectFromPointer(
				e,
				canvas,
				trayObject,
				currentDesign
			);

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

				if (dragObject.type === "image") {
					if (clickX >= x + width - 8) {
						dragType = "resize";
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
						dragObject && obj.id === dragObject.id
							? dragObject
							: obj
					),
				});
				dragObject = undefined;
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
				if (
					Math.abs(clickX - mouseDownPosition.x) > 5 ||
					Math.abs(clickY - mouseDownPosition.y) > 5
				) {
					addObject(
						"image",
						mouseDownPosition.x,
						mouseDownPosition.y,
						clickX,
						clickY
					);
				} else {
					addObject("image", clickX, clickY);
				}
			} else if (
				(!object || object.type !== "rectangle") &&
				selectedTool === "rectangle"
			) {
				if (
					Math.abs(clickX - mouseDownPosition.x) > 5 ||
					Math.abs(clickY - mouseDownPosition.y) > 5
				) {
					addObject(
						"rectangle",
						mouseDownPosition.x,
						mouseDownPosition.y,
						clickX,
						clickY
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
				selectedTool === "text"
					? "text"
					: object
					? "pointer"
					: "default";

			// If the mouse is down right corner of an image, show resize cursor
			if (selectedObject && selectedObject === object && ctx) {
				const { x, y, width, height } = GetObjectDimensions(
					ctx,
					trayObject,
					selectedObject
				);

				if (selectedObject.type === "image") {
					if (
						e.offsetX * (canvas.width / rect.width) >=
						x + width - 8
					) {
						canvas.style.cursor = "nwse-resize";
					}
				}
			}

			if (dragObject && ctx) {
				const rect = canvas.getBoundingClientRect();

				const clickX = e.offsetX * (canvas.width / rect.width);
				const clickY = e.offsetY * (canvas.height / rect.height);

				if (dragType === "move") {
					const width =
						dragObject.width ||
						GetObjectDimensions(ctx, trayObject, dragObject).width /
							(trayObject.width || 1);
					const height =
						dragObject.height ||
						GetObjectDimensions(ctx, trayObject, dragObject)
							.height / (trayObject.height || 1);

					dragObject.x =
						(clickX - dragObjectOffset.x - trayObject.x) /
						(trayObject.width || 1);
					dragObject.y =
						(clickY - dragObjectOffset.y - trayObject.y) /
						(trayObject.height || 1);

					const snapDistance = 0.01;

					if (Math.abs(dragObject.x) < snapDistance) {
						dragObject.x = 0;
					}
					if (Math.abs(dragObject.x + width - 1) < snapDistance) {
						dragObject.x = 1 - width;
					}
					if (Math.abs(dragObject.y) < snapDistance) {
						dragObject.y = 0;
					}
					if (Math.abs(dragObject.y + height - 1) < snapDistance) {
						dragObject.y = 1 - height;
					}
					if (
						Math.abs(dragObject.x + width / 2 - 0.5) < snapDistance
					) {
						dragObject.x = 0.5 - width / 2;
					}
					if (
						Math.abs(dragObject.y + height / 2 - 0.5) < snapDistance
					) {
						dragObject.y = 0.5 - height / 2;
					}
				} else if (dragType === "resize") {
					dragObject.width =
						(clickX - trayObject.x) / (trayObject.width || 1) -
						dragObject.x;
					dragObject.height =
						(clickY - trayObject.y) / (trayObject.height || 1) -
						dragObject.y;

					if (dragObject.width < 0) dragObject.width = 0;
					if (dragObject.height < 0) dragObject.height = 0;
					if (dragObject.width > 1 - dragObject.x)
						dragObject.width = 1 - dragObject.x;
					if (dragObject.height > 1 - dragObject.y)
						dragObject.height = 1 - dragObject.y;
				}

				Draw(
					{
						...currentDesign,
						objects: currentDesign.objects.map((obj) =>
							dragObject && obj.id === dragObject.id
								? dragObject
								: obj
						),
					}
				);
			}
		}

        function addObject(
            type: "text" | "image" | "rectangle",
            pointerX: number = 0,
            pointerY: number = 0,
            pointerEndX?: number,
            pointerEndY?: number
        ) {
            const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    
            const x = (pointerX - trayObject.x) / (trayObject.width || 1);
            const y = (pointerY - trayObject.y) / (trayObject.height || 1);
    
            const width = pointerEndX
                ? (pointerEndX - pointerX) / (trayObject.width || 1)
                : 0.2;
            const height = pointerEndY
                ? (pointerEndY - pointerY) / (trayObject.height || 1)
                : 0.2;
    
            setCurrentDesign({
                ...currentDesign,
                objects: [
                    ...currentDesign.objects,
                    {
                        ...defaultDesign[type],
                        id:
                            currentDesign.objects.length > 0
                                ? Math.max(
                                        ...currentDesign.objects.map((o) => o.id)
                                  ) + 1
                                : 1,
                        x,
                        y,
                        width,
                        height,
                        order:
                            Math.max(
                                ...currentDesign.objects.map((obj) => obj.order)
                            ) + 1,
                    },
                ],
            });
    
            if (selectedTool === "image" || selectedTool === "rectangle") {
                setSelectedTool("select");
            }
        }

        canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("click", onClick);

		return () => {
            console.log("Remove")
			canvas.removeEventListener("mousedown", onMouseDown);
			canvas.removeEventListener("mouseup", onMouseUp);
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("click", onClick);
		};
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
		.sort((a) => (a.type === "text" ? -1 : 1))
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