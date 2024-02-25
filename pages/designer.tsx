import ToolBar from "@/components/designer/ToolBar";
import Draw, { DrawSnapLineX, DrawSnapLineY } from "@/utils/design/Draw";
import { GetTrayObjFromCanvas } from "@/utils/design/Helper";
import { DesignProps } from "@/utils/design/Interfaces";
import SetupMouseEventsNew from "@/utils/design/MouseEventsNew";
import GetProducts from "@/utils/getProducts";
import { createContext, useEffect, useRef, useState } from "react";
import { Product } from "use-shopping-cart/core";

export const DesignerContext = createContext<{
	currentDesign: DesignProps;
	setCurrentDesign: (currentDesign: DesignProps) => void;
	traySize: { width: number; height: number };
}>({
	currentDesign: {
		id: "",
		color: "#eeeeee",
		objects: [],
	},
	setCurrentDesign: () => {},
	traySize: {
		width: 0,
		height: 0,
	},
});

export default function Designer({ products }: { products: Product[] }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [currentDesign, setCurrentDesign] = useState<DesignProps>({
		id: "",
		color: "#eeeeee",
		objects: [],
	});
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null,
	);
	const [traySize, setTraySize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const tray = GetTrayObjFromCanvas(canvas, 0.6);

		setTraySize({
			width: tray.width ?? 0,
			height: tray.height ?? 0,
		});

		window.addEventListener("resize", (ev: UIEvent) => DrawDesign);
		DrawDesign();

		const mouseEventCleanup = SetupMouseEventsNew(
			canvas,
			tray,
			currentDesign,
			setCurrentDesign,
			selectedObjectID,
			setSelectedObjectID,
			null,
			async (design, snapLineX, snapLineY) => {
				await DrawDesign(design);
				if (snapLineX !== null) {
					DrawSnapLineX(canvas, tray, snapLineX);
				}
				if (snapLineY !== null) {
					DrawSnapLineY(canvas, tray, snapLineY);
				}
			},
		);

		return () => {
			window.removeEventListener("resize", (ev: UIEvent) => DrawDesign());
			mouseEventCleanup();
		};
	}, [currentDesign, selectedObjectID, canvasRef.current]);

	async function DrawDesign(design?: DesignProps) {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const tray = GetTrayObjFromCanvas(canvas, 0.6);

		await Draw(canvas, tray, currentDesign, selectedObjectID, false);
	}

	return (
		<DesignerContext.Provider
			value={{ currentDesign, setCurrentDesign, traySize }}
		>
			<div>
				<div className="relative h-[calc(100vh-116px)]">
					<canvas ref={canvasRef} className="h-full w-full"></canvas>
					<ToolBar />
				</div>
			</div>
		</DesignerContext.Provider>
	);
}

export async function getStaticProps() {
	const products = await GetProducts(true);

	return {
		props: {
			products,
		},
		revalidate: 3600,
	};
}
