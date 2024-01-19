import Breadcrumbs from "@/components/Breadcrumbs";
import ProductRow from "@/components/ProductRow";
import Stars from "@/components/Stars";
import GetProducts, { GetProduct } from "@/utils/getProducts";
import { useWindowSize } from "@/utils/hooks";
import { stripe } from "@/utils/stripe";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaCreditCard } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdLocalShipping } from "react-icons/md";
import { formatCurrencyString } from "use-shopping-cart";

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
			<main className="max-w-7xl mx-auto px-8 py-8 space-y-4">
				<Breadcrumbs productName={product.name} />
				<article className="grid lg:grid-cols-2 grid-cols-1 lg:gap-16 md:gap-8 gap-4">
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
					toProductPage
				/>
			</main>
		</>
	);
}

function Images({ image }: { image: string }) {
	return (
		<div className="row-end-1 flex gap-8">
			<div className="relative -z-10 aspect-square bg-gray-100 flex-1 rounded-xl overflow-hidden">
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
	const { width } = useWindowSize();

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-semibold">{product.name}</h1>
				<div className="flex items-center gap-4">
					<Stars productID={product.id} />
				</div>
			</div>
			<p className="text-muted lg:text-lg text-base max-w-prose">
				{product.description ?? ""} Brickan är perfekt för dig som vill
				servera fika eller mat. Med designverktyget kan du sätta en
				personlig prägel på brickan och det är din fantasi som sätter
				gränserna. Designa brickor med egna motiv som matchar din stil
				och gör varje måltid till en personlig upplevelse. Brickan
				passar till både vardagliga måltider och speciella tillfällen.
				Brickan är tillverkad av högkvalitativt material för att
				garantera hållbarhet och långvarig användning.
			</p>
			<p className="text-4xl font-semibold">
				{formatCurrencyString({
					value: product.price,
					currency: product.currency,
				})}
			</p>
			<div className="flex gap-4">
				{width >= 768 ? (
					<Link
						href={`/design?d=${product.id.substring(
							6,
							product.id.length
						)}`}
						className="bg-primary hover:bg-primary_light transition-colors text-white px-12 py-4 rounded-lg font-semibold"
					>
						Designa nu
					</Link>
				) : (
					<button
						onClick={() =>
							toast.error(
								"Designern fungerar bäst på större skärmar. Vänligen byt enhet för att börja designa."
							)
						}
						type="button"
						className="bg-primary hover:bg-primary_light transition-colors text-white px-12 py-4 rounded-lg font-semibold"
					>
						Designa nu
					</button>
				)}
			</div>

			<ul className="space-y-2 text-muted">
				<li className="flex gap-4 items-center">
					<MdLocalShipping />
					Gratis frakt över 500 kr (Sverige)
				</li>

				<li className="flex gap-4 items-center">
					<FaCreditCard />
					100% säker betalning
				</li>

				<li className="flex gap-4 items-center">
					<FaEarthAmericas />
					Tillverkad i Sverige
				</li>
			</ul>
		</div>
	);
}

function MoreInfo({ product }: { product: any }) {
	return (
		<div className="py-8 col-span-2 grid lg:grid-cols-2 lg:gap-16 md:gap-8 gap-4">
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
							<td className="font-semibold pr-4">Vikt</td>
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
