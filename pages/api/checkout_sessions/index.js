import { stripe } from "@/utils/stripe";
import { validateCartItems } from "use-shopping-cart/utilities";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const cartDetails = req.body;
			const inventory = await stripe.prices.list({
				expand: ["data.product"],
			});
			const products = inventory.data.map((price) => {
				const product = price.product;
				return {
					currency: price.currency,
					id: price.id,
					name: product.name,
					price: price.unit_amount,
					image: product.images[0],
				};
			});

			const lineItems = validateCartItems(products, cartDetails);
			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				payment_method_types: ["card", "klarna"],
				line_items: lineItems,
				success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/cart`,
				shipping_address_collection: { allowed_countries: ["SE"] },
			});
			res.status(200).json({ id: session.id });
		} catch {
			console.error(error);
			res.status(500).json({ statusCode: 500, message: error.message });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
