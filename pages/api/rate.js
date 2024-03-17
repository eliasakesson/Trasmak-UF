import { v4 as uuid } from "uuid";
import { stripe } from "@/utils/stripe/stripe";
import { db } from "./firebase";

export default async (req, res) => {
	const { productID, rating, rateToken } = req.query;

	try {
		const productExists = await ProductExists(productID);
		if (!productExists) {
			res.status(404).json({
				statusCode: 404,
				message: "Product not found!",
			});
			return;
		}

		const validRateToken = await ValidRateToken(rateToken, productID);
		if (!validRateToken) {
			res.status(403).json({
				statusCode: 403,
				message: "Invalid rate token!",
			});
			return;
		}

		await Promise.all([
			RemoveRateToken(rateToken),
			UploadRating(productID, rating),
		]);

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

async function ProductExists(productID) {
	const inventory = await stripe.prices.list();
	const product = inventory.data.find((price) => price.id === productID);

	return !!product;
}

async function ValidRateToken(token, productID) {
	const ref = db.ref("rateTokens");
	const snapshot = await ref.once("value");
	const rateTokens = snapshot.val();

	if (!rateTokens) {
		return false;
	}

	if (!rateTokens[token]) {
		return false;
	}

	if (`price_${rateTokens[token]}` !== productID) {
		return false;
	}

	return true;
}

async function RemoveRateToken(token) {
	const ref = db.ref("rateTokens");
	await ref.child(token).remove();
}

async function UploadRating(productID, rating) {
	const ref = db.ref(`products/${productID}/ratings/${uuid()}`);
	await ref.set({
		rating: parseInt(rating),
	});
}
