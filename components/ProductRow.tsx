import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import toast from "react-hot-toast";

export default function ProductRow({
	title,
	description,
	products,
	left,
	metadata,
}: {
	title: string;
	description: string;
	products: any;
	left?: boolean;
	metadata?: string;
}) {
	return (
		<section
			className={`flex flex-col ${
				!left ? "items-center" : ""
			} space-y-4 w-full`}>
			{title && <h2 className="text-4xl font-bold">{title}</h2>}
			{description && <p className="text-muted text-lg">{description}</p>}
			<br />
			<div className="w-full grid lg:grid-cols-3 lg:gap-8 grid-cols-2 gap-4">
				{products
					?.filter(
						(product: any) =>
							!metadata || product?.metadata[metadata] === "true"
					)
					.slice(0, document.body.clientWidth < 1024 ? 2 : 3)
					.map((product: any) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							price={product.price}
							image={product.image}
							currency={product.currency}
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
}: {
	id: string;
	name: string;
	price: number;
	image: string;
	currency: string;
}) {
	const { addItem } = useShoppingCart();

	return (
		<Link href={`/products/${id.substring(6, id.length)}`}>
			<div className="bg-white rounded-xl overflow-hidden border border-gray-100">
				<div className="relative overflow-hidden bg-gray-100 aspect-[4/3] p-4">
					<div className="w-full h-full">
						<Image
							className="mix-blend-multiply object-contain w-full h-full"
							src={image}
							alt=""
							width={500}
							height={400}
						/>
					</div>
				</div>
				<div className="p-4 sm:space-y-2 space-y-1">
					<h3 className="font-medium sm:text-xl text-base">{name}</h3>
					<div className="flex justify-between sm:items-end sm:flex-row flex-col gap-2">
						<div className="space-y-2">
							<div className="kc">
								<Rating rating={4} />
								<p className="text-gray-500 sm:text-base text-sm">
									87 Reviews
								</p>
							</div>
							<div className="flex items-center gap-2">
								<p className="text-xl font-semibold">
									{formatCurrencyString({
										value: price,
										currency,
									})}
								</p>
							</div>
						</div>
						<button
							className="bg-primary text-white sm:p-4 p-2 sm:rounded-lg rounded-md"
							onClick={(e) => {
								e.preventDefault();
								addItem({ id, name, price, image, currency });
								toast.success(`${name} tillagd i varukorgen`);
							}}>
							<FaPlus className="mx-auto" />
						</button>
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
