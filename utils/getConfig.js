import { ref, get } from "firebase/database";
import { db } from "../firebase";

export default async function GetConfig(){
    const configRef = ref(db, "config");

	const configSnap = await get(configRef);
	const config = configSnap.val();

    return config;
}