import { User } from "firebase/auth";
import { useState, useEffect } from "react";

export default function useIsAdmin(user: User | null | undefined) {
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		async function getAdmin() {
			if (!user) {
				setIsAdmin(false);
				return;
			}

			const token = await user.getIdToken();

			const response = await fetch("/api/isadmin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});
			const data = await response.json();
			setIsAdmin(data.success);
		}

		try {
			getAdmin();
		} catch (error) {
			console.log(error);
		}
	}, [user]);

	return isAdmin;
}
