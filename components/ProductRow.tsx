import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { formatCurrencyString } from "use-shopping-cart";

export default function ProductRow({
	title,
	description,
	products,
	rows = 1,
	left,
	metadata,
	type,
	ignore,
}: {
	title: string;
	description: string;
	products: any;
	rows?: number;
	left?: boolean;
	metadata?: string;
	type?: string;
	ignore?: string;
}) {
	return (
		<section
			className={`flex flex-col ${
				!left ? "items-center text-center" : ""
			} space-y-4 w-full`}>
			{title && <h2 className="text-4xl font-bold">{title}</h2>}
			{description && (
				<p className="text-muted text-lg max-w-[calc(100%-16px)]">
					{description}
				</p>
			)}
			<br />
			<div className="w-full grid lg:grid-cols-3 lg:gap-8 grid-cols-2 gap-4 text-left">
				{products
					?.filter(
						(product: any) =>
							product.id !== ignore &&
							(!type || product?.metadata["type"] === type) &&
							(!metadata ||
								product?.metadata[metadata] === "true")
					)
					.slice(
						0,
						document.body.clientWidth < 1024 ? rows * 2 : rows * 3
					)
					.map((product: any) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							price={product.price}
							image={product.image}
							currency={product.currency}
							type={product?.metadata["type"]}
						/>
					))}
			</div>
		</section>
	);
}

export function ProductCard({
	id,
	name,
	price,
	image,
	currency,
	type,
}: {
	id: string;
	name: string;
	price: number;
	image: string;
	currency: string;
	type: string;
}) {
	return (
		<Link href={`/design?d=${id.substring(6, id.length)}`}>
			<div className="h-full">
				<div className="relative aspect-square">
					<div className="w-full h-full">
						<Image
							className="object-contain w-full h-full hue-rotate-[50deg] saturate-150"
							src={image}
							alt=""
							width={500}
							height={400}
						/>
					</div>
				</div>
				<div className="py-4 sm:space-y-2 space-y-1">
					<h3 className="font-medium sm:text-xl text-base">{name}</h3>
					<div className="flex justify-between sm:items-end sm:flex-row flex-col gap-4">
						<div className="flex items-center gap-2">
							<p className="text-xl font-semibold">
								{formatCurrencyString({
									value: price,
									currency,
								})}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

function Rating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center">
			{Array.from(Array(5)).map((_, i) => (
				<FaStar
					key={i}
					className={i < rating ? "text-yellow-500" : "text-muted"}
				/>
			))}
		</div>
	);
}
