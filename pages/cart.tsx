import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import GetProducts from "@/utils/getProducts";
import GetConfig from "@/utils/getConfig";
import Head from "next/head";

export default function Cart({ products, config }: any) {
	return (
		<>
			<Head>
				<title>Varukorg - Träsmak UF</title>
				<meta
					name="description"
					content="Varukorgen för dina designade brickor."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="mx-auto min-h-[calc(100vh-108px)] max-w-7xl space-y-8 px-8 py-16">
				<article className="grid grid-cols-1 gap-x-0 gap-y-16 lg:grid-cols-3 lg:gap-x-16">
					<CartItems products={products} />
					<CartSummary config={config} />
				</article>
			</main>
		</>
	);
}

function CartItems({ products }: { products: any }) {
	const { cartDetails, cartCount }: any = useShoppingCart();

	return (
		<div className="col-span-2">
			<div className="flex items-center justify-between py-4 pb-8">
				<h1 className="text-4xl font-bold">Min Varukorg</h1>
				<p className="text-gray-500">
					{cartCount} {cartCount > 1 ? "produkter" : "produkt"} i
					varukorgen
				</p>
			</div>
			<ul>
				{Object.keys(cartDetails).map((item, index) => (
					<CartItem
						key={index}
						cartItem={cartDetails[item]}
						products={products}
					/>
				))}
			</ul>
		</div>
	);
}

function CartItem({ cartItem, products }: { cartItem: any; products: any }) {
	const { removeItem, addItem } = useShoppingCart();

	function changeDesignCount(design: any, increment: boolean) {
		const product = products.find((p: any) => p.id === cartItem.id);
		if (!product) return;

		if (cartItem.quantity === 1 && !increment) {
			removeItem(product.id);
			return;
		}

		const inc = increment ? 1 : -1;

		addItem(product, {
			count: inc,
			product_metadata: {
				products: cartItem.product_data.products
					.map((d: any) =>
						d.image !== design.image
							? d
							: d.count + inc > 0
								? { ...d, count: d.count + inc }
								: null,
					)
					.filter((d: any) => d),
			},
		});
	}

	function removeDesign(design: any) {
		const product = products.find((p: any) => p.id === cartItem.id);
		if (!product) return;

		addItem(product, {
			count: -design.count,
			product_metadata: {
				products: cartItem.product_data.products.filter(
					(d: any) => d.image !== design.image,
				),
			},
		});
	}

	return (
		<li className="border-b py-4">
			<div className="flex gap-4 md:gap-8">
				<div className="-z-10 rounded-lg border bg-gray-100">
					<Image
						className="aspect-square object-contain mix-blend-multiply hue-rotate-[50deg] saturate-150"
						src={cartItem.image}
						alt=""
						width={64}
						height={64}
					/>
				</div>
				<div className="flex flex-1 flex-col items-center md:flex-row">
					<div className="flex-1">
						<h2 className="text-xl font-semibold">
							{cartItem.name}
						</h2>
						<p className="text-gray-500">
							{cartItem.quantity} x{" "}
							{formatCurrencyString({
								value: cartItem.price,
								currency: cartItem.currency,
							})}
						</p>
					</div>
					<div className="flex items-center gap-2 md:gap-8">
						<p className="flex-grow text-xl font-semibold md:flex-grow-0">
							{formatCurrencyString({
								value: cartItem.price * cartItem.quantity,
								currency: cartItem.currency,
							})}
						</p>
					</div>
				</div>
			</div>
			<ul className="space-y-4 pt-4">
				{cartItem?.product_data?.products?.map(
					(design: any, i: number) => (
						<li key={i} className="ml-4 flex items-center gap-4">
							<div className="-z-10 mr-auto rounded-lg border bg-gray-100">
								<Image
									className="aspect-square object-contain mix-blend-multiply"
									src={design.cover}
									alt=""
									width={48}
									height={48}
								/>
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold">
									Design {i + 1}
								</h2>
							</div>
							<div className="flex items-center gap-4 rounded-lg border px-2 font-mono">
								<button
									onClick={() =>
										changeDesignCount(design, false)
									}
									className="p-1 font-semibold md:p-2 md:text-xl"
								>
									-
								</button>
								<span className="font-semibold">
									{design.count}
								</span>
								<button
									onClick={() =>
										changeDesignCount(design, true)
									}
									className="p-1 font-semibold md:p-2 md:text-xl"
								>
									+
								</button>
							</div>
							<button
								onClick={() => removeDesign(design)}
								type="button"
								className="p-2 text-muted"
							>
								<FaTrash />
							</button>
						</li>
					),
				)}
			</ul>
		</li>
	);
}

