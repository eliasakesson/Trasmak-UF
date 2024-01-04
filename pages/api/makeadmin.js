import { auth } from "./firebase";

export default async (req, res) => {
	const { uid, adminUID } = req.query;

	try {
		if (!uid || !adminUID) {
			return res.status(400).json({ error: "Missing params" });
		}
		const adminUser = await auth.getUser(adminUID);
		if (!adminUser.customClaims.admin) {
			return res.status(403).json({ error: "Request not authorized" });
		}

		await auth.setCustomUserClaims(uid, { admin: true });

		const user = await auth.getUser(uid);
		console.log(user.customClaims);

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error setting custom claims:", error);
		res.status(500).json({ error: error.message });
	}
};
