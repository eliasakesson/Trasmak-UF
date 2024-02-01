import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AdminWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, loading, error] = useAuthState(auth);

	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		if (!user || loading || error) return;

		async function getAdmin() {
			if (!user) return;

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

	return (
		<>
			{isAdmin ? (
				children
			) : (
				<div className="flex min-h-[80vh] flex-col items-center justify-center gap-8">
					<h1 className="text-2xl font-bold sm:text-4xl">
						You are not authorized
					</h1>
				</div>
			)}
		</>
	);
}
