import { useEffect, useState, useContext, createContext, useRef } from "react";
import designs from "../../data/designs.json";
import { useRouter } from "next/router";
import {
	FaTrash,
	FaMousePointer,
	FaImage,
	FaSquare,
	FaChevronUp,
	FaChevronDown,
	FaInfo,
	FaCopy,
	FaExpand,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { uploadFromCanvas } from "@/utils/firebase";
import { Product } from "use-shopping-cart/core";
import Head from "next/head";
import SetupMouseEvents from "@/utils/design/MouseEvents";
import { useWindowSize } from "@/utils/hooks";
import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";
import { GetObjectDimensions } from "@/utils/design/Helper";

const SelectedObjectContext = createContext({
	object: null as ObjectProps | null,
	setObject: (obj: ObjectProps) => {},
});

export interface DesignProps {
	id: string;
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

export default function Design({ products }: { products: any }) {
	const router = useRouter();

	const windowSize = useWindowSize();

	const [currentDesign, setCurrentDesign] = useState<DesignProps>(designs[0]);
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null
	);
	const [selectedTool, setSelectedTool] = useState<
		"select" | "text" | "image" | "rectangle"
	>("select");
	const inputSelection = useRef<{ start: number | null; end: number | null }>(
		{ start: null, end: null }
	);
	const [trayObject, setTrayObject] = useState<ObjectProps | null>(null);
	const [showCanvasSupport, setShowCanvasSupport] = useState(false);
	const designEditorRef = useRef<HTMLDivElement>(null);

	const { cartDetails, addItem } = useShoppingCart();
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
		} else if (products[0]) {
			setCurrentDesign({
				id: products[0].id.substring(6, products[0].id.length),
				objects: designs[0].objects,
			});
		}
	}, [router.query.d, products]);

	useEffect(() => {
		lastAddedImageURL.current = null;
	}, [selectedObjectID, currentDesign.id, trayObject?.color]);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvas) return;

		const metadata = products.find(
			(product: any) =>
				product.id.substring(6, product.id.length) === currentDesign.id
		)?.metadata;

		const tray = GetTrayObjFromCanvas(
			canvas,
			0.85,
			metadata?.width,
			metadata?.height,
			metadata?.radius,
			metadata?.bleed,
			metadata?.edge
		);

		setTrayObject(tray);
	}, [currentDesign.id]);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const selectedObject = currentDesign.objects.find(
			(obj) => obj.id === selectedObjectID
		);

		if (!trayObject || !canvas || !ctx || !rect) return;

		let input: HTMLTextAreaElement | null = null;

		Draw(
			canvas,
			trayObject,
			currentDesign,
			selectedObjectID,
			showCanvasSupport
		);

		LoadImages(currentDesign, (design) =>
			Draw(
				canvas,
				trayObject,
				design,
				selectedObjectID,
				showCanvasSupport
			)
		);

		if (selectedObject && designEditorRef.current) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				selectedObject
			);

			const left = x * (rect.width / canvas.width) - 8;
			const top = (y + height) * (rect.height / canvas.height) + 16;

			if (left > rect.width) {
				designEditorRef.current.style.left = `${rect.width}px`;
			} else {
				designEditorRef.current.style.left = `${left}px`;
			}

			if (top > rect.height) {
				designEditorRef.current.style.top = `${rect.height}px`;
			} else {
				designEditorRef.current.style.top = `${top}px`;
			}
		}

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

	async function addToCart() {
		const toastID = toast.loading("Laddar upp bilder...");

		const metadata = products.find(
			(product: any) =>
				product.id.substring(6, product.id.length) === currentDesign.id
		)?.metadata;

		const canvas = document.getElementById("canvas") as HTMLCanvasElement;

		const newCanvas = document.createElement("canvas");
		newCanvas.width =
			720 * ((metadata?.width ?? 1) / (metadata?.height ?? 1));
		newCanvas.height = 720;

		const renderTray = GetTrayObjFromCanvas(
			newCanvas,
			1,
			metadata?.width,
			metadata?.height,
			metadata?.radius,
			metadata?.bleed,
			metadata?.edge
		);

		renderTray.color = trayObject?.color ?? "#ffffff";

		if (!renderTray) {
			toast.error("Något gick fel", { id: toastID });
			console.error("Tray is null");
			return;
		}

		if (isAddingToCart.current === true) {
			toast.error("Var god vänta...", { id: toastID });
			return;
		}

		isAddingToCart.current = true;

		try {
			const product = products.find(
				(product: any) => product.id == "price_" + currentDesign.id
			);

			if (!product) {
				throw new Error("Product is null");
			}

			if (lastAddedImageURL.current) {
				incrementProduct(product, toastID);
				isAddingToCart.current = false;
				return;
			}

			await DrawRender(newCanvas, renderTray, currentDesign);
			console.log("Rendered");

			const coverImage = uploadFromCanvas(canvas);
			const renderImage = uploadFromCanvas(newCanvas);

			Promise.all([renderImage, coverImage])
				.then((values) => {
					toast.loading("Lägger till i kundvagnen...", {
						id: toastID,
					});

					console.log(values[0], values[1]);

					addProductToCart(product, toastID, {
						image: values[0],
						cover: values[1],
					});
				})
				.finally(() => {
					isAddingToCart.current = false;
				});
		} catch (error) {
			toast.error("Något gick fel", { id: toastID });
			console.error(error);
			isAddingToCart.current = false;
		}
	}

	function incrementProduct(product: any, toastID: string) {
		const products = (cartDetails?.[product.id]?.product_data as any)
			?.products;

		addItem(product, {
			count: 1,
			product_metadata: {
				products: products.map((p: any) => {
					if (p.image === lastAddedImageURL.current) {
						return { ...p, count: p.count + 1 };
					}
					return p;
				}),
			},
		});

		toast.success("Produkten inkrementerades", { id: toastID });
	}

	function addProductToCart(
		product: any,
		toastID: string,
		{ image, cover }: { image: string; cover: string }
	) {
		const products =
			(cartDetails?.[product.id]?.product_data as any)?.products ?? [];

		const metadata = {
			products: [
				...products,
				{
					name: product.name,
					count: 1,
					image,
					cover,
				},
			],
		};

		addItem(product, {
			count: 1,
			product_metadata: metadata,
		});

		lastAddedImageURL.current = image;

		toast.success("Produkten lades till i kundvagnen", {
			id: toastID,
		});
	}

	function changeOrder(order: number) {
		const maxOrder = Math.max(...currentDesign.objects.map((o) => o.order));
		const minOrder = Math.min(...currentDesign.objects.map((o) => o.order));

		const selectedObject = currentDesign.objects.find(
			(obj) => obj.id === selectedObjectID
		);
		if (!selectedObject) return;

		if (order > 0 && selectedObject.order === maxOrder) return;
		if (order < 0 && selectedObject.order === minOrder) return;

		setCurrentDesign((design) => {
			if (!design) return design;
			const objects = design.objects.map((obj: ObjectProps) => {
				if (order > 0) {
					if (obj.id === selectedObjectID) {
						return { ...obj, order: obj.order + 1 };
					}
					if (obj.order === selectedObject.order + 1) {
						return { ...obj, order: obj.order - 1 };
					}
				} else {
					if (obj.id === selectedObjectID) {
						return { ...obj, order: obj.order - 1 };
					}
					if (obj.order === selectedObject.order - 1) {
						return { ...obj, order: obj.order + 1 };
					}
				}

				return obj;
			});

			return { ...design, objects };
		});
	}

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
						<div className="relative">
							<canvas
								id="canvas"
								className="bg-gray-100 rounded-xl w-full"
								width={1280}
								height={720}></canvas>
							<div className="absolute" ref={designEditorRef}>
								{selectedObjectID && (
									<DesignEditor
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
										changeOrder={changeOrder}
									/>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="font-semibold">Verktyg</h3>
							<div className="flex justify-between max-sm:flex-col gap-4">
								<div className="flex items-center gap-2 h-12">
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "select"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() =>
											setSelectedTool("select")
										}>
										<FaMousePointer />
									</button>
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "text"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() => setSelectedTool("text")}>
										T
									</button>
									<button
										className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl border ${
											selectedTool === "image"
												? "bg-gray-200"
												: "bg-gray-100"
										}`}
										onClick={() =>
											setSelectedTool("image")
										}>
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
										}>
										<FaSquare />
									</button>
									<br />
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
										onClick={addToCart}
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
							</div>
						</div>
					</div>
					<div className="row-span-2 lg:col-span-1 col-span-3">
						<h2 className="text-xl font-bold border-b pb-2 mb-4">
							Produkter
						</h2>
						<ul className="lg:flex flex-col grid grid-cols-2 gap-2">
							{products.map((product: Product) => (
								<li
									key={product.id}
									className={`border rounded-md px-2 ${
										currentDesign.id ===
										product.id.substring(
											6,
											product.id.length
										)
											? "border-muted"
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
										className="w-full flex items-center max-sm:flex-col sm:text-left max-sm:pb-2">
										<div className="flex-shrink-0">
											<img
												src={product.image}
												alt={product.name}
												className="w-24 h-24 rounded-md object-contain"
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
					<div className="col-span-3">
						<h2 className="text-xl font-bold border-b pb-2 mb-4">
							Mallar
						</h2>
						{/* <p>Kommer snart</p> */}
						<DesignTemplates
							designs={designs}
							products={products}
							onSelect={(design) => {
								setSelectedObjectID(null);
								setCurrentDesign(design);
							}}
						/>
					</div>
				</div>
			</main>
		</>
	);
}

