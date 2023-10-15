import Breadcrumbs from "@/components/Breadcrumbs";
import ProductRow from "@/components/ProductRow";
import { stripe } from "@/utils/stripe";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaStar, FaHeart, FaCreditCard } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdDiscount, MdLocalShipping } from "react-icons/md";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

export default function Product({
	product,
	products,
}: {
	product: any;
	products: any;
}) {
	return (
		<div className="max-w-7xl mx-auto px-8 py-16 space-y-8">
			<Breadcrumbs productName={product.name} />
			<div className="grid grid-cols-2 grid-rows-2 gap-16">
				<Images image={product.image} />
				<ProductInfo product={product} />
				<div className="col-span-1">{product.description}</div>
			</div>
			<ProductRow
				title="Liknande produkter"
				description=""
				products={products}
				left
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
					className="object-contain mix-blend-multiply"
					fill
					sizes="100%"
				/>
			</div>
		</div>
	);
}

function ProductInfo({ product }: { product: any }) {
	const { addItem } = useShoppingCart();

	return (
		<div className="row-span-2 row-end-2 space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-semibold">{product.name}</h1>
				<div className="flex items-center gap-4">
					<Stars rating={4} />
					<p className="text-muted">157 Reviews</p>
				</div>
			</div>

			<div className="space-y-2">
				<p className="text-4xl font-semibold">
					{formatCurrencyString({
						value: product.price,
						currency: product.currency,
					})}
				</p>
				<div className="flex gap-2 items-center text-muted">
					<MdDiscount />
					Köp 3 få 1 gratis
				</div>
			</div>
			<div className="flex gap-4">
				<button
					onClick={() => {
						addItem(product);
						toast.success(`${product.name} tillagd i varukorgen`);
					}}
					type="button"
					className="bg-primary hover:bg-primary_light transition-colors text-white px-12 py-4 rounded-lg font-semibold">
					Lägg i varukorgen
				</button>
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

function Stars({ rating }: { rating: number }) {
	return (
		<div className="flex gap-1">
			{[...Array(5)].map((_, index) => (
				<FaStar
					key={index}
					className={`${
						rating > index ? "text-yellow-500" : "text-gray-400"
					} text-xl`}
				/>
			))}
		</div>
	);
}

export async function getStaticProps({ params }: { params: { id: string } }) {
	const inventory = await stripe.prices.list({
		expand: ["data.product"],
	});

	const inventoryProduct: any = inventory.data.find(
		(item) => item.id === "price_" + params.id
	);

	const product = {
		id: inventoryProduct.id,
		name: inventoryProduct.product.name,
		price: inventoryProduct.unit_amount,
		currency: inventoryProduct.currency,
		image: inventoryProduct.product.images[0],
		description: inventoryProduct.product.description,
	};

	const products = inventory.data
		.map((product: any) => ({
			id: product.id,
			price: product.unit_amount,
			currency: product.currency,
			name: product.product.name,
			image: product.product.images[0],
		}))
		.sort(() => Math.random() - 0.5);

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
