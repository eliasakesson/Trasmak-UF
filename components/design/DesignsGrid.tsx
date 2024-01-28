import { useEffect } from "react";
import { DesignProps } from "../../utils/design/Interfaces";
import { GetTrayObjFromCanvas } from "../../utils/design/Helper";
import Draw from "../../utils/design/Draw";
import { FaTrash, FaUpload } from "react-icons/fa";
import Image from "next/image";

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
						designs[i]?.id,
				);
				if (!product) return;

				const tray = GetTrayObjFromCanvas(
					canvas as HTMLCanvasElement,
					0.85,
					product.metadata?.width,
					product.metadata?.height,
					product.metadata?.radius,
					product.metadata?.bleed,
					product.metadata?.edge,
				);
				Draw(canvas as HTMLCanvasElement, tray, designs[i]);
			});
		}, 10);

		return () => {
			clearTimeout(timer);
		};
	}, [designs]);

	return (
		<ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
			{designs.map((design, i) => (
				<li key={i} className="relative list-none">
					<button
						aria-label={`Select design ${design.id}`}
						onClick={() => onSelect(design)}
						className="aspect-video w-full rounded-xl bg-gray-100"
					>
						<canvas
							className={`${canvasClassKey} w-full rounded-xl bg-[#AFC0CE]`}
							width={1280}
							height={720}
						></canvas>
					</button>
					<div className="absolute right-4 top-4 flex flex-col gap-2">
						{trashClicked && (
							<button
								aria-label={`Delete design ${design.id}`}
								onClick={() => trashClicked(design)}
								className="rounded-md border-2 border-gray-300 p-2 text-red-500 transition-colors hover:bg-gray-200"
							>
								<FaTrash size={16} />
							</button>
						)}
						{uploadClicked && (
							<button
								aria-label={`Upload design ${design.id}`}
								onClick={() => uploadClicked(design)}
								className="rounded-md border-2 border-gray-300 p-2 text-white transition-colors hover:bg-gray-200"
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
