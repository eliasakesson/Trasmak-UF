import { useEffect, useState, useRef, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";

import DesignerGuide from "@/components/design/DesignerGuide";
import DesignEditor, {
	MoveDesignEditor,
} from "@/components/design/DesignEditor";
import CanvasTextEditorInput from "@/utils/design/TextEditorInput";
import SavedDesigns from "@/components/design/SavedDesigns";

import AddToCart from "@/utils/design/CartHelper";
import Draw from "@/utils/design/Draw";
import SetupMouseEvents from "@/utils/design/MouseEvents";
import GetProducts from "@/utils/getProducts";
import { SaveDesign } from "@/utils/design/DesignSaver";

import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import {
	LoadImages,
	LoopUntilSetTrayObject,
	SetTrayObject,
} from "@/utils/design/Helper";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/firebase";

import { FaMousePointer, FaImage, FaSquare, FaSave } from "react-icons/fa";

import { Product } from "use-shopping-cart/core";
import { ObjectProps, DesignProps } from "@/utils/design/Interfaces";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import TrayBackgroundPopup from "@/components/design/TrayBackgroundPopup";

import { useAnalytics } from "@/firebase";
import { logEvent } from "firebase/analytics";
import { SiteContext } from "./_app";

export default function Design({ products }: { products: any }) {
	const { analytics } = useAnalytics();
	const { cartDetails, addItem } = useShoppingCart();

	const [user] = useAuthState(auth);
	const { design } = useContext(SiteContext);

	const [currentDesign, setCurrentDesign] = useState<DesignProps>({
		id: "",
		color: "#eeeeee",
		objects: [],
	});
	const [trayObject, setTrayObject] = useState<ObjectProps | null>(null);

	const [selectedTool, setSelectedTool] = useState<
		"select" | "text" | "image" | "rectangle"
	>("select");

	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null,
	);
	const inputSelection = useRef<{ start: number | null; end: number | null }>(
		{ start: null, end: null },
	);

	const [showCanvasSupport, setShowCanvasSupport] = useState(false);

	const designEditorRef = useRef<HTMLDivElement>(null);
	const isAddingToCart = useRef(false);
	const lastAddedImageURL = useRef<string | null>(null);

	useEffect(() => {
		analytics && logEvent(analytics, "design_view");
	}, [analytics]);

	useEffect(() => {
		if (design) {
			setCurrentDesign(design);
		}
	}, [design]);

	useEffect(() => {
		if (products.length > 0 && !currentDesign.id && !design) {
			setCurrentDesign((current) => ({
				...current,
				id: products[0].id.substring(6, products[0].id.length),
			}));
		}
	}, [products]);

	useEffect(() => {
		lastAddedImageURL.current = null;
	}, [
		selectedObjectID,
		currentDesign.id,
		trayObject?.color,
		trayObject?.content,
	]);

	useEffect(() => {
		const unsub = LoopUntilSetTrayObject(
			products,
			currentDesign.id,
			trayObject,
			setTrayObject,
		);

		return unsub;
	}, [trayObject]);

	useEffect(
		() => SetTrayObject(products, currentDesign.id, setTrayObject),
		[currentDesign.id, products],
	);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const selectedObject = currentDesign.objects?.find(
			(obj) => obj.id === selectedObjectID,
		);

		if (!trayObject || !ctx || !rect) return;

		let input: HTMLTextAreaElement | null = null;

		const drawTimer = setTimeout(() => {
			Draw(
				canvas,
				trayObject,
				currentDesign,
				selectedObjectID,
				showCanvasSupport,
			);
		}, 10);

		LoadImages(currentDesign, (design) =>
			setTimeout(() => {
				Draw(
					canvas,
					trayObject,
					currentDesign,
					selectedObjectID,
					showCanvasSupport,
				);
			}, 10),
		);

		MoveDesignEditor(designEditorRef, canvas, trayObject, selectedObject);

		if (
			selectedObject &&
			selectedObject.type === "text" &&
			selectedTool === "text"
		) {
			input = CanvasTextEditorInput(
				canvas,
				trayObject,
				inputSelection.current,
				(selection) => (inputSelection.current = selection),
				selectedObject,
				(design) =>
					setCurrentDesign((current) => ({
						...current,
						objects: current.objects.map((obj) =>
							obj.id === selectedObjectID ? design : obj,
						),
					})),
			) as HTMLTextAreaElement;
		}

		const mouseEventCleanup = SetupMouseEvents(
			canvas,
			trayObject,
			currentDesign,
			setCurrentDesign,
			selectedObjectID,
			setSelectedObjectID,
			selectedTool,
			setSelectedTool,
			designEditorRef.current,
			(design) =>
				Draw(
					canvas,
					trayObject,
					design,
					selectedObjectID,
					showCanvasSupport,
				),
		);

		return () => {
			clearTimeout(drawTimer);
			mouseEventCleanup();
			if (input) {
				(canvas.parentNode || document.body).removeChild(input);
			}
		};
	}, [
		trayObject,
		currentDesign,
		selectedObjectID,
		selectedTool,
		showCanvasSupport,
	]);

	useEffect(() => {
		if (selectedObjectID === null) {
			inputSelection.current = { start: null, end: null };
		}
	}, [selectedObjectID]);

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
			<main className="mx-auto max-w-7xl space-y-8 px-4 py-16 md:px-8">
				<div className="grid gap-8 lg:grid-cols-4">
					<div className="col-span-3 space-y-4">
						<div className="relative" id="canvasparent">
							<canvas
								id="canvas"
								className="w-full rounded-xl bg-gray-100"
								width={1280}
								height={720}
							></canvas>
							<div
								style={{ left: 0 }}
								className="absolute z-50 max-w-full"
								ref={designEditorRef}
							>
								{selectedObjectID && (
									<DesignEditor
										design={currentDesign}
										setDesign={setCurrentDesign}
										object={
											currentDesign?.objects?.find(
												(obj) =>
													obj.id === selectedObjectID,
											) ?? null
										}
										setObject={(obj: ObjectProps) =>
											setCurrentDesign((design) => {
												if (!design) return design;
												const objects =
													design.objects.map((o) => {
														if (o.id === obj.id)
															return obj;
														return o;
													});
												return { ...design, objects };
											})
										}
										removeObject={() => {
											setCurrentDesign((design) => {
												if (!design) return design;
												const objects =
													design.objects.filter(
														(o) =>
															o.id !==
															selectedObjectID,
													);
												return { ...design, objects };
											});
											setSelectedObjectID(null);
										}}
									/>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="font-semibold">
								Verktyg och bakgrundsfärg
							</h3>
							<div
								className="flex flex-wrap justify-between gap-4"
								id="tools"
							>
								<div className="flex h-12 items-center gap-2">
									<Tool
										tool="select"
										selectedTool={selectedTool}
										setSelectedTool={setSelectedTool}
									>
										<FaMousePointer />
									</Tool>
									<Tool
										tool="text"
										selectedTool={selectedTool}
										setSelectedTool={setSelectedTool}
									>
										T
									</Tool>
									<Tool
										tool="image"
										selectedTool={selectedTool}
										setSelectedTool={setSelectedTool}
									>
										<FaImage />
									</Tool>
									<Tool
										tool="rectangle"
										selectedTool={selectedTool}
										setSelectedTool={setSelectedTool}
									>
										<FaSquare />
									</Tool>
									<br />
									<TrayBackgroundPopup
										currentDesign={currentDesign}
										setCurrentDesign={setCurrentDesign}
									/>
									{/* <DesignerGuide currentTool={selectedTool} /> */}
								</div>
								<div className="flex flex-wrap gap-4">
									<Link
										href={`/products/${currentDesign.id}`}
										className="order-2 rounded-lg border-2 px-6 py-3 font-semibold transition-colors hover:bg-slate-100 md:order-1 md:px-8"
									>
										Till produkt
									</Link>
									<button
										onClick={() =>
											AddToCart(
												products,
												currentDesign,
												cartDetails,
												addItem,
												isAddingToCart,
												lastAddedImageURL,
											)
										}
										className="order-1 flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary_light md:order-2 md:px-8"
									>
										Lägg till i kundvagn
									</button>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="font-semibold">
								Guide och stödlinjer
							</h3>
							<div className="flex flex-wrap justify-between gap-2">
								<div className="flex gap-2">
									<DesignerGuide
										currentTool={selectedTool}
										selectedObject={
											currentDesign.objects.find(
												(obj) =>
													obj.id === selectedObjectID,
											) || null
										}
									/>
									<button
										onClick={() =>
											setShowCanvasSupport((s) => !s)
										}
										className="rounded-lg border-2 px-6 py-3 font-semibold transition-colors hover:bg-slate-100 md:px-8"
									>
										{showCanvasSupport ? "Dölj" : "Visa"}{" "}
										stödlinjer
									</button>
								</div>
								<button
									id="save-design"
									disabled={!user}
									onClick={() =>
										user &&
										toast.promise(
											SaveDesign(currentDesign, user),
											{
												loading: "Sparar design...",
												success: "Design sparad",
												error: "Fel vid sparning",
											},
										)
									}
									className="flex items-center gap-2 rounded-lg border-2 px-6 py-3 font-semibold transition-colors hover:bg-slate-100 disabled:bg-gray-100 md:px-8"
								>
									<FaSave />{" "}
									{user
										? "Spara design"
										: "Logga in för att spara"}
								</button>
							</div>
						</div>
						<div className="flex flex-wrap gap-4">
							<div className="flex h-full gap-2">
								<div className="aspect-square h-6 rounded border bg-red-300"></div>
								<p>Säkerhetsmarginal</p>
							</div>
							<div className="flex h-full gap-2">
								<div className="aspect-square h-6 rounded border bg-white"></div>
								<p className="whitespace-nowrap">
									Kanter{" "}
									<span className="text-muted">
										(Ej exakt pga säkerhetsmarginal)
									</span>
								</p>
							</div>
						</div>
						<p className="text-muted">
							OBS! Brickorna är handgjorda och motivet kan därmed
							flyttas några millimeter i sidled. Detta är inget vi
							kan påverka. Säkerhetsmarginalen finns för att
							garantera att viktiga motiv inte ska hamna utanför
							brickan.
						</p>
					</div>
					<div className="col-span-3 row-span-2 lg:col-span-1">
						<h2 className="mb-4 border-b pb-2 text-xl font-bold">
							Produkter
						</h2>
						<ul
							className="grid flex-col gap-2 md:grid-cols-2 lg:flex"
							id="products"
						>
							{products.map((product: Product) => (
								<li
									key={product.id}
									className={`overflow-hidden rounded-lg border-2 ${
										currentDesign.id ===
										product.id.substring(
											6,
											product.id.length,
										)
											? "border-muted_light"
											: ""
									}`}
								>
									<button
										onClick={() =>
											setCurrentDesign((design) => ({
												...design,
												id: product.id.substring(
													6,
													product.id.length,
												),
											}))
										}
										className="max-sm:flex-col max-sm:pb-2 flex w-full items-center gap-4 text-left"
									>
										<div className="flex-shrink-0">
											<img
												src={product.image ?? ""}
												alt={product.name}
												className="h-24 w-24 object-contain hue-rotate-[50deg] saturate-150"
												width={96}
												height={96}
											/>
										</div>
										<div className="flex-grow">
											<h3 className="font-bold">
												{product.name}
											</h3>
											<p className="text-gray-500">
												{formatCurrencyString({
													value: product.price,
													currency: product.currency,
												})}
											</p>
										</div>
									</button>
								</li>
							))}
						</ul>
					</div>
					<div className="col-span-3 flex flex-col gap-8">
						<div>
							<h2 className="mb-4 border-b pb-2 text-xl font-bold">
								Mina designs
							</h2>
							<SavedDesigns
								products={products}
								onSelect={(design) => {
									setSelectedObjectID(null);
									setCurrentDesign(design);
								}}
								canvasClassKey="saved-design-canvas"
							/>
						</div>
						<div id="templates">
							<h2 className="mb-4 border-b pb-2 text-xl font-bold">
								Mallar
							</h2>
							<TemplateDesigns
								products={products}
								onSelect={(design) => {
									setSelectedObjectID(null);
									setCurrentDesign(design);
								}}
								canvasClassKey="template-canvas"
							/>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

function Tool({
	tool,
	selectedTool,
	setSelectedTool,
	children,
}: {
	tool: "select" | "text" | "image" | "rectangle";
	selectedTool: string;
	setSelectedTool: (tool: "select" | "text" | "image" | "rectangle") => void;
	children: React.ReactNode;
}) {
	return (
		<button
			aria-label={`Select tool ${tool}`}
			className={`flex aspect-square h-full items-center justify-center rounded-lg border-2 font-bold ${
				selectedTool === tool ? "bg-primary_light bg-opacity-20" : ""
			}`}
			onClick={() => setSelectedTool(tool)}
			id={`${tool}-tool`}
		>
			{children}
		</button>
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
