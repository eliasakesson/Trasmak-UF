import DesignsGrid from "@/components/design/DesignsGrid";
import { Product } from "use-shopping-cart/core";
import { DesignProps } from "../../utils/design/Interfaces";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { onValue, ref } from "firebase/database";
import { DeleteDesign, UploadTemplate } from "@/utils/design/DesignSaver";
import toast from "react-hot-toast";
import useIsAdmin from "@/utils/useIsAdmin";

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
	const isAdmin = useIsAdmin(user);

	const [designs, setDesigns] = useState<DesignProps[]>([]);
	const designsObject = useRef<{ [key: string]: DesignProps }>({});

	useEffect(() => {
		if (!user || loading || error) return;

		const userRef = ref(db, "users/" + user.uid + "/savedDesigns");

		onValue(userRef, (snapshot) => {
			const data = snapshot.val();
			designsObject.current = data;
			if (!data) {
				setDesigns([]);
				return;
			}

			const dataArray = Object.entries(data);
			dataArray.sort((a: any, b: any) => b[0] - a[0]);

			const sortedDesigns = dataArray.map(
				(data) => data[1]
			) as DesignProps[];

			setDesigns(sortedDesigns);
		});
	}, [user]);

	function removeDesign(design: DesignProps) {
		if (!user) {
			toast.error("Ej inloggad");
			return;
		}

		const object = designsObject.current;
		const key = Object.keys(object).find(
			(key: string) => object[key] === design
		);
		if (!key) {
			toast.error("Borttagning misslyckades");
			return;
		}

		toast.promise(DeleteDesign(key, user), {
			loading: "Tar bort design",
			success: "Design borttagen",
			error: "Borttagning misslyckades",
		});
	}

	function uploadClicked(design: DesignProps) {
		toast.promise(UploadTemplate(design), {
			loading: "Laddar upp mall",
			success: "Mall uppladdad",
			error: "Fel vid uppladdning",
		});
	}

	return user ? (
		designs?.length > 0 ? (
			<DesignsGrid
				designs={designs}
				products={products}
				onSelect={onSelect}
				canvasClassKey={canvasClassKey}
				trashClicked={removeDesign}
				uploadClicked={isAdmin ? uploadClicked : undefined}
			/>
		) : (
			<p>Inga sparade designs hittades</p>
		)
	) : (
		<p>Du är inte inloggad</p>
	);
}
