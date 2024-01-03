import { ref, set } from "firebase/database";
import { DesignProps } from "./Interfaces";
import { db } from "@/firebase";
import { User } from "firebase/auth";
import { v4 as uuid } from "uuid";

export function SaveDesign(design: DesignProps, user: User) {
	return new Promise<void>((res, rej) => {
		const designRef = ref(db, `users/${user.uid}/${uuid()}`);

		set(designRef, design)
			.then(() => {
				res();
			})
			.catch(() => {
				rej();
			});
	});
}
