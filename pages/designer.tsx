import {
	DesignEditor,
	MoveDesignEditor,
} from "@/components/design/DesignEditor";
import SavedDesigns from "@/components/design/SavedDesigns";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import DesignerButtons from "@/components/designer/DesignerButtons";
import ToolBar from "@/components/designer/ToolBar";
import Draw, { DrawSnapLineX, DrawSnapLineY } from "@/utils/design/Draw";
import { LoadImages, SetTrayObject } from "@/utils/design/Helper";
import { DesignProps, ObjectProps } from "@/utils/design/Interfaces";
import SetupMouseEventsNew from "@/utils/design/MouseEventsNew";
import GetProducts from "@/utils/getProducts";
import { createContext, useEffect, useRef, useState } from "react";
import { Product } from "use-shopping-cart/core";

export const DesignerContext = createContext<{
	currentDesign: DesignProps;
	setCurrentDesign: (currentDesign: DesignProps) => void;
	traySize: { width: number; height: number };
	products: any[];
	selectedObjectID: number | null;
	setSelectedObjectID: (id: number | null) => void;
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
	products: [],
	selectedObjectID: null,
	setSelectedObjectID: () => {},
});

export default function Designer({ products }: { products: any[] }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const designEditorRef = useRef<HTMLDivElement>(null);

	const [currentDesign, setCurrentDesign] = useState<DesignProps>({
		id: "",
		color: "#eeeeee",
		objects: [],
	});
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null,
	);
	const [trayObject, setTrayObject] = useState<ObjectProps | null>(null);

	useEffect(
		() => SetTrayObject(products, currentDesign.id, setTrayObject),
		[currentDesign.id, products],
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		if (!trayObject) {
			SetTrayObject(products, currentDesign.id, setTrayObject);
			return;
		}

		window.addEventListener("resize", (ev: UIEvent) => DrawDesign());
		DrawDesign();

		LoadImages(currentDesign, (design) =>
			setTimeout(() => {
				DrawDesign(design);
			}, 50),
		);

		const selectedObject = currentDesign.objects.find(
			(object) => object.id === selectedObjectID,
		);

		MoveDesignEditor(designEditorRef, canvas, trayObject, selectedObject);

		const mouseEventCleanup = SetupMouseEventsNew(
			canvas,
			trayObject,
			currentDesign,
			setCurrentDesign,
			selectedObjectID,
			setSelectedObjectID,
			designEditorRef.current,
			async (design, snapLineX, snapLineY) => {
				await DrawDesign(design);
				if (snapLineX !== null) {
					DrawSnapLineX(canvas, trayObject, snapLineX);
				}
				if (snapLineY !== null) {
					DrawSnapLineY(canvas, trayObject, snapLineY);
				}
			},
		);

		return () => {
			window.removeEventListener("resize", (ev: UIEvent) => DrawDesign());
			mouseEventCleanup();
		};
	}, [
		currentDesign,
		selectedObjectID,
		canvasRef.current,
		trayObject,
		products,
	]);

	useEffect(() => {
		if (products.length > 0 && !currentDesign.id) {
			setCurrentDesign((current) => ({
				...current,
				id: products[0].id.substring(6, products[0].id.length),
			}));
		}
	}, [products, currentDesign.id]);

	async function DrawDesign(design?: DesignProps) {
		const canvas = canvasRef.current;
		if (!canvas || !trayObject) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		await Draw(
			canvas,
			trayObject,
			design || currentDesign,
			selectedObjectID,
			false,
		);
	}

	return (
		<DesignerContext.Provider
			value={{
				currentDesign,
				setCurrentDesign,
				traySize: {
					width: trayObject?.width ?? 0,
					height: trayObject?.height ?? 0,
				},
				products,
				selectedObjectID,
				setSelectedObjectID,
			}}
		>
			<div>
				<div className="relative h-[calc(100vh-116px)]">
					<canvas
						ref={canvasRef}
						id="canvas"
						className="w-full"
					></canvas>
					<ToolBar />
					<DesignerButtons />
					<DesignEditor ref={designEditorRef} />
				</div>
				<div className="space-y-4 p-16" id="saved-designs">
					<h2 className="text-2xl font-semibold">Sparade designer</h2>
					<SavedDesigns
						products={products}
						onSelect={(design) => {
							setSelectedObjectID(null);
							setCurrentDesign(design);
						}}
						canvasClassKey="saved-design-canvas"
					/>
				</div>
				<div className="space-y-4 p-16" id="templates">
					<h2 className="text-2xl font-semibold">Mallar</h2>
					<TemplateDesigns
						products={products}
						onSelect={(design) => {
							setSelectedObjectID(null);
							setCurrentDesign(design);
						}}
						canvasClassKey="templates-canvas"
					/>
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
