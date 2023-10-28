import { useEffect, useState } from "react";

export default function Design() {
	const standardTexts = [
		{
			x: 0.5,
			y: 0.5,
			text: "SUP",
			font: "Sans-serif",
			fontSize: 72,
			textAlign: "center",
			color: "rgb(255, 255, 255)",
			id: 0,
		},
	];

	const standardImages = [
		{
			x: 0.25,
			y: 0.25,
			width: 0.5,
			height: 0.5,
			src: "https://i.natgeofe.com/n/2a832501-483e-422f-985c-0e93757b7d84/6_3x2.jpg",
			color: "rgb(255, 255, 255)",
			radius: 48,
			id: 0,
		},
	];

	const [texts, setTexts] = useState<TextProps[]>(standardTexts);
	const [images, setImages] = useState<ObjectProps[]>(standardImages);
	const [selectedTextObj, setSelectedTextObj] = useState<TextProps | null>();

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;

		const tray = {
			x: (canvas.width - (canvas.height * 0.85 * 4) / 3) / 2,
			y: (canvas.height - canvas.height * 0.85) / 2,
			width: (canvas.height * 0.85 * 4) / 3,
			height: canvas.height * 0.85,
			radius: 128,
			borderWidth: 32,
		};

		const timer = setTimeout(() => {
			Draw(canvas, tray, texts, images);
		}, 100);

		const unsub = canvas.addEventListener("click", (e) => {
			setSelectedTextObj(HoveredCanvasText(e, canvas, tray, texts));
		});

		const unsub2 = canvas.addEventListener("mousemove", (e) => {
			if (HoveredCanvasText(e, canvas, tray, texts)) {
				canvas.style.cursor = "pointer";
			} else {
				canvas.style.cursor = "default";
			}
		});

		return () => {
			clearTimeout(timer);
			unsub;
			unsub2;
		};
	}, [texts]);

	return (
		<div className="max-w-7xl mx-auto px-8 py-16 space-y-8">
			<div className="grid grid-cols-4 grid-rows-2 gap-8">
				<div className="col-span-3">
					<canvas
						id="canvas"
						className="bg-gray-100 rounded-xl w-full"
						width={1280}
						height={720}
					></canvas>
				</div>
				<div className="row-span-2">
					<ul className="flex flex-col gap-4">
						<li className="w-full aspect-video bg-gray-100 rounded-xl"></li>
						<li className="w-full aspect-video bg-gray-100 rounded-xl"></li>
					</ul>
				</div>
				<div>
					{selectedTextObj && (
						<TextEditor
							text={
								texts.find(
									(t) => t.id === selectedTextObj.id
								) ?? selectedTextObj
							}
							setText={(text: TextProps) =>
								setTexts((prev) => {
									const index = prev.findIndex(
										(t) => t.id === text.id
									);
									prev[index] = text;
									return [...prev];
								})
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function TextEditor({ text, setText }: { text: TextProps; setText: Function }) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2">
				<div className="flex flex-col gap-1">
					<label htmlFor="text">Text</label>
					<input
						type="text"
						name="text"
						id="text"
						className="border border-gray-300 rounded-md p-2"
						value={text.text}
						onChange={(e) =>
							setText({ ...text, text: e.target.value })
						}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="font">Font</label>
					<select
						name="font"
						id="font"
						className="border border-gray-300 rounded-md p-2"
						value={text.font}
						onChange={(e) =>
							setText({ ...text, font: e.target.value })
						}
					>
						<option value="sans-serif">Sans-serif</option>
						<option value="serif">Serif</option>
						<option value="Pacifico">Pacifico</option>
					</select>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="fontSize">Font Size</label>
					<input
						type="number"
						name="fontSize"
						id="fontSize"
						className="border border-gray-300 rounded-md p-2"
						value={text.fontSize}
						onChange={(e) =>
							setText({
								...text,
								fontSize: parseInt(e.target.value),
							})
						}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="textAlign">Text Align</label>
					<select
						name="textAlign"
						id="textAlign"
						className="border border-gray-300 rounded-md p-2"
						value={text.textAlign}
						onChange={(e) =>
							setText({ ...text, textAlign: e.target.value })
						}
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</select>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="color">Color</label>
					<input
						type="color"
						name="color"
						id="color"
						className="border border-gray-300 rounded-md p-2"
						value={text.color}
						onChange={(e) =>
							setText({ ...text, color: e.target.value })
						}
					/>
				</div>
			</div>
			<div className="flex flex-row gap-2">
				<div className="flex flex-col gap-1">
					<label htmlFor="x">X (%)</label>
					<input
						type="number"
						name="x"
						id="x"
						className="border border-gray-300 rounded-md p-2"
						value={text.x * 100}
						onChange={(e) =>
							setText({
								...text,
								x:
									e.target.value.length !== 0
										? Number(e.target.value) / 100
										: undefined,
							})
						}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<label htmlFor="y">Y (%)</label>
					<input
						type="number"
						name="y"
						id="y"
						className="border border-gray-300 rounded-md p-2"
						value={text.y * 100}
						onChange={(e) =>
							setText({
								...text,
								y:
									e.target.value.length !== 0
										? Number(e.target.value) / 100
										: undefined,
							})
						}
					/>
				</div>
			</div>
		</div>
	);
}

function HoveredCanvasText(
	e: any,
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	texts: TextProps[]
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const rect = canvas.getBoundingClientRect();

	const clickX = e.offsetX * (canvas.width / rect.width);
	const clickY = e.offsetY * (canvas.height / rect.height);

	return texts.filter((text) => {
		const { width } = MeasureText(ctx, text);
		const x =
			tray.x +
			tray.width * text.x +
			(text.textAlign === "left"
				? width / 2
				: text.textAlign === "right"
				? -width / 2
				: 0);
		const y = tray.y + tray.height * text.y;

		if (
			clickX > x - width / 2 &&
			clickX < x + width / 2 &&
			clickY > y - text.fontSize / 2 &&
			clickY < y + text.fontSize / 2
		) {
			return text;
		}
	})[0];
}

async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	texts: TextProps[],
	images: ObjectProps[]
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	DrawTray(ctx, tray);

	await DrawImages(ctx, tray, images);

	DrawTexts(ctx, tray, texts);

	DrawTrayShadow(ctx, {
		x: tray.x + (tray.borderWidth ?? 0),
		y: tray.y + (tray.borderWidth ?? 0),
		width: tray.width - (tray.borderWidth ?? 0) * 2,
		height: tray.height - (tray.borderWidth ?? 0) * 2,
		radius: (tray.radius ?? 0) - (tray.borderWidth ?? 0),
		borderWidth: 16,
	});
}

interface TextProps {
	x: number;
	y: number;
	text: string;
	font: string;
	fontSize: number;
	textAlign: string;
	color: string;
	id: number;
}

interface ObjectProps {
	x: number;
	y: number;
	width: number;
	height: number;
	radius?: number;
	borderWidth?: number;
	src?: string;
	color?: string;
}

function MeasureText(ctx: CanvasRenderingContext2D, text: TextProps) {
	ctx.font = `bold ${text.fontSize}px ${text.font ?? "sans-serif"}`;
	return ctx.measureText(text.text);
}

function DrawTexts(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	texts: TextProps[]
) {
	texts.forEach((text) => {
		ctx.fillStyle = text.color;
		ctx.font = `bold ${text.fontSize}px ${text.font ?? "sans-serif"}`;
		ctx.textAlign = text.textAlign as CanvasTextAlign;
		ctx.textBaseline = "middle";
		ctx.fillText(
			text.text,
			(tray.x ?? 0) + tray.width * text.x,
			(tray.y ?? 0) + tray.height * text.y
		);
	});
}

async function DrawImages(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	images: ObjectProps[]
) {
	const loadImage = (image: ObjectProps): Promise<void> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = image.src ?? "";
			img.onload = () => {
				ctx.save();

				const x = tray.x + tray.width * image.x;
				const y = tray.y + tray.height * image.y;
				const width = image.width * tray.width;
				const height = image.height * tray.height;

				GetRoundedRect(ctx, x, y, width, height, image.radius ?? 0);
				ctx.clip();
				if (image.color) {
					ctx.fillStyle = image.color;
					ctx.fillRect(
						tray.x + tray.width * image.x,
						tray.y + tray.height * image.y,
						image.width * tray.width,
						image.height * tray.height
					);
				}

				ctx.drawImage(img, x, y, width, height);
				ctx.restore();
				resolve();
			};
		});
	};

	const loadingPromises: Promise<void>[] = images.map((image) =>
		loadImage(image)
	);
	await Promise.all(loadingPromises);
}

