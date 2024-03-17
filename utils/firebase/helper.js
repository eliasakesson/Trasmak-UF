import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signIn } from "next-auth/react";

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
	const provider = new GoogleAuthProvider();
	return signInWithPopup(auth, provider)
		.then((result) => {
			signIn(
				"credentials",
				{ user: JSON.stringify(result.user) },
				{ redirect: false },
			)
				.then((response) => {
					return response;
				})
				.catch((error) => {
					return error;
				});
		})
		.catch((error) => {
			return error;
		});
}
