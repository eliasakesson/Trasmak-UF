import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

export default function Cart() {
	const {
		cartDetails,
		incrementItem,
		decrementItem,
		removeItem,
		totalPrice,
		redirectToCheckout,
	} = useShoppingCart();

	return (
		<div className="max-w-7xl mx-auto px-8 py-16 space-y-8">
			<div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-x-16 gap-x-0 gap-y-16">
				<CartItems />
				<CartSummary />
			</div>
		</div>
	);
}

function CartItems() {
	const { cartDetails, incrementItem, decrementItem, removeItem }: any =
		useShoppingCart();

	return (
		<div className="col-span-2">
			<div className="flex justify-between items-center py-4 border-b pb-8">
				<h1 className="text-4xl font-bold">Min Varukorg</h1>
				<p className="text-gray-500">
					{Object.keys(cartDetails).length}{" "}
					{Object.keys(cartDetails).length > 1
						? "produkter"
						: "produkt"}{" "}
					i varukorgen
				</p>
			</div>
			<ul>
				{Object.keys(cartDetails).map((item, index) => (
					<CartItem
						key={index}
						cartItem={cartDetails[item]}
						incrementItem={incrementItem}
						decrementItem={decrementItem}
						removeItem={removeItem}
					/>
				))}
			</ul>
		</div>
	);
}

function CartItem({
	cartItem,
	incrementItem,
	decrementItem,
	removeItem,
}: {
	cartItem: any;
	incrementItem: any;
	decrementItem: any;
	removeItem: any;
}) {
	return (
		<li className="flex md:gap-8 gap-4 py-4 border-b">
			<div className="-z-10 bg-gray-100 rounded-lg border">
				<Image
					className="mix-blend-multiply"
					src={cartItem.image}
					alt=""
					width={64}
					height={64}
				/>
			</div>

			<div className="flex md:flex-row flex-col flex-1">
				<div className="flex-1">
					<p className="text-xl font-semibold">{cartItem.name}</p>
				</div>

				<div className="flex items-center md:gap-8 gap-2">
					<p className="font-semibold text-xl md:flex-grow-0 flex-grow">
						{formatCurrencyString({
							value: cartItem.price,
							currency: cartItem.currency,
						})}
					</p>
					<div className="px-2 flex gap-4 items-center border rounded-lg font-mono">
						<button
							className="md:p-2 p-1 font-semibold md:text-xl"
							onClick={() => decrementItem(cartItem.id)}>
							-
						</button>
						<span className="font-semibold">
							{cartItem.quantity}
						</span>
						<button
							className="md:p-2 p-1 font-semibold md:text-xl"
							onClick={() => incrementItem(cartItem.id)}>
							+
						</button>
					</div>
					<button
						type="button"
						className="p-2 text-muted"
						onClick={() => removeItem(cartItem.id)}>
						<FaTrash />
					</button>
				</div>
			</div>
		</li>
	);
}

function CartSummary() {
	const { cartCount, cartDetails, totalPrice, redirectToCheckout }: any =
		useShoppingCart();

	const [isRedirecting, setIsRedirecting] = useState(false);

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
		<div className="p-8 bg-gray-100 space-y-8">
			<div>
				<div className="flex items-center justify-between py-4 border-b border-border_dark">
					<p className="font-semibold text-xl">Delsumma</p>
					<p className="font-semibold text-xl">
						{formatCurrencyString({
							value: totalPrice,
							currency,
						})}
					</p>
				</div>
				<div className="flex items-center justify-between py-4 border-b border-border_dark">
					<p className="font-semibold text-xl">Frakt</p>
					<p className="font-semibold text-xl">59,00 kr</p>
				</div>
				<div className="flex items-center justify-between py-4 border-b border-border_dark">
					<p className="font-semibold text-xl">Totalt</p>
					<p className="font-semibold text-xl">
						{formatCurrencyString({
							value: totalPrice + 5900,
							currency,
						})}
					</p>
				</div>
			</div>
			<div className="flex flex-col items-stretch gap-4">
				<button
					disabled={isRedirecting}
					onClick={onCheckout}
					type="button"
					className="py-4 px-8 bg-primary text-white rounded-lg font-semibold">
					Gå till kassan
				</button>

				<Link
					href="/products"
					className="py-4 px-8 border-2 rounded-lg font-semibold text-center">
					Fortsätt handla
				</Link>
			</div>
		</div>
	);
}
