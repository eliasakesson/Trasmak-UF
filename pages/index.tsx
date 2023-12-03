import ProductRow from "@/components/ProductRow";
import Hero from "@/components/Hero";
import GetProducts from "@/utils/getProducts";
import Section1 from "@/components/Section1";
import Section2 from "@/components/Section2";
import Head from "next/head";
import Inspiration from "@/components/Inspiration";

export default function Home({ products }: { products: any }) {
	return (
		<>
			<Head>
				<title>Träsmak UF</title>
				<meta
					name="description"
					content="Skapa en personlig bricka med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
			</Head>
			<main className="relative pb-16">
				<div className="flex flex-col gap-32">
					<Hero />
					<div className="max-w-7xl mx-auto px-8">
						<ProductRow
							title="Bästsäljare"
							description="Detta är de brickor som säljs som bäst. Passa på innan de tar
							slut!"
							products={products}
							rows={2}
						/>
					</div>
					<Section1 />
					<ProductRow
						title="Våra favoritmallar"
						description="Skapa personliga brickor baserat på våra bästa mallar!"
						products={products}
						type="template"
					/>
					<Section2 />
					<div className="max-w-7xl mx-auto px-8">
						<Inspiration />
					</div>
				</div>
			</main>
		</>
	);
}

export async function getStaticProps() {
	const products = await GetProducts(true);

	return {
		props: {
			products,
		},
	};
}
