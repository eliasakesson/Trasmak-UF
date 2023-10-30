import {
	useEffect,
	useState,
	useContext,
	createContext,
	createElement,
} from "react";
import designs from "../../data/designs.json";
import defaultDesign from "../../data/defaultdesign.json";
import { useRouter } from "next/router";
import { FaPlus, FaTrash } from "react-icons/fa";

const SelectedObjectContext = createContext({
	object: null as ObjectProps | null,
	setObject: (obj: ObjectProps) => {},
});

interface DesignProps {
	id: string;
	objects: ObjectProps[];
}

interface ObjectProps {
	id: number;
	type: string;
	content: string;
	x: number;
	y: number;
	color: string;

	font?: string;
	size?: number;
	align?: string;
	baseline?: string;

	width?: number;
	height?: number;
	radius?: number;
}

export default function Design() {
	const router = useRouter();

	const [currentDesign, setCurrentDesign] = useState<DesignProps>(designs[0]);
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null
	);

	console.log(currentDesign);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;

		const tray = GetTrayObjFromCanvas(canvas);

		if (router.query.d) {
			const design = designs.find((d) => d.id === router.query.d);
			if (design) setCurrentDesign(design);
		}

		const timer = setTimeout(() => {
			Draw(canvas, tray, currentDesign, selectedObjectID);
		}, 100);

		function onClick(e: any) {
			setSelectedObjectID(
				HoveredCanvasText(e, canvas, tray, currentDesign)?.id ?? null
			);
		}

		function onHover(e: any) {
			if (HoveredCanvasText(e, canvas, tray, currentDesign)) {
				canvas.style.cursor = "pointer";
			} else {
				canvas.style.cursor = "default";
			}
		}

		canvas.addEventListener("click", onClick);
		canvas.addEventListener("mousemove", onHover);

		return () => {
			clearTimeout(timer);
			canvas.removeEventListener("click", onClick);
			canvas.removeEventListener("mousemove", onHover);
		};
	}, [currentDesign, router.query.d, selectedObjectID]);

	async function addToCart() {
		// Create a new canvas
		const canvas = document.createElement("canvas");
		canvas.width = 960;
		canvas.height = 720;

		// Draw the design on the canvas
		await DrawRender(canvas, currentDesign);

		// Convert the canvas to a base64 image
		const image = canvas.toDataURL("image/png");
		console.log(image);
	}

	function addObject(type: "text" | "image") {
		setCurrentDesign({
			...currentDesign,
			objects: [
				...currentDesign.objects,
				{
					id:
						currentDesign.objects.length > 0
							? Math.max(
									...currentDesign.objects.map((o) => o.id)
							  ) + 1
							: 1,
					...defaultDesign[type],
				},
			],
		});
	}

	return (
		<div className="max-w-7xl mx-auto px-8 py-16 space-y-8">
			<div className="grid md:grid-cols-4 md:grid-rows-2 gap-8">
				<div className="col-span-3 relative">
					<canvas
						id="canvas"
						className="bg-gray-100 rounded-xl w-full"
						width={1280}
						height={720}></canvas>
					<div className="absolute left-4 right-4 bottom-4 flex justify-between">
						<div className="flex gap-4">
							<button
								onClick={() => addObject("text")}
								className="border-2 bg-gray-50 rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
								<FaPlus /> Text
							</button>
							<button
								onClick={() => addObject("image")}
								className="border-2 bg-gray-50 rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
								<FaPlus /> Bild
							</button>
						</div>
						<button
							onClick={addToCart}
							className="bg-primary text-white rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
							Lägg till i kundvagn
						</button>
					</div>
				</div>
				<div className="row-span-2">
					<div className="mb-4 flex gap-4"></div>
					{selectedObjectID && (
						<DesignEditor
							object={
								currentDesign?.objects.find(
									(obj) => obj.id === selectedObjectID
								) ?? null
							}
							setObject={(obj: ObjectProps) =>
								setCurrentDesign((design) => {
									if (!design) return design;
									const objects = design.objects.map((o) => {
										if (o.id === obj.id) return obj;
										return o;
									});
									return { ...design, objects };
								})
							}
							removeObject={() => {
								setCurrentDesign((design) => {
									if (!design) return design;
									const objects = design.objects.filter(
										(o) => o.id !== selectedObjectID
									);
									return { ...design, objects };
								});
								setSelectedObjectID(null);
							}}
						/>
					)}
				</div>
				<div className="col-span-3">
					<h2 className="text-xl font-bold border-b pb-2 mb-4">
						Designs
					</h2>
					<MiniCanvases
						designs={designs}
						setCurrentDesign={(design) => {
							setCurrentDesign(design);
							setSelectedObjectID(null);
						}}
					/>
				</div>
			</div>
		</div>
	);
}

