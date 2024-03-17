import { stripe } from "@/utils/stripe/stripe";

export default async function handler(req, res) {
	if (req.method === "GET") {
		const id = req.query.id;

		try {
			if (!id.startsWith("cs_")) {
				throw Error("Incorrect CheckoutSession ID.");
			}

			const checkoutSession = await stripe.checkout.sessions.retrieve(
				id,
				{
					expand: ["payment_intent", "line_items"],
				},
			);
			res.status(200).json(checkoutSession);
		} catch (error) {
			console.error(error);
			res.status(500).json({ statusCode: 500, message: error.message });
		}
	} else {
		res.setHeader("Allow", "GET");
		res.status(405).end("Method Not Allowed");
	}
}
