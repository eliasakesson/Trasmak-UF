import { useEffect } from "react";
import designs from "@/data/designs.json";
import { Draw, GetTrayObjFromCanvas } from "@/pages/design";
import Link from "next/link";

export default function TemplateRow({ products }: { products: any[] }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			const canvases = document.querySelectorAll(".minicanvas");
			canvases.forEach((canvas, i) => {
				const product = products.find(
					(product) =>
						product.id.substring(6, product.id.length) ===
						designs[i].id
				);
				if (!product) return;

				const tray = GetTrayObjFromCanvas(
					canvas as HTMLCanvasElement,
					0.85,
					product.metadata?.width,
					product.metadata?.height,
					product.metadata?.radius,
					product.metadata?.bleed,
					product.metadata?.edge
				);
				Draw(canvas as HTMLCanvasElement, tray, designs[i]);
			});
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	return (
		<div className="w-full grid lg:grid-cols-3 lg:gap-8 grid-cols-2 gap-4 text-left">
			{designs.map((design, i) => (
				<li key={i} className="list-none">
					<Link
						href={`/design?d=${design.id}&i=${i}`}
						className="w-full aspect-video bg-gray-100 rounded-xl"
					>
						<canvas
							className="minicanvas bg-gray-100 rounded-xl w-full"
							width={1280}
							height={720}
						></canvas>
					</Link>
				</li>
			))}
		</div>
	);
}