function MiniCanvases({
	designs,
	setCurrentDesign,
}: {
	designs: DesignProps[];
	setCurrentDesign: (design: DesignProps) => void;
}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			const canvases = document.querySelectorAll(".minicanvas");
			canvases.forEach((canvas, i) => {
				const tray = GetTrayObjFromCanvas(canvas as HTMLCanvasElement);
				Draw(canvas as HTMLCanvasElement, tray, designs[i]);
			});
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	return (
		<div className="grid grid-cols-3 gap-4">
			{designs.map((design) => (
				<li key={design.id} className="list-none">
					<button
						onClick={() => setCurrentDesign(design)}
						className="w-full aspect-video bg-gray-100 rounded-xl">
						<canvas
							className="minicanvas bg-gray-100 rounded-xl w-full"
							width={1280}
							height={720}></canvas>
					</button>
				</li>
			))}
		</div>
	);
}

function DesignEditor({
	object,
	setObject,
	removeObject,
}: {
	object: ObjectProps | null;
	setObject: (obj: ObjectProps) => void;
	removeObject: () => void;
}) {
	if (!object) return null;

	return (
		<SelectedObjectContext.Provider value={{ object, setObject }}>
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-bold border-b pb-2 flex items-center justify-between">
					{object?.type === "text" && "Text"}
					{object?.type === "image" && "Bild"}
					<FaTrash
						className="cursor-pointer"
						onClick={() => removeObject()}
					/>
				</h2>
				<TextArea
					label={object?.type === "text" ? "Text" : "Bildkälla"}
					objKey="content"
				/>
				<Select
					label="Font"
					objKey="font"
					options={["Arial", "Times New Roman", "Courier New"]}
				/>
				<div className="flex flex-row md:flex-nowrap flex-wrap gap-2">
					<Select
						label="Textjustering"
						objKey="align"
						options={["Left", "Center", "Right"]}
					/>
					<Select
						label="Textbas"
						objKey="baseline"
						options={["Top", "Middle", "Bottom"]}
					/>
				</div>
				<Input label="Textstorlek (px)" objKey="size" type="number" />
				<Input label="Färg" objKey="color" type="color" />
				<div className="flex flex-row flex-wrap gap-2">
					<Input label="Vänster (%)" objKey="x" type="number" />
					<Input label="Topp (%)" objKey="y" type="number" />
				</div>
				<div className="flex flex-row flex-wrap gap-2">
					<Input label="Bredd (%)" objKey="width" type="number" />
					<Input label="Höjd (%)" objKey="height" type="number" />
				</div>
				<Input label="Rundning (px)" objKey="radius" type="number" />
			</div>
		</SelectedObjectContext.Provider>
	);
}

function TextArea({ label, objKey }: { label: string; objKey: "content" }) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex flex-col gap-1 grow">
			<label htmlFor={label}>{label}</label>
			<textarea
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2"
				rows={5}
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}
			/>
		</div>
	);
}

function Input({
	label,
	objKey,
	type = "text",
}: {
	label: string;
	objKey: "x" | "y" | "width" | "height" | "radius" | "size" | "color";
	type?: string;
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	if (type === "color")
		return (
			<div className="flex flex-col gap-1 grow">
				<label htmlFor={label}>{label}</label>
				<div className="relative rounded-md border border-gray-300 py-4">
					<input
						type="color"
						name={label}
						id={label}
						className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
						value={object[objKey]}
						onChange={(e) =>
							setObject({
								...(object as ObjectProps),
								[objKey]: e.target.value,
							})
						}
					/>
					<div
						className="absolute inset-0 pointer-events-none rounded-[4px]"
						style={{
							backgroundColor: object[objKey] as string,
						}}></div>
				</div>
			</div>
		);

	return (
		<div className="flex flex-col gap-1 grow">
			<label htmlFor={label}>{label}</label>
			<input
				type={type}
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2"
				value={objKey in object ? object[objKey] : ""}
				onChange={(e) =>
					setObject({
						...object,
						[objKey]:
							type === "number"
								? Number(e.target.value)
								: e.target.value,
					})
				}
			/>
		</div>
	);
}

function Select({
	label,
	objKey,
	options,
}: {
	label: string;
	objKey: "font" | "align" | "baseline";
	options: string[];
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex flex-col gap-1 grow">
			<label htmlFor={label}>{label}</label>
			<select
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2"
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}>
				{options?.map((option, i) => (
					<option key={i} value={option.toLowerCase()}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}

function HoveredCanvasText(
	e: any,
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	currentDesign: DesignProps
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
			if (clickX >= x && clickX <= x + width) {
				if (clickY >= y && clickY <= y + height) {
					return true;
				}
			}
		});
}

function GetObjectDimensions(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	obj: ObjectProps
) {
	function MeasureText(ctx: CanvasRenderingContext2D, text: ObjectProps) {
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		return ctx.measureText(text.content);
	}

	const width =
		(obj?.width && obj.width * (tray.width ?? 0)) ||
		MeasureText(ctx, obj).width;
	const height =
		(obj?.height && obj.height * (tray.height ?? 0)) || obj.size || 0;

	const x =
		tray.x +
		(tray.width ?? 0) * obj.x +
		(obj.align === "center" ? -width / 2 : 0) +
		(obj.align === "right" ? -width : 0);
	const y =
		tray.y +
		(tray.height ?? 0) * obj.y +
		(obj.baseline === "middle" ? -height / 2 : 0) +
		(obj.baseline === "bottom" ? -height : 0);

	return { x, y, width, height };
}

async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	DrawTray(ctx, tray);

	await DrawImages(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "image")
	);

	DrawTexts(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "text")
	);

	HighlightSelectedObject(ctx, tray, design.objects, selectedObjectID);

	const borderWidth = 32;

	DrawTrayShadow(ctx, {
		x: tray.x + borderWidth,
		y: tray.y + borderWidth,
		width: (tray.width ?? 0) - borderWidth * 2,
		height: (tray.height ?? 0) - borderWidth * 2,
		radius: (tray.radius ?? 0) - borderWidth,
	});
}

