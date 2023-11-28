import { stripe } from "./stripe";

export default async function GetProducts(randomize = false) {
	const inventory = await stripe.prices.list({
		expand: ["data.product"],
	});

	const products = inventory.data.filter((product) => product.product.active).map((product) => ({
		id: product.id,
		price: product.unit_amount,
		currency: product.currency,
		name: product.product.name,
		description: product.product.description,
		image: product.product.images[0],
		metadata: product.product.metadata,
	}));

	if (randomize) {
		products.sort((a, b) => {
			return Math.random() - 0.5;
		});
	}

	return products;
}

export async function GetProduct(id) {
	const product = await stripe.prices.retrieve(id, {
		expand: ["product"],
	});

	if (!product || !product?.product?.active) {
		return null;
	}

	return {
		id: product.id,
		price: product.unit_amount,
		currency: product.currency,
		name: product.product.name,
		description: product.product.description,
		image: product.product.images[0],
		metadata: product.product.metadata,
	};
}
