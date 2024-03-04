import { GetObjectDimensions } from "./Helper";
import { DesignProps, ObjectProps } from "./Interfaces";

export default async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null,
	showSupport: boolean = false,
	scale: number = 1,
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
			DrawText(ctx, tray, obj, scale);
		} else if (obj.type === "rectangle") {
			DrawRectangle(ctx, tray, obj);
		} else if (obj.type === "image") {
			await DrawImage(ctx, tray, obj);
		}
	}

	if (showSupport) {
		DrawTraySupport(ctx, tray);
		DrawTrayShadow(ctx, tray, scale);
	}

	DrawTrayShadow(ctx, tray, scale);
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
			DrawRectangle(ctx, tray, obj);
		} else if (obj.type === "image") {
			await DrawImage(ctx, tray, obj);
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
) {
	const { x, y, width, height } = GetObjectDimensions(ctx, tray, rectangle);

	// Make sure radius is not larger than half the width or height
	const radius = Math.max(
		Math.min(Math.min(width, height) / 2, rectangle.radius ?? 0),
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
			img.crossOrigin = "anonymous";
			image.image = img;

			const { offsetX, offsetY, newWidth, newHeight } =
				GetImageDimensions2(ctx, tray, image, image.fit);

			const minWidth = Math.min(width, newWidth);
			const minHeight = Math.min(height, newHeight);

			// Make sure radius is not larger than half the width or height
			const radius = Math.max(
				Math.min(Math.min(minWidth, minHeight) / 2, image.radius ?? 0),
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
	x: number,
	y: number,
	width: number,
	height: number,
) {
	// Calculate scaling factors for width and height
	const scaleX = width / image.width;
	const scaleY = height / image.height;

	// Choose the larger scale to cover the target area
	const scale = Math.max(scaleX, scaleY);

	// Calculate the new image dimensions
	const newWidth = image.width * scale;
	const newHeight = image.height * scale;

	// Calculate the position to center the image on the target area
	const offsetX = x + (width - newWidth) / 2;
	const offsetY = y + (height - newHeight) / 2;

	return { offsetX, offsetY, newWidth, newHeight };
}

function GetImageDimensions2(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	image: ObjectProps,
	type: string = "cover",
): { offsetX: number; offsetY: number; newWidth: number; newHeight: number } {
	if (!image.image) {
		return { offsetX: 0, offsetY: 0, newWidth: 0, newHeight: 0 };
	}

	const { x, y, width, height } = GetObjectDimensions(ctx, tray, image);

	if (type === "fill") {
		const { x, y, width, height } = GetObjectDimensions(ctx, tray, image);
		return { offsetX: x, offsetY: y, newWidth: width, newHeight: height };
	}
	const scaleX = (width / image.image.width) * (image.zoom ?? 1);
	const scaleY = (height / image.image.height) * (image.zoom ?? 1);

	// Choose the larger scale to cover the target area
	const scale =
		type === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

	// Calculate the new image dimensions
	const newWidth = image.image.width * scale;
	const newHeight = image.image.height * scale;

	// Calculate the position to center the image on the target area
	const offsetX = x + (width - newWidth) * (image.imageX ?? 0.5);
	const offsetY = y + (height - newHeight) * (image.imageY ?? 0.5);

	return { offsetX, offsetY, newWidth, newHeight };
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
		ctx.shadowColor = "#00000055";
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
			tray.x,
			tray.y,
			tray.width ?? 0,
			tray.height ?? 0,
		);

		if (tray.width === tray.height) {
			ctx.translate(offsetX + newWidth / 2, offsetY + newHeight / 2);
			ctx.rotate(Math.PI / 2);
			ctx.translate(
				-(offsetX + newWidth / 2),
				-(offsetY + newHeight / 2),
			);
		}

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

	const minSide = Math.min(tray.width ?? 0, tray.height ?? 0);
	const isCircular = tray.width === tray.height;
	const radius = isCircular
		? tray.radius ?? 0
		: (tray.radius ?? 0) - (tray.bleed ?? 0) / (minSide * 2);

	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0),
		radius,
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadow(ctx: any, tray: ObjectProps, scale: number = 1) {
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

	const edgeWidth = (tray.edge ?? 0) * scale;

	ctx.strokeStyle = gradient;
	ctx.filter = "blur(3px)";
	ctx.lineWidth = edgeWidth;

	const minSide = Math.min(tray.width ?? 0, tray.height ?? 0);
	const isCircular = tray.width === tray.height;
	const radius = isCircular
		? tray.radius ?? 0
		: (tray.radius ?? 0) - ((tray.bleed ?? 0) + edgeWidth) / (minSide * 2);

	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) + edgeWidth / 2,
		tray.y + (tray.bleed ?? 0) + edgeWidth / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0) * 2 - edgeWidth,
		(tray.height ?? 0) - (tray.bleed ?? 0) * 2 - edgeWidth,
		radius,
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
	const minSize = Math.min(width, height);
	radius = Math.max(Math.min(radius * minSize, minSize / 2), 0);

	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();
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

	const {
		x,
		y,
		width: objWidth,
		height: objHeight,
	} = GetObjectDimensions(ctx, tray, selectedObject);

	const padding = 8;
	const circleRadius = 6;
	const handleWidth = 16;
	const handleHeight = 4;

	const top = y - padding;
	const left = x - padding;
	const width = objWidth + padding * 2;
	const height = objHeight + padding * 2;

	ctx.save();
	ctx.strokeStyle = "#166534";
	ctx.lineWidth = 2;
	ctx.setLineDash([6, 6]);
	ctx.strokeRect(left, top, width, height);
	ctx.restore();

	if (selectedObject.type !== "text") {
		// Draw circles at the corners
		ctx.save();
		ctx.strokeStyle = "#166534";
		ctx.fillStyle = "#ffffff";
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.arc(left, top, circleRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc(left + width, top, circleRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc(left, top + height, circleRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc(left + width, top + height, circleRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();

		ctx.restore();

		// Draw handles at the center of each side
		ctx.save();
		ctx.strokeStyle = "#166534";
		ctx.fillStyle = "#ffffff";
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.rect(
			left + width / 2 - handleWidth / 2,
			top - handleHeight / 2,
			handleWidth,
			handleHeight,
		);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.rect(
			left + width / 2 - handleWidth / 2,
			top + height - handleHeight / 2,
			handleWidth,
			handleHeight,
		);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.rect(
			left - handleHeight / 2,
			top + height / 2 - handleWidth / 2,
			handleHeight,
			handleWidth,
		);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.rect(
			left + width - handleHeight / 2,
			top + height / 2 - handleWidth / 2,
			handleHeight,
			handleWidth,
		);
		ctx.stroke();
		ctx.fill();

		ctx.restore();
	}
}

export function DrawSnapLineX(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	x: number,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.save();
	ctx.strokeStyle = "#ff0000";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(tray.x + (tray.width ?? 0) * x, tray.y);
	ctx.lineTo(tray.x + (tray.width ?? 0) * x, tray.y + (tray.height ?? 0));
	ctx.stroke();
	ctx.restore();
}

export function DrawSnapLineY(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	y: number,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.save();
	ctx.strokeStyle = "#ff0000";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(tray.x, tray.y + (tray.height ?? 0) * y);
	ctx.lineTo(tray.x + (tray.width ?? 0), tray.y + (tray.height ?? 0) * y);
	ctx.stroke();
	ctx.restore();
}
