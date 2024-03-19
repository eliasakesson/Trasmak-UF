export default async function handler(req: any, res: any) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { startDate, endDate } = req.query;

	const bearerID = "Bearer%20oxO72XRhbNw1CgwJjCBKftbb";
	const projectID = "trsmak-uf";

	const response = await fetch(
		`https://vercel.com/api/web/insights/overview?from=${startDate}&to=${endDate}&projectId=${projectID}&filter=%7B%7D&environment=production&limit=150`,
		{
			headers: {
				Cookie: `authorization=${bearerID}`,
			},
		},
	);

	const data = await response.json();
	console.log(data);

	res.status(200).json(data);
}
