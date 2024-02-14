import GetProducts from "../getProducts";
import { stripe } from "../stripe";

export default async function GetOrders() {
	const sessions = await stripe.checkout.sessions.list({
		status: "complete",
	});

	const lineItems = await Promise.all(
		sessions.data.map(async (session) => {
			const lineItems = await stripe.checkout.sessions.listLineItems(
				session.id,
				{ expand: ["data.price.product"] },
			);
			return lineItems.data;
		}),
	)
		.then((lineItems) => lineItems.flat())
		.catch((error) => {
			console.error("Error fetching line items", error);
		});

	const data = sessions?.data?.map((session) => {
		const metadataProducts = JSON.parse(session.metadata.products);

		const products = lineItems
			.filter((lineItem) => lineItem.price)
			.map((lineItem) => {
				const designs = metadataProducts.filter(
					(metadataProduct) =>
						metadataProduct.id === lineItem.price.product.id ||
						metadataProduct.name === lineItem.price.product.name,
				);

				return {
					...lineItem,
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
	});

	return data;
}

export async function GetOrder(id) {
	const session = await stripe.checkout.sessions.retrieve(id);

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
