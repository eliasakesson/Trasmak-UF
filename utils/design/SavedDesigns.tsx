import DesignsGrid from "@/utils/design/DesignsGrid";
import { Product } from "use-shopping-cart/core";
import { DesignProps } from "./Interfaces";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { get, onValue, ref } from "firebase/database";

export default function SavedDesigns({
	products,
	onSelect,
	canvasClassKey,
}: {
	products: Product[];
	onSelect: (design: DesignProps) => void;
	canvasClassKey: string;
}) {
	const [user, loading, error] = useAuthState(auth);
	const [designs, setDesigns] = useState([]);

	useEffect(() => {
		if (!user) return;

		const userRef = ref(db, "users/" + user.uid);

		onValue(userRef, (snapshot) => {
			const data = snapshot.val();
			if (!data) return;

			setDesigns(Object.values(data));
		});
	}, [user]);

	return user ? (
		designs?.length > 0 ? (
			<DesignsGrid
				designs={designs}
				products={products}
				onSelect={onSelect}
				canvasClassKey={canvasClassKey}
			/>
		) : (
			<p>Inga sparade designs hittades</p>
		)
	) : (
		<p>Du är inte inloggad</p>
	);
}
