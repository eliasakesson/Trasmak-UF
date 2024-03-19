import { storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function uploadBlob(blob: Blob) {
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

export async function uploadFromCanvas(canvas: HTMLCanvasElement) {
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject("Error converting canvas to blob");
				return;
			}

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

export function shortenDownloadURL(url: string) {
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
			return result;
		})
		.catch((error) => {
			return error;
		});
}