function DesignTemplates({
	designs,
	products,
	onSelect,
}: {
	designs: DesignProps[];
	products: any[];
	onSelect: (design: DesignProps) => void;
}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			const canvases = document.querySelectorAll(".minicanvas");
			canvases.forEach((canvas, i) => {
				const product = products.find(
					(product) =>
						product.id.substring(6, product.id.length) ===
						designs[i].id
				);
				if (!product) return;

				const tray = GetTrayObjFromCanvas(
					canvas as HTMLCanvasElement,
					0.85,
					product.metadata?.width,
					product.metadata?.height,
					product.metadata?.radius,
					product.metadata?.bleed,
					product.metadata?.edge
				);
				Draw(canvas as HTMLCanvasElement, tray, designs[i]);
			});
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	return (
		<div className="grid grid-cols-3 gap-4">
			{designs.map((design, i) => (
				<li key={i} className="list-none">
					<button
						onClick={() => onSelect(design)}
						className="w-full aspect-video bg-gray-100 rounded-xl">
						<canvas
							className="minicanvas bg-gray-100 rounded-xl w-full"
							width={1280}
							height={720}></canvas>
					</button>
				</li>
			))}
		</div>
	);
}

function DesignEditor({
	object,
	setObject,
	removeObject,
	changeOrder,
}: {
	object: ObjectProps | null;
	setObject: (obj: ObjectProps) => void;
	removeObject: () => void;
	changeOrder: (order: number) => void;
}) {
	if (!object) return null;

	return (
		<SelectedObjectContext.Provider value={{ object, setObject }}>
			<div className="absolute flex flex-col gap-2 bg-white border rounded-md p-4 z-50">
				<div className="flex items-center gap-2 h-12">
					{object?.type === "image" ? (
						<Input label="Bildkälla" objKey="content" type="file" />
					) : (
						object.type === "text" && (
							<TextArea label="Text" objKey="content" />
						)
					)}
					<div className="border border-gray-300 rounded-md flex items-center gap-4 h-full px-4">
						{object?.type !== "text" && (
							<button
								onClick={() =>
									setObject({
										...object,
										x: 0,
										y: 0,
										width: 1,
										height: 1,
									})
								}>
								<FaExpand />
							</button>
						)}
						<button onClick={() => changeOrder(1)}>
							<FaChevronUp />
						</button>
						<button onClick={() => changeOrder(-1)}>
							<FaChevronDown />
						</button>
						<button onClick={() => removeObject()}>
							<FaTrash />
						</button>
					</div>
				</div>
				<div className="h-12 flex gap-2">
					<Input label="Färg" objKey="color" type="color" />
					<Input
						label="Textstorlek (px)"
						objKey="size"
						type="number"
					/>
					<Select
						label="Font"
						objKey="font"
						options={[
							{ value: "cinzel", text: "Cinzel" },
							{ value: "comfortaa", text: "Comfortaa" },
							{ value: "gourgette", text: "Gourgette" },
							{ value: "sono", text: "Sono" },
							{ value: "whisper", text: "Whisper" },
							{
								value: "plus jakarta sans",
								text: "Plus Jakarta Sans",
							},
							{ value: "courier new", text: "Courier New" },
							{
								value: "times new roman",
								text: "Times New Roman",
							},
							{ value: "arial", text: "Arial" },
						]}
					/>
					<Select
						label="Bildjustering"
						objKey="fit"
						options={[
							{ value: "contain", text: "Rymm" },
							{ value: "cover", text: "Täck" },
							{ value: "fill", text: "Fyll" },
						]}
					/>
					<Input
						label="Rundning (px)"
						objKey="radius"
						type="number"
					/>
				</div>
				<div className="flex items-stretch gap-2"></div>
			</div>
		</SelectedObjectContext.Provider>
	);
}

