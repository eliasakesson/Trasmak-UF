import { ObjectProps } from "@/pages/design";

export function GetObjectDimensions(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	obj: ObjectProps,
	absolute: boolean = false
) {
	function MeasureTextWidth(
		ctx: CanvasRenderingContext2D,
		text: ObjectProps
	) {
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		const lines = text.content.split("\n");
		return Math.max(...lines.map((line) => ctx.measureText(line).width));
	}

	function MeasureTextHeight(
		ctx: CanvasRenderingContext2D,
		text: ObjectProps
	) {
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		const lines = text.content.split("\n");
		return lines.length * (text.size || 0);
	}

	if (absolute) {
		const width =
			obj.type === "text"
				? MeasureTextWidth(ctx, obj) / (tray.width ?? 0)
				: obj.width || 0;
		const height =
			obj.type === "text"
				? MeasureTextHeight(ctx, obj) / (tray.height ?? 0)
				: obj.height || 0;

		const x = obj.x;
		const y = obj.y;

		return { x, y, width, height };
	}

	const width =
		obj.type === "text"
			? MeasureTextWidth(ctx, obj)
			: (obj.width || 0) * (tray.width || 0);
	const height =
		obj.type === "text"
			? MeasureTextHeight(ctx, obj)
			: (obj.height || 0) * (tray.height || 0);

	const x = tray.x + (tray.width ?? 0) * obj.x;
	const y = tray.y + (tray.height ?? 0) * obj.y;

	return { x, y, width, height };
}
