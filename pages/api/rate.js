import { v4 as uuid } from "uuid";
import { stripe } from "@/utils/stripe";
import { db } from "./firebase";

export default async (req, res) => {
	const { productID, rating } = req.query;

	const inventory = await stripe.prices.list();
	const product = inventory.data.find((price) => price.id === productID);

	if (!product) {
		res.status(404).json({
			statusCode: 404,
			message: "Product not found!",
		});
		return;
	}

	const ref = db.ref(`products/${productID}/ratings/${uuid()}`);

	try {
		await ref.set({
			rating: parseInt(rating),
		});

		res.status(200).json({
			statusCode: 200,
			message: "Rating submitted!",
		});
	} catch (error) {
		res.status(500).json({
			statusCode: 500,
			message: "Something went wrong!",
		});
	}
};
