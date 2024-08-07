import ProductRow from "@/components/ProductRow";
import Hero from "@/components/homepage/Hero";
import GetProducts from "@/utils/stripe/getProducts";
import Section1 from "@/components/homepage/Section1";
import Head from "next/head";
import Inspiration from "@/components/homepage/Inspiration";
import TemplateDesigns from "@/components/design/TemplateDesigns";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWindowSize } from "@/utils/hooks";
import { FaArrowRight } from "react-icons/fa";
import { useContext } from "react";
import { SiteContext } from "./_app";
import About from "@/components/homepage/About";
import HowToDesign from "@/components/homepage/HowToDesign";
import TellYourStory from "@/components/homepage/TellYourStory";
import Popup from "./popup";

export default function Home({ products }: { products: any }) {
	const router = useRouter();
	const { width } = useWindowSize();
	const { setDesign } = useContext(SiteContext);

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
			<main className="relative overflow-hidden pb-16">
				<article className="flex flex-col gap-16 lg:gap-32">
				<Popup />
					<Hero />
					<TellYourStory />
					<About />
					<HowToDesign />
					<div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4">
						<ProductRow
							title="Bästsäljare"
							description="Detta är de brickor som säljs som bäst. Passa på innan de tar
							slut!"
							products={products}
							rows={width >= 1024 ? 1 : 2}
						/>
						<Link
							href="/products"
							className="flex items-center gap-2 text-xl font-semibold text-primary_light"
						>
							Se fler produkter
							<FaArrowRight />
						</Link>
					</div>
					<Section1 />
					<div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4">
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
									pathname: "/designer",
								});
							}}
							canvasClassKey="homepage-template-canvas"
							maxDesigns={width >= 768 ? 6 : 3}
							sort={false}
							hideDelete
						/>
						<Link
							href="/templates"
							className="flex items-center gap-2 text-xl font-semibold text-primary_light"
						>
							Se fler mallar
							<FaArrowRight />
						</Link>
					</div>
					<div className="mx-auto w-full max-w-7xl px-4">
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