function DrawTray(ctx: any, { x, y, width, height, radius }: ObjectProps) {
	ctx.fillStyle = "#ddd";
	GetRoundedRect(ctx, x, y, width, height, radius ?? 0);
	ctx.fill();
	ctx.clip();
}

function DrawTrayShadow(
	ctx: any,
	{ x, y, width, height, radius, borderWidth }: ObjectProps
) {
	const gradient = ctx.createConicGradient(150, 0, 0);
	gradient.addColorStop(0, "#00000000");
	gradient.addColorStop(1, "#000000ff");
	ctx.strokeStyle = gradient;
	ctx.lineWidth = borderWidth ?? 0;
	GetRoundedRect(ctx, x, y, width, height, radius ?? 0);
	ctx.stroke();
}

function DrawShape(ctx: any, size: number) {
	// Draw text
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "#444";
	ctx.font = `bold ${64 * size}px sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("SALLY", ctx.width / 2, ctx.height / 2 - 96 * size);

	const heartCenterX = ctx.width / 2;
	const heartCenterY = ctx.height / 2 + 180 * size;
	const heartSize = 256 * size;

	ctx.strokeStyle = "#444";
	ctx.lineWidth = 4 * size;

	// Draw heart using heartSize
	ctx.beginPath();
	ctx.moveTo(heartCenterX, heartCenterY - (80 * heartSize) / 128);
	ctx.bezierCurveTo(
		heartCenterX,
		heartCenterY - (83 * heartSize) / 128,
		heartCenterX - (5 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128,
		heartCenterX - (25 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128
	);
	ctx.bezierCurveTo(
		heartCenterX - (55 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128,
		heartCenterX - (55 * heartSize) / 128,
		heartCenterY - (57.5 * heartSize) / 128,
		heartCenterX - (55 * heartSize) / 128,
		heartCenterY - (57.5 * heartSize) / 128
	);
	ctx.bezierCurveTo(
		heartCenterX - (55 * heartSize) / 128,
		heartCenterY - (40 * heartSize) / 128,
		heartCenterX - (35 * heartSize) / 128,
		heartCenterY - (18 * heartSize) / 128,
		heartCenterX,
		heartCenterY
	);
	ctx.bezierCurveTo(
		heartCenterX + (35 * heartSize) / 128,
		heartCenterY - (18 * heartSize) / 128,
		heartCenterX + (55 * heartSize) / 128,
		heartCenterY - (40 * heartSize) / 128,
		heartCenterX + (55 * heartSize) / 128,
		heartCenterY - (57.5 * heartSize) / 128
	);
	ctx.bezierCurveTo(
		heartCenterX + (55 * heartSize) / 128,
		heartCenterY - (57.5 * heartSize) / 128,
		heartCenterX + (55 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128,
		heartCenterX + (25 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128
	);
	ctx.bezierCurveTo(
		heartCenterX + (10 * heartSize) / 128,
		heartCenterY - (95 * heartSize) / 128,
		heartCenterX,
		heartCenterY - (83 * heartSize) / 128,
		heartCenterX,
		heartCenterY - (80 * heartSize) / 128
	);
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
