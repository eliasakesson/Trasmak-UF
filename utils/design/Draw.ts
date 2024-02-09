import { GetObjectDimensions } from "./Helper";
import { DesignProps, ObjectProps } from "./Interfaces";

export default async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null,
	showSupport: boolean = false,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	await DrawTray(ctx, design, tray);
	ctx.clip();

	design.objects?.sort((a, b) => {
		if (a.template !== true && b.template !== true) {
			return a.order - b.order;
		}

		return a.template === true ? 1 : -1;
	});

	for (let i = 0; i < design.objects?.length; i++) {
		const obj = design.objects?.[i];
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
	scale: number,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	await DrawTray(ctx, design, tray, false);
	ctx.clip();

	design.objects?.sort((a, b) => {
		if (a.template !== true && b.template !== true) {
			return a.order - b.order;
		}

		return a.template === true ? 1 : -1;
	});

	for (let i = 0; i < design.objects?.length; i++) {
		const obj = design.objects?.[i];
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
	scale: number = 1,
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
	scale: number = 1,
) {
	const { x, y, width, height } = GetObjectDimensions(ctx, tray, rectangle);

	// Make sure radius is not larger than half the width or height
	const radius = Math.max(
		Math.min(Math.min(width, height) / 2, (rectangle.radius ?? 0) * scale),
		0,
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
	scale: number = 1,
) {
	const loadImage = (image: ObjectProps): Promise<void> => {
		function DrawImage(
			image: ObjectProps,
			img: HTMLImageElement,
			resolve: any,
		) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				tray,
				image,
			);

			const { offsetX, offsetY, newWidth, newHeight } =
				GetImageDimensions(
					img,
					image.fit || "contain",
					x,
					y,
					width,
					height,
				);

			const minWidth = Math.min(width, newWidth);
			const minHeight = Math.min(height, newHeight);

			// Make sure radius is not larger than half the width or height
			const radius = Math.max(
				Math.min(
					Math.min(minWidth, minHeight) / 2,
					(image.radius ?? 0) * scale,
				),
				0,
			);

			ctx.save();
			GetRoundedRect(
				ctx,
				Math.max(x, offsetX),
				Math.max(y, offsetY),
				minWidth,
				minHeight,
				radius,
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
	height: number,
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
	selectedObjectID?: number | null,
) {
	if (selectedObjectID === null) return;

	const selectedObject = objects?.find(
		(obj: ObjectProps) => obj.id === selectedObjectID,
	);
	if (!selectedObject) return;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		tray,
		selectedObject,
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
		height + padding * 2,
	);
	ctx.restore();
}

async function DrawTray(
	ctx: any,
	design: DesignProps,
	tray: ObjectProps,
	shadow: boolean = true,
) {
	GetRoundedRect(
		ctx,
		tray.x,
		tray.y,
		tray.width ?? 0,
		tray.height ?? 0,
		tray.radius ?? 0,
	);
	if (shadow) {
		ctx.save();
		ctx.fillStyle = "#000000ff";
		ctx.shadowColor = "#00000077";
		ctx.shadowBlur = 100;
		ctx.shadowOffsetX = 25;
		ctx.shadowOffsetY = 25;
		ctx.fill();
		ctx.restore();
	}
	ctx.clip();

	function DrawImage(img: HTMLImageElement, resolve: any) {
		const { offsetX, offsetY, newWidth, newHeight } = GetImageDimensions(
			img,
			"cover",
			tray.x,
			tray.y,
			tray.width ?? 0,
			tray.height ?? 0,
		);

		GetRoundedRect(
			ctx,
			Math.max(tray.x, offsetX),
			Math.max(tray.y, offsetY),
			Math.min(tray.width ?? 0, newWidth),
			Math.min(tray.height ?? 0, newHeight),
			tray.radius ?? 0,
		);
		ctx.clip();

		ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
		ctx.restore();
		resolve();
	}

	await new Promise<void>((resolve) => {
		if (design.image) {
			let img = new Image();
			if (!design.imageElement) {
				img.crossOrigin = "anonymous";
				img.src = design.image ?? "";
				img.onload = () => DrawImage(img, resolve);
				img.onerror = () => {
					resolve();
				};
			} else {
				DrawImage(design.imageElement, resolve);
			}
		} else {
			ctx.fillStyle = design.color ?? "#eeeeee";
			ctx.fill();
			resolve();
		}
	});
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
		(tray.radius ?? 0) - (tray.bleed ?? 0) / 2,
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadow(ctx: any, tray: ObjectProps) {
	ctx.save();
	const gradient = ctx.createConicGradient(
		Math.PI / 2,
		tray.x + (tray.width ?? 0) / 2,
		tray.y + (tray.height ?? 0) / 2,
		360,
		360,
	);
	gradient.addColorStop(0, "#bbbbbb22");
	gradient.addColorStop(0.25, "#ffffff55");
	gradient.addColorStop(0.5, "#bbbbbb22");
	gradient.addColorStop(0.75, "#ffffff55");
	gradient.addColorStop(1, "#bbbbbb22");
	ctx.strokeStyle = gradient;
	ctx.filter = "blur(3px)";
	ctx.lineWidth = tray.edge ?? 0;
	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.radius ?? 0) - (tray.bleed ?? 0) - (tray.edge ?? 0) / 2,
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
		tray.radius ?? 0,
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
	radius: number,
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();
}
