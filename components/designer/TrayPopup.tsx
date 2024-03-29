import { DesignerContext } from "@/pages/designer";
import Image from "next/image";
import { useContext } from "react";
import { formatCurrencyString } from "use-shopping-cart/core";

export default function TrayPopup() {
	const { products, currentDesign, setCurrentDesign } =
		useContext(DesignerContext);

	function selectProduct(product: any) {
		setCurrentDesign({
			...currentDesign,
			id: product.id.substring(6, product.id.length),
		});
	}

	return (
		<div className="space-y-2 rounded-xl bg-slate-300 p-2">
			<div className="grid grid-cols-[repeat(2,1fr)] divide-x divide-y overflow-hidden rounded-lg">
				{products.map((product, i) => (
					<button
						onClick={() => selectProduct(product)}
						key={i}
						className="relative flex w-full flex-col items-center bg-white p-2 text-2xl lg:flex-row lg:gap-4"
					>
						<div className="relative aspect-square h-12 lg:h-16">
							<Image src={product.image} alt="" fill />
						</div>
						<div className="flex flex-col -space-y-2 lg:space-y-0">
							<p className="w-[15ch] py-2 text-sm lg:w-[20ch] lg:text-left lg:text-base">
								{product.name}
							</p>
							<span className="text-center text-xs text-muted lg:text-left lg:text-base">
								{formatCurrencyString({
									value: product.price,
									currency: product.currency,
								})}
							</span>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
