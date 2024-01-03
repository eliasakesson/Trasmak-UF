import { useEffect } from "react";
import { DesignProps } from "./Interfaces";
import { GetTrayObjFromCanvas } from "./Helper";
import Draw from "./Draw";

export default function DesignsGrid({
	designs,
	products,
	onSelect,
	canvasClassKey,
}: {
	designs: DesignProps[];
	products: any[];
	onSelect: (design: DesignProps) => void;
	canvasClassKey: string;
}) {
	useEffect(() => {
		const timer = setTimeout(() => {
			const canvases = document.querySelectorAll(`.${canvasClassKey}`);
			canvases.forEach((canvas, i) => {
				const product = products.find(
					(product) =>
						product.id.substring(6, product.id.length) ===
						designs[i]?.id
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
		<ul className="grid grid-cols-3 gap-4" id="templates">
			{designs.map((design, i) => (
				<li key={i} className="list-none">
					<button
						onClick={() => onSelect(design)}
						className="w-full aspect-video bg-gray-100 rounded-xl">
						<canvas
							className={`${canvasClassKey} bg-gray-100 rounded-xl w-full`}
							width={1280}
							height={720}></canvas>
					</button>
				</li>
			))}
		</ul>
	);
}
