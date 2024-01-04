import { User } from "firebase/auth";
import { useState, useEffect } from "react";

export default function useIsAdmin(user: User | null | undefined) {
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		if (!user) return;

		user.getIdTokenResult().then((idTokenResult) => {
			if (idTokenResult.claims.admin) {
				setIsAdmin(true);
			}
		});
	}, [user]);

	return isAdmin;
}
