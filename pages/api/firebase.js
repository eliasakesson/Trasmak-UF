import admin from "firebase-admin";

const serviceAccount = JSON.parse(
	process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY
);

try {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL:
				"https://uf-ecom-default-rtdb.europe-west1.firebasedatabase.app",
		});
	}
} catch (error) {
	console.error("Firebase admin initialization error", error.stack);
}

const db = admin.database();
const auth = admin.auth();

export { admin, db, auth };
