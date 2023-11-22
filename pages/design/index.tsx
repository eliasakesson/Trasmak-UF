import { useEffect, useState, useContext, createContext, useRef } from "react";
import designs from "../../data/designs.json";
import defaultDesign from "../../data/defaultdesign.json";
import { useRouter } from "next/router";
import {
	FaDownload,
	FaPlus,
	FaTrash,
	FaMousePointer,
	FaImage,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { uploadFromCanvas } from "@/utils/firebase";
import { Product } from "use-shopping-cart/core";
import Head from "next/head";

const SelectedObjectContext = createContext({
	object: null as ObjectProps | null,
	setObject: (obj: ObjectProps) => {},
});

interface DesignProps {
	id: string;
	objects: ObjectProps[];
}

interface ObjectProps {
	id: number;
	type: string;
	content: string;
	x: number;
	y: number;

	color?: string;
	font?: string;
	size?: number;
	align?: string;
	baseline?: string;

	width?: number;
	height?: number;
	radius?: number;
	image?: HTMLImageElement;
}

export default function Design({ products }: { products: any }) {
	const router = useRouter();

	const [currentDesign, setCurrentDesign] = useState<DesignProps>(designs[0]);
	const [selectedObjectID, setSelectedObjectID] = useState<number | null>(
		null
	);
	const [selectedTool, setSelectedTool] = useState<
		"select" | "text" | "image"
	>("select");
	const inputSelection = useRef<{ start: number | null; end: number | null }>(
		{ start: null, end: null }
	);

	const { cartDetails, addItem } = useShoppingCart();

	useEffect(() => {
		// if (localStorage.getItem("design")) {
		// 	setCurrentDesign(
		// 		JSON.parse(localStorage.getItem("design") as string)
		// 	);
		// } else
		if (router.query.d) {
			const rtDesign = designs.find((d) => d.id === router.query.d);
			if (rtDesign) setCurrentDesign(rtDesign);
		}
	}, [router.query.d]);

	useEffect(() => {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d");
		const rect = canvas.getBoundingClientRect();
		const size = JSON.parse(
			products.find(
				(product: any) =>
					product.id.substring(6, product.id.length) ===
					currentDesign.id
			)?.metadata.size || "{}"
		);
		const tray = GetTrayObjFromCanvas(
			canvas,
			0.85,
			size?.width ? size.width / size.height : 4 / 3,
			"15"
		);

		const timer = setTimeout(() => {
			Draw(canvas, tray, currentDesign, selectedObjectID);
			localStorage.setItem("design", JSON.stringify(currentDesign));
		}, 100);

		currentDesign.objects.forEach((obj) => {
			if (
				obj.type === "image" &&
				(!obj.image || obj.content !== obj.image.src)
			) {
				const img = new Image();
				img.crossOrigin = "anonymous";
				img.src = obj.content;
				img.onload = () => {
					obj.image = img;
				};
			}
		});

		let input: HTMLInputElement | null = null;
		const selectedObject = currentDesign.objects.find(
			(obj) => obj.id === selectedObjectID
		);

		if (
			ctx &&
			selectedObject &&
			selectedObject.type === "text" &&
			selectedTool === "text"
		) {
			input = document.createElement("input");

			const { x, y, width, height } = GetObjectDimensions(
				ctx,
				tray,
				selectedObject
			);

			// Set the initial value of the input to the current text
			input.value =
				currentDesign.objects.find((obj) => obj.id === selectedObjectID)
					?.content || "";
			input.selectionStart =
				inputSelection.current.start ?? input.value.length;
			input.selectionEnd =
				inputSelection.current.end ?? input.value.length;
			input.style.position = "absolute";
			input.style.left = `${x * (rect.width / canvas.width) - 8}px`;
			input.style.top = `${y * (rect.height / canvas.height) - 8}px`;
			input.style.width = `${width * (rect.width / canvas.width)}px`;
			input.style.height = `${height * (rect.height / canvas.height)}px`;
			input.style.padding = "8px";
			input.style.boxSizing = "content-box";
			input.style.fontSize = `${
				(selectedObject.size ?? 0) * (rect.width / canvas.width)
			}px`;
			input.style.fontFamily = selectedObject.font ?? "sans-serif";
			input.style.textAlign = selectedObject.align ?? "left";
			input.style.verticalAlign = selectedObject.baseline ?? "top";
			input.style.outline = "none";
			input.style.border = "none";
			input.style.background = "transparent";
			input.style.webkitTextFillColor = "transparent";
			// Append the input to the body
			(canvas.parentNode || document.body).appendChild(input);

			// Focus on the input and select its text
			input.focus();

			// Event listener to handle the input changes
			input.addEventListener("input", (e) => {
				inputSelection.current = {
					start: input?.selectionStart || null,
					end: input?.selectionEnd || null,
				};
				const target = e.target as HTMLInputElement;
				setCurrentDesign((current) => ({
					...current,
					objects: current.objects.map((obj) =>
						obj.id === selectedObjectID
							? {
									...obj,
									content: target.value,
							  }
							: obj
					),
				}));
			});
		}

		let dragObject: ObjectProps | undefined = undefined;
		let dragObjectOffset: { x: number; y: number } = { x: 0, y: 0 };
		let dragType: "move" | "resize" | undefined = undefined;

		function onMouseDown(e: any) {
			dragObject = GetObjectFromPointer(e, canvas, tray, currentDesign);
			const clickX = e.offsetX * (canvas.width / rect.width);
			const clickY = e.offsetY * (canvas.height / rect.height);

			if (dragObject && ctx && selectedObjectID !== null) {
				const { x, y, width, height } = GetObjectDimensions(
					ctx,
					tray,
					dragObject
				);

				dragObjectOffset = {
					x:
						clickX -
						x -
						(dragObject.align === "center" ? width / 2 : 0) -
						(dragObject.align === "right" ? width : 0),
					y:
						clickY -
						y -
						(dragObject.baseline === "middle" ? height / 2 : 0) -
						(dragObject.baseline === "bottom" ? height : 0),
				};

				if (dragObject.type === "image") {
					if (clickX >= x + width - 8) {
						dragType = "resize";
					} else {
						dragType = "move";
					}
				} else {
					dragType = "move";
				}
			} else {
				dragType = undefined;
			}
		}

		function onMouseUp() {
			setCurrentDesign((current) => ({
				...current,
				objects: current.objects.map((obj) =>
					dragObject && obj.id === dragObject.id ? dragObject : obj
				),
			}));
			dragObject = undefined;
		}

		function onClick(e: any) {
			const object = GetObjectFromPointer(e, canvas, tray, currentDesign);
			if (
				(!object || object.type !== "text") &&
				selectedTool === "text" &&
				selectedObjectID === null
			) {
				addObject("text", e.offsetX, e.offsetY);
			} else if (
				(!object || object.type !== "image") &&
				selectedTool === "image"
			) {
				addObject("image", e.offsetX, e.offsetY);
			} else {
				setSelectedObjectID(object?.id ?? null);
			}
		}

		function onMouseMove(e: any) {
			const object = GetObjectFromPointer(e, canvas, tray, currentDesign);
			canvas.style.cursor =
				selectedTool === "text"
					? "text"
					: object
					? "pointer"
					: "default";

			// If the mouse is down right corner of an image, show resize cursor
			if (selectedObject && selectedObject === object && ctx) {
				const { x, y, width, height } = GetObjectDimensions(
					ctx,
					tray,
					selectedObject
				);

				if (selectedObject.type === "image") {
					if (
						e.offsetX * (canvas.width / rect.width) >=
						x + width - 8
					) {
						canvas.style.cursor = "nwse-resize";
					}
				}
			}

			if (dragObject && ctx) {
				const rect = canvas.getBoundingClientRect();

				const clickX = e.offsetX * (canvas.width / rect.width);
				const clickY = e.offsetY * (canvas.height / rect.height);

				if (dragType === "move") {
					const width =
						dragObject.width ||
						GetObjectDimensions(ctx, tray, dragObject).width /
							(tray.width || 1);
					const height =
						dragObject.height ||
						GetObjectDimensions(ctx, tray, dragObject).height /
							(tray.height || 1);

					dragObject.x =
						(clickX - dragObjectOffset.x - tray.x) /
						(tray.width || 1);
					dragObject.y =
						(clickY - dragObjectOffset.y - tray.y) /
						(tray.height || 1);

					const snapDistance = 0.01;

					if (Math.abs(dragObject.x) < snapDistance) {
						dragObject.x = 0;
					}
					if (Math.abs(dragObject.x + width - 1) < snapDistance) {
						dragObject.x = 1 - width;
					}
					if (Math.abs(dragObject.y) < snapDistance) {
						dragObject.y = 0;
					}
					if (Math.abs(dragObject.y + height - 1) < snapDistance) {
						dragObject.y = 1 - height;
					}
					if (
						Math.abs(dragObject.x + width / 2 - 0.5) < snapDistance
					) {
						dragObject.x = 0.5 - width / 2;
					}
					if (
						Math.abs(dragObject.y + height / 2 - 0.5) < snapDistance
					) {
						dragObject.y = 0.5 - height / 2;
					}
				} else if (dragType === "resize") {
					dragObject.width =
						(clickX - tray.x) / (tray.width || 1) - dragObject.x;
					dragObject.height =
						(clickY - tray.y) / (tray.height || 1) - dragObject.y;

					if (dragObject.width < 0) dragObject.width = 0;
					if (dragObject.height < 0) dragObject.height = 0;
					if (dragObject.width > 1 - dragObject.x)
						dragObject.width = 1 - dragObject.x;
					if (dragObject.height > 1 - dragObject.y)
						dragObject.height = 1 - dragObject.y;
				}

				Draw(
					canvas,
					tray,
					{
						...currentDesign,
						objects: currentDesign.objects.map((obj) =>
							dragObject && obj.id === dragObject.id
								? dragObject
								: obj
						),
					},
					selectedObjectID
				);
			}
		}

		canvas.addEventListener("mousedown", onMouseDown);
		canvas.addEventListener("mouseup", onMouseUp);
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("click", onClick);

		return () => {
			clearTimeout(timer);
			canvas.removeEventListener("mousedown", onMouseDown);
			canvas.removeEventListener("mouseup", onMouseUp);
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("click", onClick);
			if (input) {
				(canvas.parentNode || document.body).removeChild(input);
			}
		};
	}, [currentDesign, selectedObjectID, selectedTool]);

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

		await DrawRender(newCanvas, currentDesign);

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
							image: images.image,
							cover: images.cover,
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

	function addObject(
		type: "text" | "image",
		pointerX: number = 0,
		pointerY: number = 0
	) {
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const tray = GetTrayObjFromCanvas(canvas);
		const rect = canvas.getBoundingClientRect();

		const x =
			(pointerX * (canvas.width / rect.width) - tray.x) /
			(tray.width || 1);
		const y =
			(pointerY * (canvas.width / rect.width) - tray.y) /
			(tray.height || 1);

		setCurrentDesign({
			...currentDesign,
			objects: [
				...currentDesign.objects,
				{
					...defaultDesign[type],
					id:
						currentDesign.objects.length > 0
							? Math.max(
									...currentDesign.objects.map((o) => o.id)
							  ) + 1
							: 1,
					x,
					y,
				},
			],
		});

		setSelectedTool("select");
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
								height={720}
							></canvas>
						</div>
						<div className="flex justify-between">
							<div className="flex gap-2">
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "select"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("select")}
								>
									<FaMousePointer />
								</button>
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "text"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("text")}
								>
									T
								</button>
								<button
									className={`flex items-center justify-center h-full aspect-square font-bold rounded-xl ${
										selectedTool === "image"
											? "bg-gray-200"
											: "bg-gray-100"
									}`}
									onClick={() => setSelectedTool("image")}
								>
									<FaImage />
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
									className="bg-primary text-white hover:bg-primary_light transition-colors rounded-md px-8 py-3 flex gap-2 items-center font-semibold"
								>
									Lägg till i kundvagn
								</button>
							</div>
						</div>
					</div>
					<div className="row-span-2">
						<div className="mb-4 flex gap-4"></div>
						{selectedObjectID && (
							<DesignEditor
								object={
									currentDesign?.objects.find(
										(obj) => obj.id === selectedObjectID
									) ?? null
								}
								setObject={(obj: ObjectProps) =>
									setCurrentDesign((design) => {
										if (!design) return design;
										const objects = design.objects.map(
											(o) => {
												if (o.id === obj.id) return obj;
												return o;
											}
										);
										return { ...design, objects };
									})
								}
								removeObject={() => {
									setCurrentDesign((design) => {
										if (!design) return design;
										const objects = design.objects.filter(
											(o) => o.id !== selectedObjectID
										);
										return { ...design, objects };
									});
									setSelectedObjectID(null);
								}}
							/>
						)}
					</div>
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
						className="w-full aspect-video bg-gray-100 rounded-xl"
					>
						<canvas
							className="minicanvas bg-gray-100 rounded-xl w-full"
							width={1280}
							height={720}
						></canvas>
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
}: {
	object: ObjectProps | null;
	setObject: (obj: ObjectProps) => void;
	removeObject: () => void;
}) {
	if (!object) return null;

	return (
		<SelectedObjectContext.Provider value={{ object, setObject }}>
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-bold border-b pb-2 flex items-center justify-between">
					{object?.type === "text" && "Text"}
					{object?.type === "image" && "Bild"}
					<FaTrash
						className="cursor-pointer"
						onClick={() => removeObject()}
					/>
				</h2>
				{object?.type === "image" ? (
					<Input label="Bildkälla" objKey="content" type="file" />
				) : (
					<TextArea
						label={object?.type === "text" ? "Text" : "Bildkälla"}
						objKey="content"
					/>
				)}
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
				<div className="flex flex-row md:flex-nowrap flex-wrap gap-2">
					<Select
						label="Textjustering"
						objKey="align"
						options={["Left", "Center", "Right"]}
					/>
					<Select
						label="Textbas"
						objKey="baseline"
						options={["Top", "Middle", "Bottom"]}
					/>
				</div>
				<Input label="Textstorlek (px)" objKey="size" type="number" />
				<Input label="Färg" objKey="color" type="color" />
				<div className="flex flex-row flex-wrap gap-2">
					<Input label="Vänster (%)" objKey="x" type="number" />
					<Input label="Topp (%)" objKey="y" type="number" />
				</div>
				<div className="flex flex-row flex-wrap gap-2">
					<Input label="Bredd (%)" objKey="width" type="number" />
					<Input label="Höjd (%)" objKey="height" type="number" />
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
			<label htmlFor={label}>{label}</label>
			<textarea
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2"
				rows={5}
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
				<label htmlFor={label}>{label}</label>
				<div className="relative rounded-md border border-gray-300 py-4">
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
						}}
					></div>
				</div>
			</div>
		);

	if (type === "file")
		return (
			<div className="flex flex-col gap-1 grow">
				<label htmlFor={label}>{label}</label>
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
			<label htmlFor={label}>{label}</label>
			<input
				type={type}
				name={label}
				id={label}
				className="border border-gray-300 rounded-md p-2"
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
	objKey: "font" | "align" | "baseline";
	options: string[];
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex flex-col gap-1 grow">
			<label htmlFor={label}>{label}</label>
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
				}
			>
				{options?.map((option, i) => (
					<option key={i} value={option.toLowerCase()}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}

function GetObjectFromPointer(
	e: any,
	canvas: HTMLCanvasElement,
	tray: ObjectProps,
	currentDesign: DesignProps,
	padding: number = 8
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const rect = canvas.getBoundingClientRect();

	const clickX = e.offsetX * (canvas.width / rect.width);
	const clickY = e.offsetY * (canvas.height / rect.height);

	return currentDesign.objects
		.sort((a) => (a.type === "text" ? -1 : 1))
		.find((obj) => {
			const { x, y, width, height } = GetObjectDimensions(ctx, tray, obj);

			// If the clicked position is inside the object
			if (
				clickX >= x - padding &&
				clickX <= x + width + padding &&
				clickY >= y - padding &&
				clickY <= y + height + padding
			) {
				return true;
			}
		});
}

function GetObjectDimensions(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	obj: ObjectProps
) {
	function MeasureText(ctx: CanvasRenderingContext2D, text: ObjectProps) {
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		return ctx.measureText(text.content);
	}

	const width =
		(obj?.width && obj.width * (tray.width ?? 0)) ||
		MeasureText(ctx, obj).width;
	const height =
		(obj?.height && obj.height * (tray.height ?? 0)) || obj.size || 0;

	const x =
		tray.x +
		(tray.width ?? 0) * obj.x +
		(obj.align === "center" ? -width / 2 : 0) +
		(obj.align === "right" ? -width : 0);
	const y =
		tray.y +
		(tray.height ?? 0) * obj.y +
		(obj.baseline === "middle" ? -height / 2 : 0) +
		(obj.baseline === "bottom" ? -height : 0);

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

	await DrawImages(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "image")
	);

	DrawTexts(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "text")
	);

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

async function DrawRender(canvas: HTMLCanvasElement, design: DesignProps) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const tray = GetTrayObjFromCanvas(canvas, 1);

	await DrawImages(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "image")
	);

	DrawTexts(
		ctx,
		tray,
		design.objects.filter((obj) => obj.type === "text")
	);
}

