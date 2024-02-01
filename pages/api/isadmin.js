import { auth } from "./firebase";

export default async function handler(req, res) {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ error: "Missing params" });
		}

		const decodedToken = await auth.verifyIdToken(token);
		const { admin } = decodedToken;
		if (!admin) {
			return res.status(403).json({ error: "Not authorized" });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}
