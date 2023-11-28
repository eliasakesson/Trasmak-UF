import { useEffect, useState, useContext, createContext, useRef } from "react";
import designs from "../../data/designs.json";
import { useRouter } from "next/router";
import {
	FaDownload,
	FaTrash,
	FaMousePointer,
	FaImage,
	FaSquare,
	FaChevronUp,
	FaChevronDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { uploadFromCanvas } from "@/utils/firebase";
import { Product } from "use-shopping-cart/core";
import Head from "next/head";
import SetupMouseEvents from "@/utils/design/MouseEvents";

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
	align?: string;

	width?: number;
	height?: number;
	radius?: number;
	image?: HTMLImageElement;
	fit?: string;
}

export default function Design({ products }: { products: any }) {
	const router = useRouter();

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
	const designEditorRef = useRef<HTMLDivElement>(null);

	const { cartDetails, addItem } = useShoppingCart();

	useEffect(() => {
		// if (localStorage.getItem("design")) {
		// 	setCurrentDesign(
		// 		JSON.parse(localStorage.getItem("design") as string)
		// 	);
		// } else
		if (router.query.d && currentDesign.id !== router.query.d) {
			const rtDesign = designs.find((d) => d.id === router.query.d);
			if (rtDesign) setCurrentDesign(rtDesign);
			else
				setCurrentDesign({
					...designs[0],
					id: router.query.d as string,
				});
		} else if (products[0]) {
			setCurrentDesign({
				...designs[0],
				id: products[0].id.substring(6, products[0].id.length),
			});
		}
	}, [router.query.d, products]);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;

		const metadata = products.find(
			(product: any) =>
				product.id.substring(6, product.id.length) === currentDesign.id
		)?.metadata;

		const tray = GetTrayObjFromCanvas(
			canvas,
			0.85,
			metadata?.width && metadata?.height
				? metadata.width / metadata.height
				: 4 / 3,
			metadata?.radius ? `${metadata.radius}` : "10"
		);

		setTrayObject(tray);
	}, [currentDesign.id]);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const selectedObject = currentDesign.objects.find(
			(obj) => obj.id === selectedObjectID
		);

		if (!trayObject || !canvas || !ctx || !rect) return;

		let input: HTMLTextAreaElement | null = null;

		const drawTimer = setTimeout(() => {
			Draw(canvas, trayObject, currentDesign, selectedObjectID);
			localStorage.setItem("design", JSON.stringify(currentDesign));
		}, 100);

		LoadImages(currentDesign, (design) => Draw(canvas, trayObject, design));

		if (selectedObject && designEditorRef.current) {
			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				selectedObject
			);

			designEditorRef.current.style.left = `${
				x * (rect.width / canvas.width) - 8
			}px`;
			designEditorRef.current.style.top = `${
				(y + height) * (rect.height / canvas.height) + 16
			}px`;
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
			(design) => Draw(canvas, trayObject, design, selectedObjectID)
		);

		return () => {
			clearTimeout(drawTimer);
			mouseEventCleanup();
			if (input) {
				(canvas.parentNode || document.body).removeChild(input);
			}
		};
	}, [trayObject, currentDesign, selectedObjectID, selectedTool]);

	useEffect(() => {
		if (selectedObjectID === null) {
			inputSelection.current = { start: null, end: null };
		}
	}, [selectedObjectID]);

	async function addToCart() {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;

		const newCanvas = document.createElement("canvas");
		newCanvas.width = 960;
		newCanvas.height = 720;

		const toastID = toast.loading("Laddar upp bilder...");

		if (!trayObject) {
			toast.error("Något gick fel", { id: toastID });
			console.error("Tray object is null");
			return;
		}
		await DrawRender(newCanvas, trayObject, currentDesign);

		try {
			const coverImage = uploadFromCanvas(canvas);
			const renderImage = uploadFromCanvas(newCanvas);

			Promise.all([renderImage, coverImage]).then((values) => {
				toast.loading("Lägger till i kundvagnen...", { id: toastID });
				const product = products.find(
					(product: any) => product.id == "price_" + currentDesign.id
				);

				if (product) {
					addProduct(
						product,
						{
							image: values[0],
							cover: values[1],
						},
						toastID
					);
				} else {
					toast.error("Något gick fel", { id: toastID });
					console.error("Product is null");
				}
			});
		} catch (error) {
			toast.error("Något gick fel", { id: toastID });
			console.error(error);
		}
	}

	function addProduct(
		product: any,
		images: { image: string; cover: string },
		toastID: string
	) {
		if (cartDetails?.[product.id]) {
			// Find a product that isn't in the cart yet
			const newProduct = products.find((p: any) => !cartDetails?.[p.id]);

			// If there is one, add it to the cart
			if (newProduct) {
				addItem(
					{ ...newProduct, image: images.cover, name: product.name },
					{
						count: 1,
						product_metadata: {
							...newProduct.metadata,
							products: [
								...product.metadata.products,
								{
									id: newProduct.id,
									count: 1,
									image: images.image,
									cover: images.cover,
								},
							],
						},
					}
				);
				toast.success("Produkten lades till i kundvagnen", {
					id: toastID,
				});
			} else {
				toast.error("Kundvagnen är full", { id: toastID });
			}
		} else {
			addItem(
				{ ...product, image: images.cover },
				{
					count: 1,
					product_metadata: {
						...product.metadata,
						image: images.image,
						cover: images.cover,
					},
				}
			);
			toast.success("Produkten lades till i kundvagnen", { id: toastID });
		}
	}

	function changeOrder(order: number) {
		const maxOrder = Math.max(...currentDesign.objects.map((o) => o.order));
		const minOrder = Math.min(...currentDesign.objects.map((o) => o.order));

		const selectedObject = currentDesign.objects.find(
			(obj) => obj.id === selectedObjectID
		);
		if (!selectedObject) return;

		console.log(selectedObject.order, maxOrder, minOrder);

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
			console.log(objects);
			return { ...design, objects };
		});
	}

	return (
		<>
			<Head>
				<title>Designer - Träsmak</title>
				<meta name="description" content="Designa din egen träbricka" />
			</Head>
			<div className="max-w-7xl mx-auto px-8 py-16 space-y-8">
				<div className="grid md:grid-cols-4 md:grid-rows-2 gap-8">
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
						<div className="flex justify-between">
							<div className="flex gap-2">
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "select"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("select")}>
									<FaMousePointer />
								</button>
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "text"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("text")}>
									T
								</button>
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "image"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("image")}>
									<FaImage />
								</button>
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "rectangle"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() =>
										setSelectedTool("rectangle")
									}>
									<FaSquare />
								</button>
							</div>
							<div className="flex gap-2">
								{/* <button
									onClick={() => {
										const canvas = document.getElementById(
											"canvas"
										) as HTMLCanvasElement;

										const image =
											canvas.toDataURL("image/png");
										const link =
											document.createElement("a");
										link.download = "design.png";
										link.href = image;
										link.click();
									}}
									className="border-2 bg-gray-50 rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
									<FaDownload /> Ladda ner
								</button> */}
								<button
									onClick={addToCart}
									className="bg-primary text-white hover:bg-primary_light transition-colors rounded-md px-8 py-3 flex gap-2 items-center font-semibold">
									Lägg till i kundvagn
								</button>
							</div>
						</div>
					</div>
					<div className="row-span-2"></div>
					<div className="col-span-3">
						<h2 className="text-xl font-bold border-b pb-2 mb-4">
							Designs
						</h2>
						<DesignTemplates
							designs={designs.filter((design) =>
								products.find(
									(product: Product) =>
										product.id.substring(
											6,
											product.id.length
										) === design.id
								)
							)}
							onSelect={() => setSelectedObjectID(null)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

function DesignTemplates({
	designs,
	onSelect,
}: {
	designs: DesignProps[];
	onSelect?: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			const canvases = document.querySelectorAll(".minicanvas");
			canvases.forEach((canvas, i) => {
				const tray = GetTrayObjFromCanvas(canvas as HTMLCanvasElement);
				Draw(canvas as HTMLCanvasElement, tray, designs[i]);
			});
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	function onClick(design: DesignProps) {
		localStorage.setItem("design", JSON.stringify(design));
		onSelect?.();
		router.push(`?d=${design.id}`, undefined, { shallow: true });
	}

	return (
		<div className="grid grid-cols-3 gap-4">
			{designs.map((design) => (
				<li key={design.id} className="list-none">
					<button
						onClick={() => onClick(design)}
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
			<div className="absolute flex flex-col gap-2 bg-white border rounded-md p-4">
				<div className="flex items-center gap-4">
					{object?.type === "image" ? (
						<Input label="Bildkälla" objKey="content" type="file" />
					) : (
						<TextArea
							label={
								object?.type === "text" ? "Text" : "Bildkälla"
							}
							objKey="content"
						/>
					)}
					<button onClick={() => changeOrder(1)}>
						<FaChevronUp />
					</button>
					<button onClick={() => changeOrder(-1)}>
						<FaChevronDown />
					</button>
					<button onClick={() => removeObject()}>
						<FaTrash size={20} />
					</button>
				</div>
				<div className="flex items-stretch gap-2">
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
							"Cinzel",
							"Courier New",
							"Times New Roman",
							"Arial",
						]}
					/>
				</div>
				<div className="flex items-stretch gap-2">
					<Select
						label="Textjustering"
						objKey="align"
						options={["Left", "Center", "Right"]}
					/>
					<Select
						label="Bildjustering"
						objKey="fit"
						options={["Contain", "Cover", "Fill"]}
					/>
				</div>
				<Input label="Rundning (px)" objKey="radius" type="number" />
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
				className="border border-gray-300 rounded-md p-2"
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
			<div className="flex flex-col gap-1 grow">
				<label className="sr-only" htmlFor={label}>
					{label}
				</label>
				<div className="relative rounded-md border border-gray-300 py-4 aspect-video h-full">
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
					className="border border-gray-300 rounded-md p-2"
					onChange={(e) => {
						if (e.target.files) {
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

	return (
		<div className="flex flex-col gap-1 grow">
			<label className="sr-only" htmlFor={label}>
				{label}
			</label>
			<input
				type={type}
				name={label}
				id={label}
				className={`border border-gray-300 rounded-md p-2 ${
					type === "number" ? "w-16" : ""
				}`}
				value={objKey in object ? object[objKey] : ""}
				onChange={(e) =>
					setObject({
						...object,
						[objKey]:
							type === "number"
								? Number(e.target.value)
								: e.target.value,
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
	objKey: "font" | "align" | "fit";
	options: string[];
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
				className="border border-gray-300 rounded-md p-2"
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}>
				{options?.map((option, i) => (
					<option key={i} value={option.toLowerCase()}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}

function GetObjectDimensions(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	obj: ObjectProps
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

	const width =
		obj.type === "text"
			? MeasureTextWidth(ctx, obj)
			: (obj.width || 0) * (tray.width || 0);
	const height =
		obj.type === "text"
			? MeasureTextHeight(ctx, obj)
			: (obj.height || 0) * (tray.height || 0);

	const x =
		tray.x +
		(tray.width ?? 0) * obj.x +
		(obj.align === "center" ? -width / 2 : 0) +
		(obj.align === "right" ? -width : 0);
	const y = tray.y + (tray.height ?? 0) * obj.y;

	return { x, y, width, height };
}

export async function Draw(
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	design: DesignProps,
	selectedObjectID?: number | null
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

	HighlightSelectedObject(ctx, tray, design.objects, selectedObjectID);

	const borderWidth = 32;

	DrawTrayShadow(ctx, {
		x: tray.x + borderWidth,
		y: tray.y + borderWidth,
		width: (tray.width ?? 0) - borderWidth * 2,
		height: (tray.height ?? 0) - borderWidth * 2,
		radius: (tray.radius ?? 0) - borderWidth,
	});
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

	DrawTray(ctx, tray, false);

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
}

function DrawText(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	text: ObjectProps
) {
	ctx.fillStyle = text.color ?? "#000";
	ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
	ctx.textAlign = text.align as CanvasTextAlign;
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
	{ x, y, width, height, radius }: ObjectProps,
	fill: boolean = true
) {
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	if (fill) {
		ctx.fillStyle = "#ddd";
		ctx.fill();
	}
	ctx.clip();
}

function DrawTrayShadow(ctx: any, { x, y, width, height, radius }: any) {
	ctx.save();
	const lineWidth = 12;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "#00000044";
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.stroke();
	ctx.strokeStyle = "#00000022";
	GetRoundedRect(
		ctx,
		x - lineWidth,
		y - lineWidth,
		width + lineWidth * 2,
		height + lineWidth * 2,
		radius + lineWidth
	);
	ctx.stroke();
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
	aspectRatio: number = 4 / 3,
	radius: number | string = 128
): ObjectProps {
	const width = canvas.height * heightProcentage * aspectRatio;
	const height = canvas.height * heightProcentage;

	return {
		id: 0,
		type: "tray",
		content: "",
		color: "",
		x: (canvas.width - width) / 2,
		y: (canvas.height - height) / 2,
		width,
		height,
		radius:
			typeof radius === "string"
				? (Number(radius) / 100) * (width > height ? height : width)
				: radius,
		order: 0,
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
	input.style.textAlign = object.align ?? "left";
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