function DrawTexts(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	texts: ObjectProps[]
) {
	texts.forEach((text) => {
		ctx.fillStyle = text.color ?? "#000";
		ctx.font = `bold ${text.size}px ${text.font ?? "sans-serif"}`;
		ctx.textAlign = text.align as CanvasTextAlign;
		ctx.textBaseline = text.baseline as CanvasTextBaseline;
		const lines = text.content.split("\n");
		lines.forEach((line, i) => {
			ctx.fillText(
				line,
				(tray.x ?? 0) + (tray.width ?? 0) * text.x,
				(tray.y ?? 0) +
					(tray.height ?? 0) * text.y +
					(text.size ?? 0) * (i - (lines.length - 1) / 2)
			);
		});
	});
}

async function DrawImages(
	ctx: CanvasRenderingContext2D,
	tray: ObjectProps,
	images: ObjectProps[]
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

			ctx.save();
			GetRoundedRect(ctx, x, y, width, height, radius);
			ctx.clip();

			const { offsetX, offsetY, newWidth, newHeight } =
				GetCoverImageDimensions(img, x, y, width, height);

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

	const loadingPromises: Promise<void>[] = images.map((image) =>
		loadImage(image)
	);

	try {
		await Promise.all(loadingPromises);
		console.log("Done");
	} catch (error) {
		console.error(error);
	}
}

function GetCoverImageDimensions(
	image: HTMLImageElement,
	x: number,
	y: number,
	width: number,
	height: number
) {
	// Calculate scaling factors for width and height
	const scaleX = width / image.width;
	const scaleY = height / image.height;

	// Choose the larger scale to cover the target area
	const scale = Math.max(scaleX, scaleY);

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

function DrawTray(ctx: any, { x, y, width, height, radius }: ObjectProps) {
	ctx.fillStyle = "#ddd";
	GetRoundedRect(ctx, x, y, width ?? 0, height ?? 0, radius ?? 0);
	ctx.fill();
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
	ctx.moveTo(x, y + radius);
	ctx.lineTo(x, y + height - radius);
	ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
	ctx.lineTo(x + width - radius, y + height);
	ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
	ctx.lineTo(x + width, y + radius);
	ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
	ctx.lineTo(x + radius, y);
	ctx.quadraticCurveTo(x, y, x, y + radius);
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
				? (Number(radius) / 100) * width
				: radius,
	};
}

export async function getStaticProps() {
	const products = await GetProducts(true);

	return {
		props: {
			products: products.filter(
				(product) => product.metadata.type === "template"
			),
		},
		revalidate: 3600,
	};
}