async function DrawRender(canvas: HTMLCanvasElement, design: DesignProps) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const tray = GetTrayObjFromCanvas(canvas, 1);

	await DrawImages(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "image")
	);

	DrawTexts(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "text")
	);
}

function DrawTexts(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	texts: ObjectProps[]
) {
	texts.forEach((text) => {
		ctx.fillStyle = text.color;
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		ctx.textAlign = text.align as CanvasTextAlign;
		ctx.textBaseline = text.baseline as CanvasTextBaseline;
		const lines = text.content.split("\n");
		lines.forEach((line, i) => {
			ctx.fillText(
				line,
				(tray.x ?? 0) + (tray.width ?? 0) * text.x,
				(tray.y ?? 0) +
					(tray.height ?? 0) * text.y +
					(text.size ?? 0) * (i - (lines.length - 1) / 2)
			);
		});
	});
}

async function DrawImages(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	images: ObjectProps[]
) {
	const loadImage = (image: ObjectProps): Promise<void> => {
		return new Promise((resolve) => {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				tray,
				image
			);

			ctx.save();
			GetRoundedRect(ctx, x, y, width, height, image.radius ?? 0);
			ctx.clip();

			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = image.content;
			img.onload = () => {
				ctx.fillStyle = image.color;
				ctx.fillRect(x, y, width, height);

				ctx.drawImage(img, x, y, width, height);
				ctx.restore();
				resolve();
			};
			img.onerror = () => {
				ctx.fillStyle = image.color;
				ctx.fillRect(x, y, width, height);
				ctx.restore();
				resolve();
			};
		});
	};

	const loadingPromises: Promise<void>[] = images.map((image) =>
		loadImage(image)
	);

	try {
		await Promise.all(loadingPromises);
		ctx.restore();
	} catch (error) {
		console.error(error);
	}
}

function HighlightSelectedObject(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	objects: ObjectProps[],
	selectedObjectID?: number | null
) {
	if (selectedObjectID === null) return;

	const selectedObject = objects.find(
		(obj: ObjectProps) => obj.id === selectedObjectID
	);
	if (!selectedObject) return;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		tray,
		selectedObject
	);

	const padding = selectedObject.type === "text" ? 16 : 2;

	ctx.save();
	ctx.strokeStyle = "#999";
	ctx.lineWidth = 4;
	ctx.setLineDash([10, 5]);
	ctx.strokeRect(
		x - padding,
		y - padding,
		width + padding * 2,
		height + padding * 2
	);
	ctx.restore();
}

function DrawTray(ctx: any, { x, y, width, height, radius }: ObjectProps) {
	ctx.fillStyle = "#ddd";
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.fill();
	ctx.clip();
}

function DrawTrayShadow(ctx: any, { x, y, width, height, radius }: any) {
	const gradient = ctx.createConicGradient(250, 0, 0);
	gradient.addColorStop(0, "#00000000");
	gradient.addColorStop(1, "#000000ff");
	ctx.strokeStyle = gradient;
	ctx.lineWidth = 16;
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.stroke();
}

function GetRoundedRect(
	ctx: any,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
	ctx.lineTo(x + width - radius, y + height);
	ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	ctx.lineTo(x + width, y + radius);
	ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
	ctx.lineTo(x + radius, y);
	ctx.quadraticCurveTo(x, y, x, y + radius);
	ctx.closePath();
}

function GetTrayObjFromCanvas(
	canvas: HTMLCanvasElement,
	heightProcentage: number = 0.85
): ObjectProps {
	return {
		id: 0,
		type: "tray",
		content: "",
		color: "",
		x: (canvas.width - (canvas.height * heightProcentage * 4) / 3) / 2,
		y: (canvas.height - canvas.height * heightProcentage) / 2,
		width: (canvas.height * heightProcentage * 4) / 3,
		height: canvas.height * heightProcentage,
		radius: 128,
	};
}
