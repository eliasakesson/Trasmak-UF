import { stripe } from "../stripe";

export default async function GetOrders() {
	const sessions = await stripe.checkout.sessions.list({
		status: "complete",
	});

	const data = sessions?.data?.map((session) => {
		return {
			...session,
			total: session.amount_total,
			currency: session.currency,
			customer: session.customer_details,
			products: JSON.parse(session.metadata.products),
		};
	});

	return data;
}
