import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { formatCurrencyString } from "use-shopping-cart";
import { useWindowSize } from "@/utils/hooks";
import { useRouter } from "next/router";
import Stars from "./Rating";

export default function ProductRow({
	title,
	description,
	products,
	rows = 1,
	left,
	metadata,
	type,
	ignore,
	toProductPage,
	h2,
}: {
	title: string;
	description?: string;
	products: any;
	rows?: number;
	left?: boolean;
	metadata?: string;
	type?: string;
	ignore?: string;
	toProductPage?: boolean;
	h2?: boolean;
}) {
	return (
		<section
			className={`flex flex-col ${
				!left ? "items-center text-center" : ""
			} w-full space-y-4`}
		>
			{title && (
				<h2 className="text-3xl font-bold lg:text-4xl">{title}</h2>
			)}
			{description && (
				<p className="max-w-[calc(100%-16px)] text-lg text-muted">
					{description}
				</p>
			)}
			<span className="h-0 md:h-4"></span>
			<div className="grid w-full grid-cols-2 gap-4 text-left lg:grid-cols-3 lg:gap-8">
				{products
					?.filter(
						(product: any) =>
							product.id !== ignore &&
							(!type || product?.metadata["type"] === type) &&
							(!metadata ||
								product?.metadata[metadata] === "true"),
					)
					.slice(
						0,
						document.body.clientWidth < 1024 ? rows * 2 : rows * 3,
					)
					.map((product: any) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							price={product.price}
							image={product.image}
							currency={product.currency}
							toProductPage={toProductPage}
							h2={h2}
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
	toProductPage,
	h2,
}: {
	id: string;
	name: string;
	price: number;
	image: string;
	currency: string;
	toProductPage?: boolean;
	h2?: boolean;
}) {
	const { width } = useWindowSize();

	return (
		<Link
			href={`/${
				width < 768 || toProductPage ? "products/" : "design?d="
			}${id.substring(6, id.length)}`}
		>
			<div className="flex h-full flex-col">
				<div className="relative aspect-square">
					<div className="h-full w-full">
						<Image
							className="h-full w-full object-contain hue-rotate-[50deg] saturate-150"
							src={image}
							alt=""
							width={500}
							height={400}
						/>
					</div>
				</div>
				<div className="flex flex-1 flex-col justify-between space-y-1 py-4 sm:space-y-2">
					<div className="flex flex-wrap items-center justify-between">
						{h2 ? (
							<h2 className="text-base font-medium sm:text-xl">
								{name}
							</h2>
						) : (
							<h3 className="text-base font-medium sm:text-xl">
								{name}
							</h3>
						)}
						<Stars productID={id} size="sm" />
					</div>
					<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
