import TemplateDesigns from "@/components/design/TemplateDesigns";
import GetProducts from "@/utils/stripe/getProducts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Product } from "use-shopping-cart/core";
import { SiteContext } from "./_app";

export default function Templates({ products }: { products: Product[] }) {
	const router = useRouter();
	const { setDesign } = useContext(SiteContext);

	return (
		<>
			<Head>
				<title>Våra favoritmallar - Träsmak UF</title>
				<meta
					name="description"
					content="Här hittar du våra favoritmallar, perfekta för att designa din egen bricka eller glasunderlägg ifrån."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-8 py-16">
				<div className="flex flex-col gap-4 text-center">
					<h1 className="text-4xl font-bold text-gray-900">
						Våra favoritmallar
					</h1>
					<p className="max-w-prose text-muted">
						Här hittar du våra favoritmallar. Skapa personliga
						brickor baserat på våra bästa mallar! Välj en mall för
						att komma till designern.
					</p>
				</div>
				<TemplateDesigns
					products={products}
					onSelect={(design) => {
						setDesign(design);
						router.push({
							pathname: "/designer",
						});
					}}
					canvasClassKey="homepage-template-canvas"
					sort={false}
					hideDelete
				/>
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
