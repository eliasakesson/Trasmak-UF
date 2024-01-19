import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
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
import { useWindowSize } from "@/utils/hooks";
import {
	LoadImages,
	LoopUntilSetTrayObject,
	SetTrayObject,
} from "@/utils/design/Helper";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/firebase";
import designs from "../../data/designs.json";

import { FaMousePointer, FaImage, FaSquare, FaSave } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

import { Product } from "use-shopping-cart/core";
import { ObjectProps, DesignProps } from "@/utils/design/Interfaces";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import TrayBackgroundPopup from "@/components/design/TrayBackgroundPopup";

import { getAnalytics, logEvent } from "firebase/analytics";

export default function Design({ products }: { products: any }) {
	const router = useRouter();
	const analytics = getAnalytics();
	const windowSize = useWindowSize();
	const { cartDetails, addItem } = useShoppingCart();

	const [user] = useAuthState(auth);

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
		null
	);
	const inputSelection = useRef<{ start: number | null; end: number | null }>(
		{ start: null, end: null }
	);

	const [showCanvasSupport, setShowCanvasSupport] = useState(false);

	const designEditorRef = useRef<HTMLDivElement>(null);
	const isAddingToCart = useRef(false);
	const lastAddedImageURL = useRef<string | null>(null);

	useEffect(() => {
		logEvent(analytics, "design_view");
	}, []);

	useEffect(() => {
		if (Object.keys(router.query).includes("d")) {
			if (!router.query.d) return;
			try {
				const design = JSON.parse(router.query.d as string);
				if (design) {
					setCurrentDesign(design);
					router.replace("/design?d");
					return;
				}
			} catch (e) {
				console.error(e);
			}

			const product = products.find(
				(p: Product) =>
					p.id.substring(6, p.id.length) === router.query.d
			);
			if (product) {
				setCurrentDesign({
					id: product.id.substring(6, product.id.length),
					objects: designs[0].objects,
					color: "#eeeeee",
				});
				router.replace("/design?d");
			}
		} else if (products.length > 0) {
			setCurrentDesign({
				id: products[0].id.substring(6, products[0].id.length),
				objects: designs[0].objects,
				color: "#eeeeee",
			});
		}
	}, [router.query.d, products]);

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
			setTrayObject
		);

		return unsub;
	}, [trayObject]);

	useEffect(
		() => SetTrayObject(products, currentDesign.id, setTrayObject),
		[currentDesign.id, products]
	);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const selectedObject = currentDesign.objects?.find(
			(obj) => obj.id === selectedObjectID
		);

		if (!trayObject || !ctx || !rect) return;

		let input: HTMLTextAreaElement | null = null;

		const drawTimer = setTimeout(() => {
			Draw(
				canvas,
				trayObject,
				currentDesign,
				selectedObjectID,
				showCanvasSupport
			);
		}, 1);

		LoadImages(currentDesign, (design) =>
			Draw(
				canvas,
				trayObject,
				design,
				selectedObjectID,
				showCanvasSupport
			)
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
							obj.id === selectedObjectID ? design : obj
						),
					}))
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
					showCanvasSupport
				)
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

	if (windowSize.width < 768) {
		return (
			<>
				<Head>
					<title>Designer - Träsmak</title>
					<meta
						name="description"
						content="Designa din egen träbricka med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
					/>
				</Head>
				<main className="min-h-[90vh] flex flex-col gap-4 items-center justify-center px-8 pb-32">
					<FaCircleXmark size={64} className="text-gray-400" />
					<h1 className="xl:text-7xl lg:text-6xl text-4xl font-bold leading-tight text-gray-900 text-center">
						För liten skärm
					</h1>
					<p className="text-center">
						Designern är inte tillgänglig på mindre skärmar. Var god
						använd en enhet med större skärm.
					</p>
					<Link
						href="/"
						className="w-full text-center border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
					>
						Gå tillbaka
					</Link>
				</main>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Designer - Träsmak</title>
				<meta
					name="description"
					content="Designa din egen träbricka med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="max-w-7xl mx-auto px-8 py-16 space-y-8">
				<div className="grid lg:grid-cols-4 gap-8">
					<div className="col-span-3 space-y-4">
						<div className="relative" id="canvasparent">
							<canvas
								id="canvas"
								className="bg-gray-100 rounded-xl w-full"
								width={1280}
								height={720}
							></canvas>
							<div
								className="absolute z-50"
								ref={designEditorRef}
							>
								{selectedObjectID && (
									<DesignEditor
										design={currentDesign}
										setDesign={setCurrentDesign}
										object={
											currentDesign?.objects?.find(
												(obj) =>
													obj.id === selectedObjectID
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
															selectedObjectID
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
								className="flex justify-between max-sm:flex-col gap-4"
								id="tools"
							>
								<div className="flex items-center gap-2 h-12">
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
								<div className="flex gap-4">
									<Link
										href={`/products/${currentDesign.id}`}
										className="border-2 px-8 py-3 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
									>
										Gå till produktsidan
									</Link>
									<button
										onClick={() =>
											AddToCart(
												products,
												currentDesign,
												trayObject,
												cartDetails,
												addItem,
												isAddingToCart,
												lastAddedImageURL
											)
										}
										className="bg-primary text-white hover:bg-primary_light transition-colors rounded-md px-8 py-3 flex gap-2 items-center font-semibold"
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
							<div className="flex gap-2">
								<DesignerGuide
									currentTool={selectedTool}
									selectedObject={
										currentDesign.objects.find(
											(obj) => obj.id === selectedObjectID
										) || null
									}
								/>
								<button
									onClick={() =>
										setShowCanvasSupport((s) => !s)
									}
									className="border-2 px-8 py-3 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
								>
									{showCanvasSupport ? "Dölj" : "Visa"}{" "}
									stödlinjer
								</button>
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
											}
										)
									}
									className="ml-auto flex gap-2 items-center border-2 px-8 py-3 font-semibold rounded-lg hover:bg-slate-100 transition-colors disabled:bg-gray-100"
								>
									<FaSave />{" "}
									{user
										? "Spara design"
										: "Logga in för att spara"}
								</button>
							</div>
						</div>
						<div className="flex gap-4 h-6">
							<div className="h-full flex gap-2">
								<div className="bg-red-300 border aspect-square h-full rounded"></div>
								<p>Säkerhetsmarginal</p>
							</div>
							<div className="h-full flex gap-2">
								<div className="bg-white border aspect-square h-full rounded"></div>
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
					<div className="row-span-2 lg:col-span-1 col-span-3">
						<h2 className="text-xl font-bold border-b pb-2 mb-4">
							Produkter
						</h2>
						<ul
							className="lg:flex flex-col grid grid-cols-2 gap-2"
							id="products"
						>
							{products.map((product: Product) => (
								<li
									key={product.id}
									className={`border-2 rounded-lg overflow-hidden ${
										currentDesign.id ===
										product.id.substring(
											6,
											product.id.length
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
													product.id.length
												),
											}))
										}
										className="w-full flex gap-4 items-center max-sm:flex-col sm:text-left max-sm:pb-2"
									>
										<div className="flex-shrink-0">
											<img
												src={product.image ?? ""}
												alt={product.name}
												className="w-24 h-24 object-contain hue-rotate-[50deg] saturate-150"
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
							<h2 className="text-xl font-bold border-b pb-2 mb-4">
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
							<h2 className="text-xl font-bold border-b pb-2 mb-4">
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
			className={`flex items-center justify-center h-full aspect-square font-bold rounded-lg border-2 ${
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
