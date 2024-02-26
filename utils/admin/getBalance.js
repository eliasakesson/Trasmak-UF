import { stripe } from "../stripe";

export default async function GetBalance() {
	const balance = await stripe.balance.retrieve();
	return {
		available: balance.available[0].amount,
		pending: balance.pending[0].amount,
		currency: balance.available[0].currency,
	};
}

export async function GetOrderTotal() {
	const sessions = await stripe.checkout.sessions.list({
		status: "complete",
	});
	const total = sessions.data.reduce((acc, session) => {
		return acc + session.amount_total;
	}, 0);
	const currency = sessions.data[0].currency;

	return {
		total,
		currency,
	};
}
