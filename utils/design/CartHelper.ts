import toast from "react-hot-toast";
import { GetTrayObjFromCanvas } from "./Helper";
import { uploadFromCanvas } from "../firebase";
import { useShoppingCart } from "use-shopping-cart";
import { DrawRender } from "./Draw";
import { DesignProps, ObjectProps } from "./Interfaces";
import { MutableRefObject } from "react";

export default async function AddToCart(
	products: any,
	currentDesign: DesignProps,
	trayObject: ObjectProps | null,
	cartDetails: any,
	addItem: any,
	isAddingToCart: MutableRefObject<boolean>,
	lastAddedImageURL: MutableRefObject<string | null>
) {
	const toastID = toast.loading("Laddar upp bilder...");

	if (isAddingToCart.current === true) {
		toast.error("Var god vänta...", { id: toastID });
		return;
	}

	isAddingToCart.current = true;

	const metadata = products.find(
		(product: any) =>
			product.id.substring(6, product.id.length) === currentDesign.id
	)?.metadata;

	const canvas = document.getElementById("canvas") as HTMLCanvasElement;

	const height = (metadata?.height ?? 33) * 0.393701 * 300;
	const upScaleFactor = height / canvas.height;

	const newCanvas = document.createElement("canvas");
	newCanvas.width =
		height * ((metadata?.width ?? 1) / (metadata?.height ?? 1));
	newCanvas.height = height;

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

	try {
		const product = products.find(
			(product: any) => product.id == "price_" + currentDesign.id
		);

		if (!product) {
			throw new Error("Product is null");
		}

		if (lastAddedImageURL.current) {
			IncrementProduct(
				product,
				cartDetails,
				addItem,
				lastAddedImageURL,
				toastID
			);
			isAddingToCart.current = false;
			return;
		}

		await DrawRender(newCanvas, renderTray, currentDesign, upScaleFactor);
		console.log("Rendered");

		const coverImage = uploadFromCanvas(canvas);
		const renderImage = uploadFromCanvas(newCanvas);

		Promise.all([renderImage, coverImage])
			.then((values) => {
				toast.loading("Lägger till i kundvagnen...", {
					id: toastID,
				});

				console.log(values[0], values[1]);

				AddProductToCart(
					product,
					cartDetails,
					addItem,
					lastAddedImageURL,
					toastID,
					{
						image: values[0],
						cover: values[1],
					}
				);
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

function IncrementProduct(
	product: any,
	cartDetails: any,
	addItem: any,
	lastAddedImageURL: MutableRefObject<string | null>,
	toastID: string
) {
	const products = (cartDetails?.[product.id]?.product_data as any)?.products;

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

function AddProductToCart(
	product: any,
	cartDetails: any,
	addItem: any,
	lastAddedImageURL: MutableRefObject<string | null>,
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
