import { auth } from "./firebase";

export default async (req, res) => {
	const { uid, token } = req.body;

	try {
		if (!uid || !token) {
			return res.status(400).json({ error: "Missing params" });
		}

		const decodedToken = await auth.verifyIdToken(token);
		const { admin } = decodedToken;
		if (!admin) {
			return res.status(403).json({ error: "Not authorized" });
		}

		await auth.setCustomUserClaims(uid, { admin: true });

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error setting custom claims:", error);
		res.status(500).json({ error: error.message });
	}
};
