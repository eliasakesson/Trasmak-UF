import ProductRow from "@/components/ProductRow";
import Hero from "@/components/Hero";
import GetProducts from "@/utils/getProducts";
import PersonalSection from "@/components/PersonalSection";
import Head from "next/head";

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
			<main className="relative px-8 py-8 pb-16">
				<div className="max-w-7xl mx-auto sm:space-y-32 space-y-8">
					<Hero />
					<ProductRow
						title="Bästsäljare"
						description="Detta är de brickor som säljs som bäst. Passa på innan de tar
						slut!"
						products={products}
						metadata="best_seller"
						type="common"
					/>
					<PersonalSection />
					<ProductRow
						title="Våra favoritmallar"
						description="Skapa personliga brickor baserat på våra bästa mallar!"
						products={products}
						type="template"
					/>
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
