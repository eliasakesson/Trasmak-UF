import Image from "next/image";
import { Inter } from "next/font/google";
import { checkout } from "../checkout";
import { stripe } from "../utils/stripe";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import { toast } from "react-hot-toast";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ products }: { products: any }) {
	const { addItem } = useShoppingCart();

	function onAddToCart(product: any) {
		const id = toast.loading("Adding 1 item...");
		addItem(product);
		toast.success(`${product.name} added`, { id });
	}

	return (
		<main className="flex flex-col items-center min-h-screen py-16">
			<h1 className="text-4xl font-bold mb-16">Produkter</h1>
			<div className="flex items-center gap-8">
				{products.map((product: any) => (
					<Link
						href={`/products/${product.id.slice(
							6,
							product.id.length
						)}`}
						key={product.id}>
						<div className="space-y-2">
							<div className="relative h-48 aspect-[4/3]">
								<Image
									src={product.image}
									alt={product.name}
									fill
									sizes="100%"
									className="object-contain -z-10 mix-blend-multiply"
								/>
							</div>
							<h3>{product.name}</h3>
							<p>{product.description}</p>
							<span>
								{formatCurrencyString({
									value: product.price,
									currency: product.currency,
								})}
							</span>
							<button
								onClick={() => onAddToCart(product)}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								Lägg till i varukorg
							</button>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}

export async function getStaticProps() {
	const inventory = await stripe.prices.list({
		expand: ["data.product"],
		limit: 8,
	});

	const products = inventory.data.map((product: any) => ({
		id: product.id,
		price: product.unit_amount,
		currency: product.currency,
		name: product.product.name,
		description: product.product.description,
		image: product.product.images[0],
	}));

	return {
		props: {
			products,
		},
	};
}
