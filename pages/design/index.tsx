import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";

import DesignerGuide from "@/components/DesignerGuide";
import DesignEditor, { MoveDesignEditor } from "@/utils/design/DesignEditor";
import DesignsGrid from "@/utils/design/DesignsGrid";
import CanvasTextEditorInput from "@/utils/design/TextEditorInput";

import AddToCart from "@/utils/design/CartHelper";
import Draw from "@/utils/design/Draw";
import SetupMouseEvents from "@/utils/design/MouseEvents";
import GetProducts from "@/utils/getProducts";

import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import { useWindowSize } from "@/utils/hooks";
import {
	LoadImages,
	LoopUntilSetTrayObject,
	SetTrayObject,
} from "@/utils/design/Helper";

import designs from "../../data/designs.json";

import {
	FaMousePointer,
	FaImage,
	FaSquare,
	FaCopy,
	FaSave,
} from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

import { Product } from "use-shopping-cart/core";
import { ObjectProps, DesignProps } from "@/utils/design/Interfaces";
import SavedDesigns from "@/utils/design/SavedDesigns";
import { SaveDesign } from "@/utils/design/DesignSaver";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function Design({ products }: { products: any }) {
	const router = useRouter();
	const windowSize = useWindowSize();
	const { cartDetails, addItem } = useShoppingCart();

	const [user, loading, error] = useAuthState(auth);

	const [currentDesign, setCurrentDesign] = useState<DesignProps>(designs[0]);
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
		if (router.query.d && currentDesign.id !== router.query.d) {
			if (router.query.i) {
				const rtDesign = designs[parseInt(router.query.i as string)];
				if (rtDesign) {
					setCurrentDesign(rtDesign);
					return;
				}
			}

			setCurrentDesign({
				...designs[0],
				id: router.query.d as string,
			});
		} else if (products && products[0]) {
			setCurrentDesign({
				id: products[0].id.substring(6, products[0].id.length),
				objects: designs[0].objects,
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
		() =>
			SetTrayObject(
				products,
				currentDesign.id,
				trayObject,
				setTrayObject
			),
		[currentDesign.id, products]
	);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const selectedObject = currentDesign.objects.find(
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
						content="Designa din egen träbricka"
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
						className="w-full text-center border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
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
				<meta name="description" content="Designa din egen träbricka" />
			</Head>
			<main className="max-w-7xl mx-auto px-8 py-16 space-y-8">
				<div className="grid lg:grid-cols-4 lg:grid-rows-2 gap-8">
					<div className="col-span-3 space-y-4">
						<div className="relative" id="canvasparent">
							<canvas
								id="canvas"
								className="bg-gray-100 rounded-xl w-full"
								width={1280}
								height={720}></canvas>
							<div className="absolute" ref={designEditorRef}>
								{selectedObjectID && (
									<DesignEditor
										design={currentDesign}
										setDesign={setCurrentDesign}
										object={
											currentDesign?.objects.find(
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
							<h3 className="font-semibold">Verktyg</h3>
							<div
								className="flex justify-between max-sm:flex-col gap-4"
								id="tools">
								<div className="flex items-center gap-2 h-12">
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "select"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() =>
											setSelectedTool("select")
										}
										id="selecttool">
										<FaMousePointer />
									</button>
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "text"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() => setSelectedTool("text")}
										id="texttool">
										T
									</button>
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "image"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() => setSelectedTool("image")}
										id="imagetool">
										<FaImage />
									</button>
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "rectangle"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() =>
											setSelectedTool("rectangle")
										}
										id="rectangletool">
										<FaSquare />
									</button>
									<br />
									<DesignerGuide currentTool={selectedTool} />
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => {
											navigator.clipboard.writeText(
												JSON.stringify({
													...currentDesign,
													objects:
														currentDesign.objects.map(
															(obj) => ({
																...obj,
																image: undefined,
															})
														),
												})
											);
										}}
										className="border-2 bg-gray-50 rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
										<FaCopy /> Kopiera design
									</button>
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
										className="bg-primary text-white hover:bg-primary_light transition-colors rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
										Lägg till i kundvagn
									</button>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="font-semibold">
								Bakgrundsfärg och stödlinjer
							</h3>
							<div className="flex gap-2 h-12">
								<div className="relative rounded-md border aspect-square h-full">
									<input
										type="color"
										className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
										value={trayObject?.color ?? "#000"}
										onChange={(e) =>
											setTrayObject((tray) => ({
												...(tray as ObjectProps),
												color: e.target.value,
											}))
										}
									/>
									<div
										className="absolute inset-0 pointer-events-none rounded-[4px]"
										style={{
											backgroundColor:
												trayObject?.color ?? "",
										}}></div>
								</div>
								<br />
								<br />
								<button
									onClick={() =>
										setShowCanvasSupport((s) => !s)
									}
									className={`flex items-center justify-center h-full font-bold rounded-xl bg-gray-100 px-4 border`}>
									{showCanvasSupport ? "Dölj" : "Visa"}{" "}
									stödlinjer
								</button>
								<div className="grid grid-rows-2 gap-1">
									<div className="h-full flex gap-2">
										<div className="bg-red-300 border aspect-square h-full rounded"></div>
										<p>Säkerhetsmarginal</p>
									</div>
									<div className="h-full flex gap-2">
										<div
											className={`${
												trayObject?.color === "#ffffff"
													? "bg-gray-300"
													: "bg-white"
											} border aspect-square h-full rounded`}></div>
										<p>Kanter</p>
									</div>
								</div>
								{user && (
									<button
										onClick={() =>
											toast.promise(
												SaveDesign(currentDesign, user),
												{
													loading: "Sparar design...",
													success: "Design sparad",
													error: "Fel vid sparning",
												}
											)
										}
										className="ml-auto border-2 bg-gray-50 rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
										<FaSave /> Spara design
									</button>
								)}
							</div>
						</div>
					</div>
					<div className="row-span-2 lg:col-span-1 col-span-3">
						<h2 className="text-xl font-bold border-b pb-2 mb-4">
							Produkter
						</h2>
						<ul
							className="lg:flex flex-col grid grid-cols-2 gap-2"
							id="products">
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
									}`}>
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
										className="w-full flex gap-4 items-center max-sm:flex-col sm:text-left max-sm:pb-2">
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
						<div>
							<h2 className="text-xl font-bold border-b pb-2 mb-4">
								Mallar
							</h2>
							<DesignsGrid
								designs={designs}
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

export async function getStaticProps() {
	const products = await GetProducts(true);

	return {
		props: {
			products,
		},
		revalidate: 3600,
	};
}
