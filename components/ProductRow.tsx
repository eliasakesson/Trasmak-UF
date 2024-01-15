import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { formatCurrencyString } from "use-shopping-cart";
import { useWindowSize } from "@/utils/hooks";
import { useRouter } from "next/router";
import Stars from "./Stars";

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
			} space-y-4 w-full`}>
			{title && (
				<h2 className="lg:text-4xl md:text-3xl text-2xl font-semibold">
					{title}
				</h2>
			)}
			{description && (
				<p className="text-muted text-lg max-w-[calc(100%-16px)]">
					{description}
				</p>
			)}
			<span className="md:h-4 h-0"></span>
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
	const router = useRouter();
	const { width } = useWindowSize();

	return (
		<Link
			href={`/${
				width < 768 || toProductPage ? "products/" : "design?d="
			}${id.substring(6, id.length)}`}>
			<div className="h-full flex flex-col">
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
				<div className="flex-1 flex flex-col justify-between py-4 sm:space-y-2 space-y-1">
					<div className="flex flex-wrap justify-between items-center">
						{h2 ? (
							<h2 className="font-medium sm:text-xl text-base">
								{name}
							</h2>
						) : (
							<h3 className="font-medium sm:text-xl text-base">
								{name}
							</h3>
						)}
						<Stars rating={5} amount={3} small />
					</div>
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
