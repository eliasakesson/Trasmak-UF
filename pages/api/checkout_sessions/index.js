import { stripe } from "@/utils/stripe";
import { validateCartItems } from "use-shopping-cart/utilities";
import { db } from "../firebase";
import { shortenDownloadURL } from "@/utils/firebase";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const ref = db.ref("config");
			let data = {};
			await ref.once("value", (snapshot) => {
				data = snapshot.val();
			});

			if (
				!data ||
				data.length === 0 ||
				!data.shippingCost ||
				!data.freeShippingThreshold
			) {
				res.status(500).json({
					statusCode: 500,
					message: "Something went wrong!",
				});
				return;
			}

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

			const isFreeShipping =
				lineItems.reduce(
					(acc, product) =>
						acc + product.price_data.unit_amount * product.quantity,
					0,
				) >= data.freeShippingThreshold;

			const metadata = {
				products: JSON.stringify(
					Object.values(cartDetails)
						.map((product) =>
							product.product_data.products.map((p) => ({
								id: product.id,
								count: p.count,
								image: shortenDownloadURL(p.image),
							})),
						)
						.flat(),
				),
			};

			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				payment_method_types: ["card", "klarna"],
				line_items: lineItems,
				success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/cart`,
				metadata: metadata,
				shipping_address_collection: { allowed_countries: ["SE"] },
				shipping_options: [
					{
						shipping_rate_data: {
							type: "fixed_amount",
							fixed_amount: {
								amount: isFreeShipping ? 0 : data.shippingCost,
								currency: "sek",
							},
							display_name: isFreeShipping
								? "Gratis leverans"
								: "Standardleverans",
							delivery_estimate: {
								minimum: {
									unit: "business_day",
									value: 3,
								},
								maximum: {
									unit: "business_day",
									value: 7,
								},
							},
						},
					},
				],
			});
			res.status(200).json({ id: session.id });
		} catch (error) {
			console.error(error);
			res.status(500).json({ statusCode: 500, message: error.message });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
