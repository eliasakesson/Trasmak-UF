import Breadcrumbs from "@/components/Breadcrumbs";
import ProductRow from "@/components/ProductRow";
import Stars from "@/components/Stars";
import GetProducts, { GetProduct } from "@/utils/getProducts";
import { useWindowSize } from "@/utils/hooks";
import { stripe } from "@/utils/stripe";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaCreditCard } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

export default function Product({
	product,
	products,
}: {
	product: any;
	products: any;
}) {
	const { width } = useWindowSize();

	return (
		<div className="max-w-7xl mx-auto px-8 py-8 space-y-4">
			<Breadcrumbs productName={product.name} />
			<div className="grid md:grid-cols-2 md:grid-rows-2 lg:gap-16 md:gap-8 gap-4">
				<Images image={product.image} />
				<ProductInfo product={product} />
			</div>
			<ProductRow
				title="Liknande produkter"
				products={products}
				left
				type={product.metadata.type}
				ignore={product.id}
				rows={width >= 768 ? 1 : 2}
				toProductPage
			/>
		</div>
	);
}

function Images({ image }: { image: string }) {
	return (
		<div className="row-end-1 flex gap-8">
			<div className="relative -z-10 aspect-square bg-gray-100 flex-1 rounded-xl overflow-hidden">
				<Image
					src={image}
					alt="Product"
					className="object-contain mix-blend-multiply hue-rotate-[50deg] saturate-150"
					fill
					sizes="100%"
				/>
			</div>
		</div>
	);
}

function ProductInfo({ product }: { product: any }) {
	const { addItem } = useShoppingCart();

	const { width } = useWindowSize();

	return (
		<div className="md:row-span-2 row-end-2 space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-semibold">{product.name}</h1>
				<div className="flex items-center gap-4">
					<Stars rating={5} amount={3} />
				</div>
			</div>
			<p className="text-muted lg:text-lg text-base max-w-prose">
				{product.description}
			</p>
			<div className="space-y-2">
				<p className="text-4xl font-semibold">
					{formatCurrencyString({
						value: product.price,
						currency: product.currency,
					})}
				</p>
			</div>
			<div className="flex gap-4">
				{width >= 768 ? (
					<Link
						href={`/design?d=${product.id.substring(
							6,
							product.id.length
						)}`}
						className="bg-primary hover:bg-primary_light transition-colors text-white px-12 py-4 rounded-lg font-semibold"
					>
						Designa nu
					</Link>
				) : (
					<button
						onClick={() =>
							toast.error(
								"Designern fungerar bäst på större skärmar. Vänligen byt enhet för att börja designa."
							)
						}
						type="button"
						className="bg-primary hover:bg-primary_light transition-colors text-white px-12 py-4 rounded-lg font-semibold"
					>
						Designa nu
					</button>
				)}
			</div>

			<ul className="space-y-2 text-muted">
				<li className="flex gap-4 items-center">
					<MdLocalShipping />
					Gratis frakt över 500 kr (Sverige)
				</li>

				<li className="flex gap-4 items-center">
					<FaCreditCard />
					100% säker betalning
				</li>

				<li className="flex gap-4 items-center">
					<FaEarthAmericas />
					Tillverkad i Sverige
				</li>
			</ul>
		</div>
	);
}

export async function getStaticProps({ params }: { params: { id: string } }) {
	const product = await GetProduct("price_" + params.id);
	const products = await GetProducts(true);

	return {
		props: {
			product,
			products,
		},
		revalidate: 3600,
	};
}

export async function getStaticPaths() {
	const inventory = await stripe.prices.list({
		expand: ["data.product"],
	});

	const paths = inventory.data.map((product: any) => ({
		params: {
			id: product.id.slice(6, product.id.length),
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
}
