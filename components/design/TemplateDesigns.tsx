import DesignsGrid from "@/components/design/DesignsGrid";
import { Product } from "use-shopping-cart/core";
import { DesignProps } from "../../utils/design/Interfaces";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { onValue, ref } from "firebase/database";
import { DeleteTemplate } from "@/utils/design/DesignSaver";
import toast from "react-hot-toast";
import useIsAdmin from "@/utils/useIsAdmin";

export default function TemplateDesigns({
	products,
	onSelect,
	canvasClassKey,
	maxDesigns,
	sort = true,
	hideDelete,
}: {
	products: Product[];
	onSelect: (design: DesignProps) => void;
	canvasClassKey: string;
	maxDesigns?: number;
	sort?: boolean;
	hideDelete?: boolean;
}) {
	const [user, loading, error] = useAuthState(auth);
	const isAdmin = useIsAdmin(user);

	const [designs, setDesigns] = useState<DesignProps[]>([]);
	const designsObject = useRef<{ [key: string]: DesignProps }>({});

	useEffect(() => {
		const templatesRef = ref(db, "templates");

		onValue(templatesRef, (snapshot) => {
			const data = snapshot.val();
			designsObject.current = data;
			if (!data) {
				setDesigns([]);
				return;
			}

			const dataArray = Object.entries(data);

			if (sort) {
				dataArray.sort((a: any, b: any) => b[0] - a[0]);
			} else {
				dataArray.sort(() => Math.random() - 0.5);
			}

			const sortedDesigns = dataArray.map(
				(data) => data[1]
			) as DesignProps[];

			setDesigns(sortedDesigns);
		});
	}, []);

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

		toast.promise(DeleteTemplate(key), {
			loading: "Tar bort mall",
			success: "Mall borttagen",
			error: "Borttagning misslyckades",
		});
	}

	return (
		<DesignsGrid
			designs={designs.slice(0, maxDesigns || designs.length)}
			products={products}
			onSelect={onSelect}
			canvasClassKey={canvasClassKey}
			trashClicked={isAdmin && !hideDelete ? removeDesign : undefined}
		/>
	);
}
