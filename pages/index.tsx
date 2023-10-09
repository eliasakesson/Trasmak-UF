import { checkout } from "../checkout";
import { stripe } from "../utils/stripe";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ProductRow from "@/components/ProductRow";

export default function Home({ products }: { products: any }) {
	const { addItem } = useShoppingCart();

	function onAddToCart(product: any) {
		const id = toast.loading("Adding 1 item...");
		addItem(product);
		toast.success(`${product.name} added`, { id });
	}

	return (
		<main className="flex flex-col items-center min-h-screen py-16">
			<ProductRow title="Bästsäljare" products={products} />
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
