import { ref, remove, set } from "firebase/database";
import { DesignProps } from "./Interfaces";
import { db } from "@/firebase";
import { User } from "firebase/auth";

export function SaveDesign(design: DesignProps, user: User) {
	const designRef = ref(db, `users/${user.uid}/${Date.now()}`);

	return set(designRef, design);
}

export function UploadTemplate(design: DesignProps) {
	const designRef = ref(db, `templates/${Date.now()}`);

	return set(designRef, design);
}

export function DeleteTemplate(designKey: string) {
	const designRef = ref(db, `templates/${designKey}`);

	return remove(designRef);
}

export function DeleteDesign(designKey: string, user: User) {
	const designRef = ref(db, `users/${user.uid}/${designKey}`);

	return remove(designRef);
}