function CartSummary({ config }: { config: any }) {
	const { cartCount, cartDetails, totalPrice, redirectToCheckout }: any =
		useShoppingCart();

	const [isRedirecting, setIsRedirecting] = useState(false);
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

	const currency =
		cartDetails[Object.keys(cartDetails)[0]] &&
		"currency" in cartDetails[Object.keys(cartDetails)[0]]
			? cartDetails[Object.keys(cartDetails)[0]].currency
			: "SEK";

	async function onCheckout(e: any) {
		e.preventDefault();

		if (cartCount <= 0) return;
		setIsRedirecting(true);

		try {
			const { id } = await axios
				.post("/api/checkout_sessions", cartDetails)
				.then((res) => res.data);

			const result = await redirectToCheckout(id);
			if (result?.error) {
				console.error(result);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsRedirecting(false);
		}
	}

	return (
		<div className="h-fit space-y-8 bg-gray-100 p-8">
			<div>
				<div className="flex items-center justify-between border-b border-border_dark py-4">
					<p className="text-xl font-semibold">Delsumma</p>
					<p className="text-xl font-semibold">
						{formatCurrencyString({
							value: totalPrice,
							currency,
						})}
					</p>
				</div>
				<div className="flex items-center justify-between border-b border-border_dark py-4">
					<p className="text-xl font-semibold">Frakt</p>
					<p className="text-xl font-semibold">
						{formatCurrencyString({
							value:
								totalPrice > 0 &&
								totalPrice < config?.freeShippingThreshold
									? config?.shippingCost
									: 0,
							currency,
						})}
					</p>
				</div>
				<div className="flex items-center justify-between border-b border-border_dark py-4">
					<p className="text-xl font-semibold">Totalt</p>
					<p className="text-xl font-semibold">
						{formatCurrencyString({
							value:
								totalPrice > 0 &&
								totalPrice < config?.freeShippingThreshold
									? totalPrice + config?.shippingCost
									: totalPrice,
							currency,
						})}
					</p>
				</div>
			</div>
			<div className="flex gap-4">
				<input
					type="checkbox"
					name="gdpr"
					id="gdpr"
					className="w-8"
					onChange={(e) => setHasAcceptedTerms(e.target.checked)}
				/>
				<p>
					Jag har läst och godkänner{" "}
					<Link href="/terms" className="text-primary_light">
						köpvillkoren
					</Link>
					.
				</p>
			</div>
			<div className="flex flex-col items-stretch gap-4">
				<button
					disabled={
						isRedirecting || cartCount <= 0 || !hasAcceptedTerms
					}
					onClick={onCheckout}
					type="button"
					className="rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light disabled:bg-primary_dark"
				>
					Gå till kassan
				</button>
				<Link
					href="/products"
					className="rounded-lg border-2 px-8 py-4 text-center font-semibold transition-colors hover:bg-white"
				>
					Fortsätt handla
				</Link>
			</div>
		</div>
	);
}

export async function getStaticProps() {
	const products = await GetProducts();

	const config = await GetConfig();

	return {
		props: {
			products,
			config,
		},
	};
}
