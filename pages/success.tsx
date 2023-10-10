import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";

export default function Success() {
	const router = useRouter();
	const sessionId = router.query.session_id;

	const { clearCart } = useShoppingCart();

	const { data, error, isLoading } = useSWR(
		() => (sessionId ? `/api/checkout_sessions/${sessionId}` : null),
		(url) => axios.get(url).then((res) => res.data),
		{
			onSuccess() {
				clearCart();
			},
		}
	);
	console.log(data);

	return (
		<div className="flex justify-center py-16">
			<div className="w-1/2 max-w-3xl bg-white rounded-xl p-8">
				<div className="flex flex-col items-center gap-2  pb-8">
					<svg
						className="w-12 h-12 fill-green-400 mb-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						></path>
					</svg>
					<h1 className="font-bold text-2xl">
						Vi har mottagit din order!
					</h1>
					<p className="text-base text-muted">
						Du kommer få en orderbekräftelse via mail inom kort.
					</p>
				</div>
				<div className="border-y border-border py-8">
					<div className="grid grid-cols-2 gap-16">
						<div className="space-y-2">
							<h2 className="text-muted_light font-semibold text-lg mb-6">
								Leveransadress
							</h2>
							<p>{data?.shipping_details?.name}</p>
							<p>
								{data?.shipping_details?.address?.line1},
								<br />
								{`${data?.shipping_details?.address?.postal_code} ${data?.shipping_details?.address?.city}`}
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-muted_light font-semibold text-lg mb-6">
								Betalningsmetod
							</h2>
							<p>
								Status:{" "}
								{data?.payment_intent?.status === "succeeded"
									? "Betald"
									: "Misslyckades"}
							</p>
							<p>
								{data?.payment_intent
									?.payment_method_types[0] === "card"
									? "Bankkort"
									: data?.payment_intent
											?.payment_method_types[0] ===
									  "klarna"
									? "Klarna"
									: "Fel"}
							</p>
						</div>
					</div>
				</div>

				<div className="py-8 space-y-4">
					<h2 className="text-muted_light font-semibold text-lg">
						Produkter
					</h2>
					<div className="">
						<ul className="">
							{data?.line_items?.data.map((item: any) => (
								<li className="border-b py-4" key={item.id}>
									<div className="flex justify-between">
										<div className="">
											<div className="text-xl font-semibold">
												<h3 className="">
													{item?.name}
												</h3>
												<p className="">
													{item?.description}
												</p>
											</div>
										</div>
										<div className="">
											<p className="font-semibold text-xl">
												{item?.price
													? formatCurrencyString({
															value: item.price
																.unit_amount,
															currency:
																item.price
																	.currency ??
																"sek",
													  })
													: "0"}
											</p>
											<p>{item.quantity} st</p>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="wl">
					<ul className="space-y-4">
						<li className="flex justify-between">
							<p className="">Delsumma</p>
							<p>
								{formatCurrencyString({
									value: data?.amount_subtotal,
									currency: data?.currency ?? "sek",
								})}
							</p>
						</li>
						<li className="flex justify-between">
							<p className="">Frakt</p>
							<p>59,00 kr</p>
						</li>
						<li className="flex justify-between">
							<p className="text-xl font-semibold mb-2">Total</p>
							<p className="text-2xl font-semibold">
								{formatCurrencyString({
									value: data?.amount_total,
									currency: data?.currency ?? "sek",
								})}
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
