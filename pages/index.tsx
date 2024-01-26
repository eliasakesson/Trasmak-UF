import ProductRow from "@/components/ProductRow";
import Hero from "@/components/Hero";
import GetProducts from "@/utils/getProducts";
import Section1 from "@/components/Section1";
import Section2 from "@/components/Section2";
import Head from "next/head";
import Inspiration from "@/components/Inspiration";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWindowSize } from "@/utils/hooks";
import { FaArrowRight } from "react-icons/fa";
import { logEvent } from "firebase/analytics";
import { useAnalytics } from "@/firebase";
import { useContext, useEffect } from "react";
import { SiteContext } from "./_app";
import About from "@/components/About";

export default function Home({ products }: { products: any }) {
	const router = useRouter();
	const { analytics } = useAnalytics();
	const { width } = useWindowSize();
	const { setDesign } = useContext(SiteContext);

	useEffect(() => {
		analytics && logEvent(analytics, "homepage_view");
	}, []);

	return (
		<>
			<Head>
				<title>Designa & Beställ din träbricka - Träsmak UF</title>
				<meta
					name="description"
					content="Designa din egen träbricka eller glasunderlägg med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="relative pb-16 overflow-hidden">
				<article className="flex flex-col lg:gap-32 gap-16">
					<Hero />
					{/* <About /> */}
					<div className="flex lg:flex-col flex-col-reverse lg:gap-32 gap-16">
						<Section2 />
						<Section1 />
					</div>
					<div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
						<ProductRow
							title="Bästsäljare"
							description="Detta är de brickor som säljs som bäst. Passa på innan de tar
							slut!"
							products={products}
							rows={width >= 1024 ? 1 : 2}
						/>
						<Link
							href="/products"
							className="flex items-center gap-2 font-semibold text-xl text-primary_light">
							Se fler produkter
							<FaArrowRight />
						</Link>
					</div>
					<div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
						<ProductRow
							title="Våra favoritmallar"
							description="Skapa personliga brickor baserat på våra bästa mallar!"
							products={products}
							type="template"
						/>
						<TemplateDesigns
							products={products}
							onSelect={(design) => {
								setDesign(design);
								router.push({
									pathname: "/design",
								});
							}}
							canvasClassKey="homepage-template-canvas"
							maxDesigns={width >= 768 ? 6 : 3}
							sort={false}
							hideDelete
						/>
						<Link
							href="/templates"
							className="flex items-center gap-2 font-semibold text-xl text-primary_light">
							Se fler mallar
							<FaArrowRight />
						</Link>
					</div>
					<div className="max-w-7xl mx-auto px-4 w-full">
						<Inspiration />
					</div>
				</article>
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
