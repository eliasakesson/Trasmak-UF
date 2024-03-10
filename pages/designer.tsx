import {
	DesignEditor,
	MoveDesignEditor,
} from "@/components/design/DesignEditor";
import SavedDesigns from "@/components/design/SavedDesigns";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import DesignerButtons from "@/components/designer/DesignerButtons";
import LocalDesignSaver from "@/components/designer/LocalDesignSaver";
import ToolBar from "@/components/designer/ToolBar";
import Draw, { DrawSnapLineX, DrawSnapLineY } from "@/utils/design/Draw";
import { LoadImages, SetTrayObject } from "@/utils/design/Helper";
import { DesignProps, ObjectProps } from "@/utils/design/Interfaces";
import SetupMouseEventsNew from "@/utils/design/MouseEventsNew";
import GetProducts from "@/utils/getProducts";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SiteContext } from "./_app";

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
	const router = useRouter();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const designEditorRef = useRef<HTMLDivElement>(null);
	const isDrawing = useRef(false);

	const { design, setDesign } = useContext(SiteContext);
	const [currentDesign, setCurrentDesign] = useState<DesignProps>({
		id: "",
		color: "#eeeeee",
		objects: [],
	});
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null,
	);
	const [trayObject, setTrayObject] = useState<ObjectProps | null>(null);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		SetTrayObject(products, currentDesign.id, setTrayObject);

		function onResize(ev: UIEvent) {
			clearTimeout(timeout);
			timeout = setTimeout(
				() => SetTrayObject(products, currentDesign.id, setTrayObject),
				50,
			);
		}

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
			clearInterval(timeout);
		};
	}, [products, currentDesign.id, setTrayObject]);

	useEffect(() => {
		console.log(trayObject);
		const canvas = canvasRef.current;
		if (!canvas) return;

		let tray = trayObject;
		if (!tray) {
			tray = SetTrayObject(products, currentDesign.id, setTrayObject);
		}
		if (!tray) return;

		DrawDesign(currentDesign);

		LoadImages(currentDesign, (design) =>
			setTimeout(() => {
				DrawDesign(design);
			}, 50),
		);

		const selectedObject = currentDesign.objects.find(
			(object) => object.id === selectedObjectID,
		);

		MoveDesignEditor(designEditorRef, canvas, tray, selectedObject);

		const mouseEventCleanup = SetupMouseEventsNew(
			canvas,
			tray,
			currentDesign,
			setCurrentDesign,
			selectedObjectID,
			setSelectedObjectID,
			designEditorRef.current,
			async (design, snapLineX, snapLineY) => {
				await DrawDesign(design);
				if (!tray) return;
				if (snapLineX !== null) {
					DrawSnapLineX(canvas, tray, snapLineX);
				}
				if (snapLineY !== null) {
					DrawSnapLineY(canvas, tray, snapLineY);
				}
			},
		);

		return () => {
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
		if (design) {
			setDesign(null);
			setCurrentDesign(design);
			SetTrayObject(products, design.id, setTrayObject);
		} else if (products.length > 0 && currentDesign?.id?.length <= 0) {
			setCurrentDesign((current) => ({
				...current,
				id: products[0].id.substring(6, products[0].id.length),
			}));
		}
	}, [products, currentDesign.id, design]);

	async function DrawDesign(design: DesignProps) {
		if (isDrawing.current) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		let tray = trayObject;
		if (!tray) {
			tray = SetTrayObject(products, design.id, setTrayObject);
		}
		if (!tray) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		isDrawing.current = true;
		await Draw(canvas, tray, design, selectedObjectID, false);
		isDrawing.current = false;
	}

	return (
		<>
			<Head>
				<title>Designer - Träsmak UF</title>
				<meta
					name="description"
					content="Designa din egen träbricka med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
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
				<LocalDesignSaver />
				<div>
					<div className="relative h-[calc(100dvh-116px)] overflow-hidden">
						<canvas
							ref={canvasRef}
							id="canvas"
							className="w-full"
						></canvas>
						<ToolBar />
						<DesignerButtons />
						<DesignEditor ref={designEditorRef} />
					</div>
					<div className="space-y-4 p-4 lg:p-16" id="saved-designs">
						<h2 className="text-2xl font-semibold">
							Sparade designer
						</h2>
						<SavedDesigns
							products={products}
							onSelect={(design) => {
								setSelectedObjectID(null);
								setCurrentDesign(design);
								router.replace("/designer", undefined, {
									shallow: true,
								});
							}}
							canvasClassKey="saved-design-canvas"
						/>
					</div>
					<div className="space-y-4 p-4 lg:p-16" id="templates">
						<h2 className="text-2xl font-semibold">Mallar</h2>
						<TemplateDesigns
							products={products}
							onSelect={(design) => {
								setSelectedObjectID(null);
								setCurrentDesign(design);
								router.replace("/designer", undefined, {
									shallow: true,
								});
								window.scrollTo({
									top: 0,
									behavior: "smooth",
								});
							}}
							canvasClassKey="templates-canvas"
						/>
					</div>
				</div>
			</DesignerContext.Provider>
		</>
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
