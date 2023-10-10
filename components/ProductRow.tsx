import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { formatCurrencyString } from "use-shopping-cart/core";

export default function ProductRow({
	title,
	description,
	products,
	left,
}: {
	title: string;
	description: string;
	products: any;
	left?: boolean;
}) {
	return (
		<div
			className={`flex flex-col ${
				!left ? "items-center" : ""
			} space-y-4 w-full`}>
			{title && <h2 className="text-4xl font-bold">{title}</h2>}
			{description && <p className="text-muted text-lg">{description}</p>}
			<br />
			<div className="w-full grid lg:grid-cols-4 lg:gap-8 grid-cols-2 gap-4">
				{products?.map((product: any) => (
					<ProductCard key={product.id} {...product} />
				))}
			</div>
		</div>
	);
}

function ProductCard({
	id,
	name,
	price,
	image,
	currency,
}: {
	id: string;
	name: string;
	price: number;
	image: string;
	currency: string;
}) {
	return (
		<Link href={`/products/${id.substring(6, id.length)}`}>
			<div className="bg-white rounded-xl overflow-hidden border border-gray-100">
				<div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
					<Image
						className="mix-blend-multiply object-contain"
						src={image}
						alt=""
						fill
						sizes="100%"
						layout="fill"
					/>
				</div>
				<div className="p-4 sm:space-y-2 space-y-1">
					<h3 className="font-medium sm:text-xl text-base">{name}</h3>
					<div className="kc">
						<Rating rating={4} />
						<p className="text-gray-500 sm:text-base text-sm">
							87 Reviews
						</p>
					</div>
					<div className="flex items-center gap-2">
						<p className="text-lg font-semibold">
							{formatCurrencyString({
								value: price,
								currency,
							})}{" "}
							SEK
						</p>
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
