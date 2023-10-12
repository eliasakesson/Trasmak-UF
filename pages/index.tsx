import { checkout } from "../checkout";
import { stripe } from "../utils/stripe";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ProductRow from "@/components/ProductRow";
import Hero from "@/components/Hero";

export default function Home({ products }: { products: any }) {
	return (
		<main className="max-w-7xl mx-auto px-8 sm:space-y-32 space-y-8 pb-16">
			<Hero />
			<ProductRow
				title="Bästsäljare"
				description="Detta är de brickor som säljs som bäst. Passa på innan de tar
				slut!"
				products={products}
			/>
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
		metadata: product.product.metadata,
	}));

	products.sort((a, b) => {
		return Math.random() - 0.5;
	});

	return {
		props: {
			products,
		},
	};
}
