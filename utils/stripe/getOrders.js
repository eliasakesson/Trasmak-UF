import { GetOrderInfo } from "../firebase/getOrderInfo";
import GetProducts from "./getProducts";
import { stripe, testStripe } from "./stripe";

export default async function GetOrders(hideRefunded = true) {
	const sessions = await stripe.checkout.sessions.list({
		status: "complete",
		limit: 100,
	});

	const orders = await Promise.all(
		sessions.data.map((session) => GetOrder(session.id)),
	);

	console.log(orders);

	if (!hideRefunded) {
		return orders;
	}

	const ordersInfos = await Promise.all(
		orders.map((order) => GetOrderInfo(order.id)),
	);

	return orders.filter((_, index) => {
		return ordersInfos[index]?.status !== "refunded";
	});
}

export async function GetOrder(id) {
	const session = await stripe.checkout.sessions.retrieve(id, {
		expand: ["payment_intent"],
	});

	const stripeProducts = await GetProducts();
	const metadataProducts = JSON.parse(session.metadata.products);

	const products = metadataProducts.map((metadataProduct) => {
		const product = stripeProducts.find(
			(stripeProduct) =>
				stripeProduct.id === metadataProduct.id ||
				stripeProduct.name === metadataProduct.name,
		);

		return {
			...product,
			image: metadataProduct.image,
			quantity: metadataProduct.count,
		};
	});

	return {
		...session,
		total: session.amount_total,
		subtotal: session.amount_subtotal,
		currency: session.currency,
		customer: session.customer_details,
		products,
		shipping: session.shipping_details,
	};
}

export async function GetTestOrder(id) {
	const session = await testStripe.checkout.sessions.retrieve(id, {
		expand: ["payment_intent"],
	});

	const stripeProducts = await GetProducts();
	const metadataProducts = JSON.parse(session.metadata.products);

	const products = metadataProducts.map((metadataProduct) => {
		const product = stripeProducts.find(
			(stripeProduct) =>
				stripeProduct.id === metadataProduct.id ||
				stripeProduct.name === metadataProduct.name,
		);

		return {
			...product,
			image: metadataProduct.image,
			quantity: metadataProduct.count,
		};
	});

	return {
		...session,
		total: session.amount_total,
		subtotal: session.amount_subtotal,
		currency: session.currency,
		customer: session.customer_details,
		products,
		shipping: session.shipping_details,
	};
}

export async function GetOrderCompacted(id) {
	const session = await stripe.checkout.sessions.retrieve(id);

	const stripeProducts = await GetProducts();
	const metadataProducts = JSON.parse(session.metadata.products);

	const products = stripeProducts
		.filter((product) => {
			const metadataProduct = metadataProducts.find(
				(metadataProduct) =>
					metadataProduct.id === product.id ||
					metadataProduct.name === product.name,
			);

			if (metadataProduct) {
				return true;
			}

			return false;
		})
		.map((product) => {
			const designs = metadataProducts.filter(
				(metadataProduct) =>
					metadataProduct.id === product.id ||
					metadataProduct.name === product.name,
			);

			return {
				...product,
				designs,
			};
		});

	return {
		...session,
		total: session.amount_total,
		currency: session.currency,
		customer: session.customer_details,
		products,
		shipping: session.shipping_details,
	};
}