function TextArea({ label, objKey }: { label: string; objKey: "content" }) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex flex-col gap-1 grow">
			<label className="sr-only" htmlFor={label}>
				{label}
			</label>
			<textarea
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2 h-full"
				rows={1}
				placeholder={label}
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}
			/>
		</div>
	);
}

function Input({
	label,
	objKey,
	type = "text",
}: {
	label: string;
	objKey:
		| "x"
		| "y"
		| "width"
		| "height"
		| "radius"
		| "size"
		| "color"
		| "content";
	type?: string;
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	if (type === "color")
		return (
			<div className="flex flex-col gap-1 h-full aspect-square">
				<label className="sr-only" htmlFor={label}>
					{label}
				</label>
				<div className="relative rounded-md border border-gray-300 h-full w-full">
					<input
						type="color"
						name={label}
						id={label}
						className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
						value={object[objKey]}
						onChange={(e) =>
							setObject({
								...(object as ObjectProps),
								[objKey]: e.target.value,
							})
						}
					/>
					<div
						className="absolute inset-0 pointer-events-none rounded-[4px]"
						style={{
							backgroundColor: object[objKey] as string,
						}}></div>
				</div>
			</div>
		);

	if (type === "file")
		return (
			<div className="flex flex-col gap-1 grow">
				<label className="sr-only" htmlFor={label}>
					{label}
				</label>
				<input
					type="file"
					name={label}
					id={label}
					className="border border-gray-300 rounded-md p-2 h-full"
					onChange={(e) => {
						if (e.target.files && e.target.files[0]) {
							setObject({
								...(object as ObjectProps),
								[objKey]: URL.createObjectURL(
									e.target.files[0]
								),
							});
						}
					}}
				/>
			</div>
		);

	if (type === "number")
		return (
			<div className="flex gap-2 grow border border-gray-300 rounded-md px-2">
				<label className="sr-only" htmlFor={label}>
					{label}
				</label>
				<input
					type="range"
					name={label}
					id={label}
					min="0"
					max="150"
					value={objKey in object ? object[objKey] : ""}
					onChange={(e) =>
						setObject({
							...object,
							[objKey]: e.target.value,
						})
					}
				/>
				<input
					type="number"
					name={label}
					id={label}
					className="py-2 h-full w-10 outline-none"
					value={objKey in object ? object[objKey] : ""}
					onChange={(e) =>
						setObject({
							...object,
							[objKey]: e.target.value,
						})
					}
				/>
			</div>
		);

	return (
		<div className="flex flex-col gap-1 grow">
			<label className="sr-only" htmlFor={label}>
				{label}
			</label>
			<input
				type={type}
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2 h-full"
				value={objKey in object ? object[objKey] : ""}
				onChange={(e) =>
					setObject({
						...object,
						[objKey]: e.target.value,
					})
				}
			/>
		</div>
	);
}

function Select({
	label,
	objKey,
	options,
}: {
	label: string;
	objKey: "font" | "fit";
	options: { value: string; text: string }[];
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex flex-col gap-1 grow">
			<label className="sr-only" htmlFor={label}>
				{label}
			</label>
			<select
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2 h-full"
				style={objKey === "font" ? { fontFamily: object[objKey] } : {}}
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}>
				{options?.map((option, i) => (
					<option
						key={i}
						value={option.value}
						style={
							objKey === "font"
								? { fontFamily: option.value }
								: {}
						}>
						{option.text}
					</option>
				))}
			</select>
		</div>
	);
}

