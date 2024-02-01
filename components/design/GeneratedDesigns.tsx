import DesignsGrid from "@/components/design/DesignsGrid";
import { Product } from "use-shopping-cart/core";
import { DesignProps, ObjectProps } from "../../utils/design/Interfaces";
import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase";
import { onValue, ref } from "firebase/database";

export default function GeneratedDesigns({
	products,
	image,
	onSelect,
	maxDesigns,
}: {
	products: Product[];
	image: string;
	onSelect: (design: DesignProps) => void;
	maxDesigns?: number;
}) {
	const [templates, setTemplates] = useState<DesignProps[]>([]);
	const [designs, setDesigns] = useState<DesignProps[]>([]);

	useEffect(() => {
		const templatesRef = ref(db, "templates");

		onValue(templatesRef, (snapshot) => {
			const data = snapshot.val();
			if (!data) {
				setTemplates([]);
				return;
			}

			const dataArray = Object.entries(data);

			const sortedDesigns = dataArray.map(
				(data) => data[1],
			) as DesignProps[];

			setTemplates(sortedDesigns);
		});
	}, []);

	useEffect(() => {
		if (!image) return;

		let newDesigns: DesignProps[] = [];

		templates.forEach((template) => {
			const images = template.objects.filter(
				(obj) => obj.type === "image",
			);
			const smallestImage = images.reduce(
				(prev: ObjectProps | undefined, current: ObjectProps) => {
					if (!prev) return current;
					if (
						(prev?.width ?? 0) * (prev?.height ?? 0) <
						(current.width ?? 0) * (current.height ?? 0)
					)
						return prev;

					return current;
				},
				undefined,
			);

			if (!smallestImage) {
				console.error("No image found in template");
				return;
			}

			const newDesign: DesignProps = {
				...template,
				objects: template.objects.map((obj) => {
					if (obj.id === smallestImage.id) {
						return {
							...obj,
							content: image,
						};
					}

					return obj;
				}),
			};

			newDesigns.push(newDesign);
		});

		setDesigns(newDesigns.sort(() => Math.random() - 0.5));
	}, [image, templates]);

	return (
		<DesignsGrid
			designs={designs.slice(0, maxDesigns || templates.length)}
			products={products}
			onSelect={onSelect}
			canvasClassKey="generated-designs-canvas"
		/>
	);
}
