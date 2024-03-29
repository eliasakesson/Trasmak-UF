import { DesignProps, ObjectProps } from "./Interfaces";

export function GetObjectDimensions(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	obj: ObjectProps,
	absolute: boolean = false,
) {
	function MeasureTextWidth(
		ctx: CanvasRenderingContext2D,
		text: ObjectProps,
		fontSize: number,
	) {
		ctx.font = `${fontSize}px ${text.font ?? "sans-serif"}`;
		const lines = text.content.split("\n");
		return Math.max(...lines.map((line) => ctx.measureText(line).width));
	}

	function MeasureTextHeight(
		ctx: CanvasRenderingContext2D,
		text: ObjectProps,
		fontSize: number,
	) {
		const lines = text.content.split("\n");
		return lines.length * fontSize;
	}

	const fontSize = (obj.size ?? 0.1) * (tray.height ?? 0);

	if (absolute) {
		const width =
			obj.type === "text"
				? MeasureTextWidth(ctx, obj, fontSize) / (tray.width ?? 0)
				: obj.width || 0;
		const height =
			obj.type === "text"
				? MeasureTextHeight(ctx, obj, fontSize) / (tray.height ?? 0)
				: obj.height || 0;

		const x = obj.x;
		const y = obj.y;

		return { x, y, width, height };
	}

	const width =
		obj.type === "text"
			? MeasureTextWidth(ctx, obj, fontSize)
			: (obj.width || 0) * (tray.width || 0);
	const height =
		obj.type === "text"
			? MeasureTextHeight(ctx, obj, fontSize)
			: (obj.height || 0) * (tray.height || 0);

	const x = tray.x + (tray.width ?? 0) * obj.x;
	const y = tray.y + (tray.height ?? 0) * obj.y;

	return { x, y, width, height };
}

export function GetTrayObjFromCanvas(
	canvas: HTMLCanvasElement,
	heightProcentage: number = 0.85,
	width: number = 43,
	height: number = 33,
	radius: number = 20,
	bleed: number = 10,
	edge: number = 20,
	limit: boolean = false,
): ObjectProps {
	const widthWithBleed = Number(width) + Number(bleed / 5);
	const heightWithBleed = Number(height) + Number(bleed / 5);
	const aspectRatio = widthWithBleed / heightWithBleed;
	let newWidth = canvas.height * heightProcentage * aspectRatio;
	let newHeight = canvas.height * heightProcentage;
	const newRadius = radius / 100;
	const newBleed = (bleed / 10) * (newWidth / width);
	const newEdge = (edge / 20) * (newWidth / width);

	if (limit && newWidth > canvas.width * 0.8) {
		newWidth = canvas.width * 0.8;
		newHeight = newWidth / aspectRatio;
	}

	return {
		id: 0,
		type: "tray",
		content: "",
		color: "#fafafa",
		x: (canvas.width - newWidth) / 2,
		y: (canvas.height - newHeight) / 2 - (limit ? 60 : 0),
		width: newWidth,
		height: newHeight,
		radius: newRadius,
		order: 0,
		bleed: newBleed,
		edge: newEdge,
	};
}

export function LoadImages(
	design: DesignProps,
	Draw: (design: DesignProps) => void,
) {
	if (design.image && !design.imageElement) {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = design.image;
		img.onload = () => {
			design.imageElement = img;
			Draw(design);
		};
	}

	design.objects?.forEach((obj) => {
		if (
			obj.type === "image" &&
			(!obj.image || obj.content !== obj.image.src)
		) {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = obj.content;
			img.onload = () => {
				obj.image = img;
				Draw(design);
			};
		}
	});
}

export function SetTrayObject(
	products: any,
	currentDesignID: string,
	setTrayObject: (tray: ObjectProps) => void,
) {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	if (!canvas) return null;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 116;

	const metadata = products.find(
		(product: any) =>
			product.id.substring(6, product.id.length) === currentDesignID,
	)?.metadata;

	const tray = GetTrayObjFromCanvas(
		{
			...canvas,
			width: window.innerWidth,
			height: window.innerHeight - (window.innerWidth >= 1024 ? 116 : 80),
		} as HTMLCanvasElement,
		0.6,
		metadata?.width,
		metadata?.height,
		metadata?.radius,
		metadata?.bleed,
		metadata?.edge,
		true,
	);

	if (tray) {
		setTrayObject(tray);
	}

	return tray;
}

export function GetTextSize(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	text: ObjectProps,
) {
	if (text.width) {
		const lines = text.content.split("\n");

		if (lines.every((line) => !line)) return 0;

		const maxWidth = text.width * (tray.width ?? 0);
		let fontSize = 0;
		let minSize = 1;
		let maxSize = 500;

		while (minSize <= maxSize) {
			const midSize = Math.floor((minSize + maxSize) / 2);
			ctx.font = `bold ${midSize}px ${text.font ?? "sans-serif"}`;
			const textWidth = Math.max(
				...lines.map((line) => ctx.measureText(line).width),
			);

			if (textWidth <= maxWidth) {
				fontSize = midSize;
				minSize = midSize + 1;
			} else {
				maxSize = midSize - 1;
			}
		}

		return fontSize;
	}

	return text.size || 0;
}
