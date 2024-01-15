import TemplateDesigns from "@/components/design/TemplateDesigns";
import GetProducts from "@/utils/getProducts";
import Head from "next/head";
import { useRouter } from "next/router";
import { Product } from "use-shopping-cart/core";

export default function Templates({ products }: { products: Product[] }) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Våra favoritmallar - Träsmak UF</title>
				<meta
					name="description"
					content="Här hittar du våra favoritmallar, perfekta för att designa din egen bricka eller glasunderlägg ifrån."
				/>
			</Head>
			<main className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-16 py-16">
				<div className="text-center flex flex-col gap-4">
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
					onSelect={(design) =>
						router.push({
							pathname: "/design",
							query: { d: JSON.stringify(design) },
						})
					}
					canvasClassKey="homepage-template-canvas"
					maxDesigns={6}
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