export async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null,
	showSupport: boolean = false
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	DrawTray(ctx, tray);

	design.objects.sort((a, b) => a.order - b.order);

	for (let i = 0; i < design.objects.length; i++) {
		const obj = design.objects[i];
		if (obj.type === "text") {
			DrawText(ctx, tray, obj);
		} else if (obj.type === "rectangle") {
			DrawRectangle(ctx, tray, obj);
		} else if (obj.type === "image") {
			await DrawImage(ctx, tray, obj);
		}
	}

	if (showSupport) {
		DrawTraySupport(ctx, tray);
		DrawTrayShadow(ctx, tray);
	}

	DrawTrayShadow(ctx, tray);
	DrawTrayBorder(ctx, tray);

	ctx.restore();

	HighlightSelectedObject(ctx, tray, design.objects, selectedObjectID);
}

async function DrawRender(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.reset();
	ctx.save();

	DrawTray(ctx, tray);

	design.objects.sort((a, b) => a.order - b.order);

	for (let i = 0; i < design.objects.length; i++) {
		const obj = design.objects[i];
		console.log(obj);
		if (obj.type === "text") {
			DrawText(ctx, tray, obj);
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
	text: ObjectProps
) {
	ctx.fillStyle = text.color ?? "#000";
	ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	const lines = text.content.split("\n");

	lines.forEach((line, i) => {
		const x = (tray.x ?? 0) + (tray.width ?? 0) * text.x;
		const y =
			(tray.y ?? 0) + (tray.height ?? 0) * text.y + (text.size ?? 0) * i;

		ctx.fillText(line, x, y);
	});
}

function DrawRectangle(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	rectangle: ObjectProps
) {
	const { x, y, width, height } = GetObjectDimensions(ctx, tray, rectangle);

	// Make sure radius is not larger than half the width or height
	const radius = Math.min(Math.min(width, height) / 2, rectangle.radius ?? 0);

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
	image: ObjectProps
) {
	const loadImage = (image: ObjectProps): Promise<void> => {
		function DrawImage(
			image: ObjectProps,
			img: HTMLImageElement,
			resolve: any
		) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				tray,
				image
			);

			// Make sure radius is not larger than half the width or height
			const radius = Math.min(
				Math.min(width, height) / 2,
				image.radius ?? 0
			);

			const { offsetX, offsetY, newWidth, newHeight } =
				GetImageDimensions(
					img,
					image.fit || "contain",
					x,
					y,
					width,
					height
				);

			ctx.save();
			GetRoundedRect(
				ctx,
				Math.max(x, offsetX),
				Math.max(y, offsetY),
				Math.min(width, newWidth),
				Math.min(height, newHeight),
				radius
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
	type: string,
	x: number,
	y: number,
	width: number,
	height: number
) {
	if (type === "fill") {
		return { offsetX: x, offsetY: y, newWidth: width, newHeight: height };
	}

	// Calculate scaling factors for width and height
	const scaleX = width / image.width;
	const scaleY = height / image.height;

	// Choose the larger scale to cover the target area
	const scale =
		type === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

	// Calculate the new image dimensions
	const newWidth = image.width * scale;
	const newHeight = image.height * scale;

	// Calculate the position to center the image on the target area
	const offsetX = x + (width - newWidth) / 2;
	const offsetY = y + (height - newHeight) / 2;

	return { offsetX, offsetY, newWidth, newHeight };
}

function HighlightSelectedObject(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	objects: ObjectProps[],
	selectedObjectID?: number | null
) {
	if (selectedObjectID === null) return;

	const selectedObject = objects.find(
		(obj: ObjectProps) => obj.id === selectedObjectID
	);
	if (!selectedObject) return;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		tray,
		selectedObject
	);

	const padding = selectedObject.type === "text" ? 8 : 2;

	ctx.save();
	ctx.strokeStyle = "#999";
	ctx.lineWidth = 4;
	ctx.setLineDash([10, 5]);
	ctx.strokeRect(
		x - padding,
		y - padding,
		width + padding * 2,
		height + padding * 2
	);
	ctx.restore();
}

function DrawTray(
	ctx: any,
	{ x, y, width, height, radius, color }: ObjectProps
) {
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.fillStyle = color ?? "#eeeeee";
	ctx.fill();
	ctx.clip();
}

function DrawTraySupport(ctx: CanvasRenderingContext2D, tray: ObjectProps) {
	// Draw a stroke inside the tray with a width of half the bleed
	ctx.save();
	ctx.strokeStyle = "#ff676caa";
	ctx.lineWidth = tray.bleed ?? 0;
	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0),
		(tray.radius ?? 0) - (tray.bleed ?? 0) / 2
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadow(ctx: any, tray: ObjectProps) {
	ctx.save();
	ctx.strokeStyle = tray.color === "#ffffff" ? "#00000011" : "#ffffff55";
	ctx.lineWidth = tray.edge ?? 0;
	GetRoundedRect(
		ctx,
		tray.x + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		tray.y + (tray.bleed ?? 0) + (tray.edge ?? 0) / 2,
		(tray.width ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.height ?? 0) - (tray.bleed ?? 0) * 2 - (tray.edge ?? 0),
		(tray.radius ?? 0) - (tray.bleed ?? 0) - (tray.edge ?? 0) / 2
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
		tray.radius ?? 0
	);
	ctx.stroke();
	ctx.restore();
}

function DrawTrayShadowOld(ctx: any, { x, y, width, height, radius }: any) {
	ctx.save();
	let lineWidth = 12;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "#00000044";
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.stroke();
	ctx.strokeStyle = "#00000022";
	GetRoundedRect(
		ctx,
		x + lineWidth,
		y + lineWidth,
		width - lineWidth * 2,
		height - lineWidth * 2,
		radius - lineWidth
	);
	ctx.stroke();
	lineWidth = 24;
	GetRoundedRect(
		ctx,
		x + lineWidth,
		y + lineWidth,
		width - lineWidth * 2,
		height - lineWidth * 2,
		radius - lineWidth
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
	radius: number
) {
	ctx.beginPath();

	if (width > height ? radius == height / 2 : radius == width / 2) {
		ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
	} else {
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(
			x + width,
			y + height,
			x + width,
			y + height - radius
		);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
	}

	ctx.closePath();
}

export function GetTrayObjFromCanvas(
	canvas: HTMLCanvasElement,
	heightProcentage: number = 0.85,
	width: number = 43,
	height: number = 33,
	radius: number = 20,
	bleed: number = 10,
	edge: number = 20
): ObjectProps {
	const aspectRatio = (width + bleed / 20) / (height + bleed / 20);
	const newWidth = canvas.height * heightProcentage * aspectRatio;
	const newHeight = canvas.height * heightProcentage;
	const newRadius =
		(radius / 100) * (newWidth > newHeight ? newHeight : newWidth);
	const newBleed = (bleed / 20) * (newWidth / width);
	const newEdge = (edge / 20) * (newWidth / width);

	return {
		id: 0,
		type: "tray",
		content: "",
		color: "#eeeeee",
		x: (canvas.width - newWidth) / 2,
		y: (canvas.height - newHeight) / 2,
		width: newWidth,
		height: newHeight,
		radius: newRadius,
		order: 0,
		bleed: newBleed,
		edge: newEdge,
	};
}

function LoadImages(design: DesignProps, Draw: (design: DesignProps) => void) {
	design.objects.forEach((obj) => {
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

interface SelectionProps {
	start: number | null;
	end: number | null;
}

function CanvasTextEditorInput(
	canvas: HTMLCanvasElement,
	trayObject: ObjectProps,
	selection: SelectionProps,
	setSelection: (obj: SelectionProps) => void,
	object: ObjectProps,
	setObject: (obj: ObjectProps) => void
) {
	const input = document.createElement("textarea");
	const ctx = canvas.getContext("2d");
	const rect = canvas.getBoundingClientRect();
	if (!ctx || !rect) return;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		trayObject,
		object
	);

	// Set the initial value of the input to the current text
	input.value = object.content ?? "";
	input.selectionStart = selection.start ?? input.value.length;
	input.selectionEnd = selection.end ?? input.value.length;
	input.style.position = "absolute";
	input.style.left = `${x * (rect.width / canvas.width) - 8}px`;
	input.style.top = `${y * (rect.height / canvas.height) - 16}px`;
	input.style.width = `${width * (rect.width / canvas.width)}px`;
	input.style.height = `${height * (rect.height / canvas.height)}px`;
	input.style.padding = "8px";
	input.style.boxSizing = "content-box";
	input.style.fontSize = `${
		(object.size ?? 0) * (rect.width / canvas.width)
	}px`;
	input.style.fontFamily = object.font ?? "sans-serif";
	input.style.verticalAlign = "top";
	input.style.outline = "none";
	input.style.border = "none";
	input.style.background = "transparent";
	input.style.webkitTextFillColor = "transparent";
	input.style.resize = "none";
	input.style.overflow = "hidden";
	// Append the input to the body
	(canvas.parentNode || document.body).appendChild(input);

	// Focus on the input and select its text
	input.focus();

	// Event listener to handle the input changes
	input.addEventListener("input", (e) => {
		setSelection({
			start: input?.selectionStart || null,
			end: input?.selectionEnd || null,
		});

		const target = e.target as HTMLTextAreaElement;
		setObject({
			...object,
			content: target.value,
		});
	});

	return input;
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
