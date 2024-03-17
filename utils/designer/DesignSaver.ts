import { ref, remove, set } from "firebase/database";
import { DesignProps } from "./Interfaces";
import { db } from "@/firebase";
import { User } from "firebase/auth";
import { uploadBlob } from "../firebase/helper";

export async function SaveDesign(design: DesignProps, user: User) {
	const newDesign = await GetDesignWithUploadedImages(design);

	const designRef = ref(db, `users/${user.uid}/savedDesigns/${Date.now()}`);

	return set(designRef, newDesign)
		.then(() => {
			return newDesign;
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
}

export async function UploadTemplate(design: DesignProps) {
	const newDesign = await GetDesignWithUploadedImages(design);

	const designRef = ref(db, `templates/${Date.now()}`);

	return set(designRef, newDesign);
}

export function DeleteTemplate(designKey: string) {
	const designRef = ref(db, `templates/${designKey}`);

	return remove(designRef);
}

export function DeleteDesign(designKey: string, user: User) {
	const designRef = ref(db, `users/${user.uid}/savedDesigns/${designKey}`);

	return remove(designRef);
}

async function GetDesignWithUploadedImages(design: DesignProps) {
	const imageStrings = design.objects
		.filter((object) => object.type == "image")
		.map((object) => object.content);

	const promises = imageStrings.map((imageString) => {
		return new Promise((resolve, reject) => {
			fetch(imageString)
				.then(async (r) => {
					try {
						const blob = await r.blob();
						const url = await uploadBlob(blob);
						resolve(url);
					} catch (error) {
						reject(error);
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	});

	try {
		const urls = await Promise.all(promises);
		return {
			...design,
			objects: design.objects.map((object_2) => ({
				...object_2,
				content:
					object_2.type == "image" ? urls.shift() : object_2.content,
				image: null,
			})),
		};
	} catch (error) {
		console.log(error);
		return await new Promise((resolve, reject) => {
			reject(error);
		});
	}
}
