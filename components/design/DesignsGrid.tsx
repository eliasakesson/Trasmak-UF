import { useEffect } from "react";
import { DesignProps } from "../../utils/design/Interfaces";
import { GetTrayObjFromCanvas } from "../../utils/design/Helper";
import Draw from "../../utils/design/Draw";
import { FaTrash, FaUpload } from "react-icons/fa";

export default function DesignsGrid({
	designs,
	products,
	onSelect,
	canvasClassKey,
	trashClicked,
	uploadClicked,
}: {
	designs: DesignProps[];
	products: any[];
	onSelect: (design: DesignProps) => void;
	canvasClassKey: string;
	trashClicked?: (design: DesignProps) => void;
	uploadClicked?: (design: DesignProps) => void;
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
		}, 10);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	return (
		<ul className="grid grid-cols-3 gap-4">
			{designs.map((design, i) => (
				<li key={i} className="list-none relative">
					<button
						onClick={() => onSelect(design)}
						className="w-full aspect-video bg-gray-100 rounded-xl"
					>
						<canvas
							className={`${canvasClassKey} bg-[#AFC0CE] rounded-xl w-full`}
							width={1280}
							height={720}
						></canvas>
					</button>
					<div className="absolute top-4 right-4 flex flex-col gap-2">
						{trashClicked && (
							<button
								onClick={() => trashClicked(design)}
								className="border-gray-300 text-red-500 border-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
							>
								<FaTrash size={16} />
							</button>
						)}
						{uploadClicked && (
							<button
								onClick={() => uploadClicked(design)}
								className="border-gray-300 text-white border-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
							>
								<FaUpload size={16} />
							</button>
						)}
					</div>
				</li>
			))}
		</ul>
	);
}
