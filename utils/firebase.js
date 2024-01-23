import { useAnalytics, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { logEvent } from "firebase/analytics";

export async function uploadBlob(blob) {
	const imageRef = ref(storage, `images/${uuidv4()}`);

	return new Promise((resolve, reject) => {
		uploadBytes(imageRef, blob)
			.then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					resolve(url);
				});
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function uploadFromCanvas(canvas) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			uploadBlob(blob)
				.then((url) => {
					resolve(url);
				})
				.catch((error) => {
					reject(error);
				});
		});
	});
}

export function shortenDownloadURL(url) {
	if (!url) {
		return "";
	}
	const match = url.match(/%2F(.*?)\?/);

	if (match) {
		return match[1];
	}

	return url;
}

export function signInWithGoogle() {
	const { analytics } = useAnalytics();

	const provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider)
		.then((result) => {
			analytics &&
				logEvent(analytics, "login", {
					method: "google",
				});
		})
		.catch((error) => {
			console.error(error);
		});
}
