export default async function GetAnalytics() {
	try {
		const respone = await fetch("/api/analytics");
		const data = await respone.json();

		return data;
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
}
