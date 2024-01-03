import { GetObjectDimensions } from "./Helper";
import { DesignProps, ObjectProps } from "./Interfaces";

export default async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null,
	showSupport: boolean = false
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	DrawTray(ctx, tray);

	design.objects.sort((a, b) => a.order - b.order);

	for (let i = 0; i < design.objects.length; i++) {
		const obj = design.objects[i];
		if (obj.type === "text") {
			DrawText(ctx, tray, obj);
		} else if (obj.type === "rectangle") {
			DrawRectangle(ctx, tray, obj);
		} else if (obj.type === "image") {
			await DrawImage(ctx, tray, obj);
		}
	}

	if (showSupport) {
		DrawTraySupport(ctx, tray);
		DrawTrayShadow(ctx, tray);
	}

	DrawTrayShadow(ctx, tray);
	DrawTrayBorder(ctx, tray);

	ctx.restore();

	HighlightSelectedObject(ctx, tray, design.objects, selectedObjectID);
}

export async function DrawRender(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	scale: number
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	DrawTray(ctx, tray);

	design.objects.sort((a, b) => a.order - b.order);

	for (let i = 0; i < design.objects.length; i++) {
		const obj = design.objects[i];
		console.log(obj);
		if (obj.type === "text") {
			DrawText(ctx, tray, obj, scale);
		} else if (obj.type === "rectangle") {
			DrawRectangle(ctx, tray, obj, scale);
		} else if (obj.type === "image") {
			await DrawImage(ctx, tray, obj, scale);
		}
	}
}

function DrawText(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	text: ObjectProps,
	scale: number = 1
) {
	ctx.fillStyle = text.color ?? "#000";
	ctx.font = `bold ${(text.size ?? 1) * scale}px ${
		text.font ?? "sans-serif"
	}`;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	const lines = text.content.split("\n");

	lines.forEach((line, i) => {
		const x = (tray.x ?? 0) + (tray.width ?? 0) * text.x;
		const y =
			(tray.y ?? 0) +
			(tray.height ?? 0) * text.y +
			(text.size ?? 0) * scale * i;

		ctx.fillText(line, x, y);
	});
}

function DrawRectangle(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	rectangle: ObjectProps,
	scale: number = 1
) {
	const { x, y, width, height } = GetObjectDimensions(ctx, tray, rectangle);

	// Make sure radius is not larger than half the width or height
	const radius = Math.max(
		Math.min(Math.min(width, height) / 2, (rectangle.radius ?? 0) * scale),
		0
	);

	ctx.save();
	GetRoundedRect(ctx, x, y, width, height, radius);
	ctx.clip();

	ctx.fillStyle = rectangle.color ?? "#000";
	ctx.fillRect(x, y, width, height);
	ctx.restore();
}

async function DrawImage(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	image: ObjectProps,
	scale: number = 1
) {
	const loadImage = (image: ObjectProps): Promise<void> => {
		function DrawImage(
			image: ObjectProps,
			img: HTMLImageElement,
			resolve: any
		) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				tray,
				image
			);

			// Make sure radius is not larger than half the width or height
			const radius = Math.max(
				Math.min(
					Math.min(width, height) / 2,
					(image.radius ?? 0) * scale
				),
				0
			);

			const { offsetX, offsetY, newWidth, newHeight } =
				GetImageDimensions(
					img,
					image.fit || "contain",
					x,
					y,
					width,
					height
				);

			ctx.save();
			GetRoundedRect(
				ctx,
				Math.max(x, offsetX),
				Math.max(y, offsetY),
				Math.min(width, newWidth),
				Math.min(height, newHeight),
				radius
			);
			ctx.clip();

			ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
			ctx.restore();
			resolve();
		}

		return new Promise((resolve) => {
			if (image.image) {
				DrawImage(image, image.image, resolve);
				return;
			}

			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = image.content;
			img.onload = () => {
				DrawImage(image, img, resolve);
			};
			img.onerror = () => {
				resolve();
			};
		});
	};

	await loadImage(image);
}

function GetImageDimensions(
	image: HTMLImageElement,
	type: string,
	x: number,
	y: number,
	width: number,
	height: number
) {
	if (type === "fill") {
		return { offsetX: x, offsetY: y, newWidth: width, newHeight: height };
	}

	// Calculate scaling factors for width and height
	const scaleX = width / image.width;
	const scaleY = height / image.height;

	// Choose the larger scale to cover the target area
	const scale =
		type === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

	// Calculate the new image dimensions
	const newWidth = image.width * scale;
	const newHeight = image.height * scale;

	// Calculate the position to center the image on the target area
	const offsetX = x + (width - newWidth) / 2;
	const offsetY = y + (height - newHeight) / 2;

	return { offsetX, offsetY, newWidth, newHeight };
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

	const padding = selectedObject.type === "text" ? 8 : 2;

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

function DrawTray(
	ctx: any,
	{ x, y, width, height, radius, color, content }: ObjectProps
) {
	if (content) {
	} else {
		GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
		ctx.fillStyle = color ?? "#eeeeee";
		ctx.fill();
	}
	ctx.clip();
}

function DrawTraySupport(ctx: CanvasRenderingContext2D, tray: ObjectProps) {
	// Draw a stroke inside the tray with a width of half the bleed
	ctx.save();
	ctx.strokeStyle = "#ff676caa";
	ctx.lineWidth = tray.bleed ?? 0;
	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0),
		(tray.radius ?? 0) - (tray.bleed ?? 0) / 2
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadow(ctx: any, tray: ObjectProps) {
	ctx.save();
	ctx.strokeStyle = tray.color === "#ffffff" ? "#00000011" : "#ffffff55";
	ctx.lineWidth = tray.edge ?? 0;
	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.radius ?? 0) - (tray.bleed ?? 0) - (tray.edge ?? 0) / 2
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayBorder(ctx: any, tray: ObjectProps) {
	ctx.save();
	ctx.strokeStyle = "#777";
	ctx.lineWidth = 1;
	GetRoundedRect(
		ctx,
		tray.x,
		tray.y,
		tray.width ?? 0,
		tray.height ?? 0,
		tray.radius ?? 0
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadowOld(ctx: any, { x, y, width, height, radius }: any) {
	ctx.save();
	let lineWidth = 12;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "#00000044";
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.stroke();
	ctx.strokeStyle = "#00000022";
	GetRoundedRect(
		ctx,
		x + lineWidth,
		y + lineWidth,
		width - lineWidth * 2,
		height - lineWidth * 2,
		radius - lineWidth
	);
	ctx.stroke();
	lineWidth = 24;
	GetRoundedRect(
		ctx,
		x + lineWidth,
		y + lineWidth,
		width - lineWidth * 2,
		height - lineWidth * 2,
		radius - lineWidth
	);
	ctx.stroke();
	ctx.restore();
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

	if (height >= width && width / 2 <= radius) {
		ctx.arc(x + radius, y + radius, radius, Math.PI / 2, (Math.PI * 3) / 2);
		ctx.lineTo(x + width - radius, y);
		ctx.arc(
			x + width - radius,
			y + radius,
			radius,
			(Math.PI * 3) / 2,
			Math.PI / 2
		);
		ctx.lineTo(x + radius, y + height);
	} else {
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(
			x + width,
			y + height,
			x + width,
			y + height - radius
		);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
	}

	ctx.closePath();
}
