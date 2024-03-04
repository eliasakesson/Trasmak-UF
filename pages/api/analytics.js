import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.NEXT_PUBLIC_GA_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
	credentials: {
		client_email: process.env.NEXT_PUBLIC_GA_CLIENT_EMAIL,
		private_key: process.env.NEXT_PUBLIC_GA_PRIVATE_KEY,
	},
});

export default async function handler(req, res) {
	const [response] = await analyticsDataClient.runReport({
		property: `properties/${propertyId}`,
		dateRanges: [
			{
				startDate: `7daysAgo`, //👈  e.g. "7daysAgo" or "30daysAgo"
				endDate: "today",
			},
		],
		dimensions: [
			{
				name: "year", // I wanted the data be year wised
			},
		],
		metrics: [
			{
				name: "activeUsers", // it returs the active users
			},
		],
	});

	console.log(response);

	// Returning the respose.
	return res.status(200).json({
		response,
	});
}
