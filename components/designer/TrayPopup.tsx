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
		<div className="space-y-2 rounded-xl bg-slate-200 p-4">
			<h3 className="text-xl font-semibold">Storlekar</h3>
			<div className="grid grid-cols-[repeat(2,1fr)] gap-2">
				{products.map((product, i) => (
					<button
						onClick={() => selectProduct(product)}
						key={i}
						className="relative flex w-full flex-col rounded-lg bg-white p-2 text-2xl lg:flex-row lg:gap-4"
					>
						<div className="relative aspect-square h-12 lg:h-16">
							<Image src={product.image} alt="" fill />
						</div>
						<p className="w-[15ch] py-2 text-left text-base lg:w-[20ch]">
							{product.name}
						</p>
						<span className="bottom-2 right-2 text-base text-muted lg:absolute">
							{formatCurrencyString({
								value: product.price,
								currency: product.currency,
							})}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}