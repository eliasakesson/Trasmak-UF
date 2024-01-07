export interface DesignProps {
	id: string;
	color: string;
	image?: string;
	imageElement?: HTMLImageElement;
	objects: ObjectProps[];
}

export interface ObjectProps {
	id: number;
	type: string;
	content: string;
	x: number;
	y: number;
	order: number;

	color?: string;
	font?: string;
	size?: number;

	width?: number;
	height?: number;
	radius?: number;
	image?: HTMLImageElement;
	fit?: string;

	bleed?: number;
	edge?: number;
}

export interface SelectionProps {
	start: number | null;
	end: number | null;
}
