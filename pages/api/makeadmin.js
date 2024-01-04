import { auth } from "./firebase";

export default async (req, res) => {
	const { uid } = req.query;

	try {
		await auth.setCustomUserClaims(uid, { admin: true });

		const user = await auth.getUser(uid);
		console.log(user.customClaims);

		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error setting custom claims:", error);
		res.status(500).json({ error: error.message });
	}
};
