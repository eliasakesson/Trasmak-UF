import Breadcrumbs from "@/components/Breadcrumbs";
import ProductRow from "@/components/ProductRow";
import Stars from "@/components/Rating";
import GetProducts, { GetProduct } from "@/utils/stripe/getProducts";
import { useWindowSize } from "@/utils/hooks";
import { stripe } from "@/utils/stripe/stripe";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaCreditCard } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { formatCurrencyString } from "use-shopping-cart";
import { SiteContext } from "../_app";
import { DesignProps } from "@/utils/designer/Interfaces";

export default function Product({
	product,
	products,
}: {
	product: any;
	products: any;
}) {
	const { width } = useWindowSize();

	return (
		<>
			<Head>
				<title>{product.name} - Träsmak UF</title>
				<meta
					name="description"
					content="Designa din egen träbricka eller glasunderlägg med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="mx-auto max-w-7xl space-y-4 px-8 py-4 lg:py-8">
				<div className="hidden lg:block">
					<Breadcrumbs productName={product.name} />
				</div>
				<article className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 lg:gap-16">
					<Images image={product.image} />
					<ProductInfo product={product} />
				</article>
				<MoreInfo product={product} />
				<ProductRow
					title="Liknande produkter"
					products={products}
					left
					type={product.metadata.type}
					ignore={product.id}
					rows={width >= 768 ? 1 : 2}
				/>
			</main>
		</>
	);
}

function Images({ image }: { image: string }) {
	return (
		<div className="row-end-1 flex h-fit gap-8">
			<div className="relative -z-10 aspect-square flex-1 overflow-hidden rounded-xl bg-gray-100">
				<Image
					src={image}
					alt="Product"
					className="object-contain mix-blend-multiply hue-rotate-[50deg] saturate-150"
					fill
					sizes="100%"
				/>
			</div>
		</div>
	);
}

function ProductInfo({ product }: { product: any }) {
	const { design, setDesign } = useContext(SiteContext);

	return (
		<div className="space-y-4 lg:space-y-8">
			<div className="flex justify-between gap-2 lg:flex-col">
				<h1 className="text-xl font-semibold lg:text-4xl">
					{product.name}
				</h1>
				<div className="flex items-center gap-4">
					<Stars productID={product.id} />
				</div>
			</div>
			<p className="w-fit bg-primary p-2 text-xl font-semibold text-white lg:text-4xl">
				{formatCurrencyString({
					value: product.price,
					currency: product.currency,
				})}
			</p>
			<ul className="space-y-2 py-4 text-muted lg:py-0">
				<li className="flex items-center gap-4">
					<MdLocalShipping />
					Gratis frakt över{" "}
					{formatCurrencyString({
						value: 59900,
						currency: product.currency,
					})}{" "}
					(Sverige)
				</li>

				<li className="flex items-center gap-4">
					<FaCreditCard />
					100% säker betalning
				</li>

				<li className="flex items-center gap-4">
					<FaEarthAmericas />
					Tillverkad i Sverige
				</li>
			</ul>
			<div className="flex gap-4">
				<Link
					onClick={() =>
						setDesign({
							...design,
							objects: [],
							id: product.id.substring(6, product.id.length),
						} as DesignProps)
					}
					href={`/designer`}
					className="w-full rounded-lg bg-primary px-12 py-4 font-semibold text-white transition-colors hover:bg-primary_light"
				>
					Designa nu
				</Link>
			</div>
			<br />
			<p className="max-w-prose text-base text-muted lg:text-lg">
				{product.description ?? ""} Brickan är perfekt för dig som vill
				servera fika eller mat. Med designverktyget kan du sätta en
				personlig prägel på brickan och det är din fantasi som sätter
				gränserna.
				<br />
				<br />
				Designa brickor med egna motiv som matchar din stil och gör
				varje måltid till en personlig upplevelse. Brickan passar till
				både vardagliga måltider och speciella tillfällen. Brickan är
				tillverkad av högkvalitativt material för att garantera
				hållbarhet och långvarig användning.
			</p>
		</div>
	);
}

function MoreInfo({ product }: { product: any }) {
	return (
		<div className="col-span-2 grid gap-4 py-8 md:gap-8 lg:grid-cols-2 lg:gap-16">
			<div className="space-y-4">
				<h2 className="text-2xl font-semibold">Beskrivning</h2>
				<p className="text-muted">
					Brickan är tillverkad av björkfanér som är belagd med en
					lack som gör att den blir slitstark och mycket tålig i ytan.
					Kompressionen av brickan gör den vattenresistent och kan
					således användas i diskmaskinen utan problem. Ytan är
					dessutom godkänd för livsmedel. Den färdiga brickan är
					dessutom FSC®-certifierad och därmed miljögodkänd. Man bör
					inte låta brickan ligga utomhus i solen under flera dagar då
					solen bleker ut färgerna.
				</p>
			</div>
			<div className="space-y-4">
				<h2 className="text-2xl font-semibold">Vikt och mått</h2>
				<table className="text-muted">
					<tbody>
						<tr>
							<td className="pr-4 font-semibold">Vikt</td>
							<td>{product?.metadata?.weight} g</td>
						</tr>
						<tr>
							<td className="font-semibold">Mått</td>
							<td>
								{product?.metadata?.width} x{" "}
								{product?.metadata?.height} cm
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export async function getStaticProps({ params }: { params: { id: string } }) {
	const product = await GetProduct("price_" + params.id);
	const products = await GetProducts(true);

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
