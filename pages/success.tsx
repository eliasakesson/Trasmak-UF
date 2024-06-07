import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import Head from "next/head";
import GetConfig from "@/utils/firebase/getConfig";
import { GetOrder, GetTestOrder } from "@/utils/stripe/getOrders";
import Image from "next/image";
import { GetImagePath } from "./admin/orders/[id]/pdf";
import { useEffect } from "react";

export default function Success({
	config,
	order,
}: {
	config: any;
	order: any;
}) {
	const { clearCart } = useShoppingCart();

	useEffect(() => {
		if (order) {
			clearCart();
		}
	}, [order]);

	return (
		<>
			<Head>
				<title>Orderbekräftelse - Träsmak UF</title>
				<meta
					name="description"
					content="Vi har mottagit din order! Du kommer få en orderbekräftelse via mail inom kort."
				/>
				<meta name="robots" content="noindex, follow" />
			</Head>
			<main className="flex min-h-screen justify-center py-8 lg:py-16">
				<article className="h-fit max-w-3xl rounded-xl p-8 lg:w-1/2 lg:bg-white">
					<div className="flex flex-col items-center gap-2  pb-8">
						<svg
							className="mb-2 h-12 w-12 fill-green-400"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							></path>
						</svg>
						<h1 className="text-2xl font-bold">
							Vi har mottagit din order!
						</h1>
						<p className="text-base text-muted">
							Du kommer få en orderbekräftelse via mail inom kort.
						</p>
					</div>
					<div className="border-y border-border py-8">
						<div className="grid grid-cols-2 gap-16">
							<div className="space-y-2">
								<h2 className="mb-6 text-lg font-semibold text-muted">
									Leveransadress
								</h2>
								<p>{order?.shipping?.name}</p>
								<p>
									{order?.shipping?.address?.line1},
									<br />
									{`${order?.shipping?.address?.postal_code} ${order?.shipping?.address?.city}`}
								</p>
							</div>
							<div className="space-y-2">
								<h2 className="mb-6 text-lg font-semibold text-muted">
									Betalningsmetod
								</h2>
								<p>
									Status:{" "}
									{order?.payment_intent?.status ===
									"succeeded"
										? "Betald"
										: "Misslyckades"}
								</p>
								<p>
									{order?.payment_intent
										?.payment_method_types[0] === "card"
										? "Bankkort"
										: order?.payment_intent
													?.payment_method_types[0] ===
											  "klarna"
											? "Klarna"
											: order?.payment_intent
													?.payment_method_types[0] ??
												"Okänd"}
								</p>
							</div>
						</div>
					</div>
					<div className="space-y-4 py-8">
						<h2 className="text-lg font-semibold text-muted">
							Produkter
						</h2>
						<div className="">
							<ul className="">
								{order?.products?.map(
									(product: any, i: number) => (
										<li className="border-b py-4" key={i}>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<Image
														className="h-16 w-24 rounded-md object-contain"
														src={GetImagePath(
															product.image,
														)}
														alt={product?.name}
														width={96}
														height={64}
														priority
													/>
													<div>
														<h3 className="text-lg font-semibold">
															{product?.name}
														</h3>
														<p className="text-muted">
															{product?.quantity}{" "}
															x{" "}
															{formatCurrencyString(
																{
																	value: product?.price,
																	currency:
																		product?.currency ??
																		"sek",
																},
															)}
														</p>
													</div>
												</div>
												<p className="hidden text-xl font-semibold lg:block">
													{formatCurrencyString({
														value:
															product?.price *
																product?.quantity ??
															0,
														currency:
															product?.currency ??
															"sek",
													})}
												</p>
											</div>
										</li>
									),
								)}
							</ul>
						</div>
					</div>

					<div className="wl">
						<ul className="space-y-4">
							<li className="flex justify-between">
								<p className="">Delsumma</p>
								<p>
									{formatCurrencyString({
										value: order?.subtotal,
										currency: order?.currency ?? "sek",
									})}
								</p>
							</li>
							<li className="flex justify-between">
								<p className="">Frakt</p>
								<p>
									{formatCurrencyString({
										value:
											order?.total >=
											config?.freeShippingThreshold
												? 0
												: config?.shippingCost,
										currency: order?.currency ?? "sek",
									})}
								</p>
							</li>
							<li className="flex justify-between">
								<p className="mb-2 text-xl font-semibold">
									Total
								</p>
								<p className="text-2xl font-semibold">
									{formatCurrencyString({
										value: order?.total,
										currency: order?.currency ?? "sek",
									})}
								</p>
							</li>
						</ul>
					</div>
				</article>
			</main>
		</>
	);
}

export async function getServerSideProps({
	query,
}: {
	query: { session_id: string };
}) {
	const sessionId = query.session_id;

	if (!sessionId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	try {
		const [config, order] = await Promise.all([
			GetConfig(),
			GetTestOrder(sessionId),
		]);

		return {
			props: {
				config,
				order,
			},
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
}
