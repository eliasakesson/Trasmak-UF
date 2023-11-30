import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
