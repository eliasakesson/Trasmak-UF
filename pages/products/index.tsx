import { useState } from "react";
import { ProductCard } from "@/components/ProductRow";
import GetProducts from "@/utils/stripe/getProducts";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Products({ products }: { products: any }) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Produkter - Träsmak UF</title>
				<meta
					name="description"
					content="Här hittar du alla våra bästa brickor och glasunderlägg. Välj en produkt för att komma till designern."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-7xl flex-col items-center space-y-8 px-8 py-16">
				<div className="flex flex-col gap-4 text-center">
					<h1 className="text-4xl font-bold text-gray-900">
						Våra produkter
					</h1>
					{router.query.search_input ? (
						<span className="max-w-prose text-muted">
							Du sökte efter{" "}
							<span className="text-black">
								{router.query.search_input}
							</span>
						</span>
					) : (
						<p className="max-w-prose text-muted">
							Här hittar du våra produkter. Mallar hittar du efter
							du valt storlek. Välj en produkt för att komma till
							designern.
						</p>
					)}
				</div>
				<ProductsAndFilterGrid products={products} />
			</main>
		</>
	);
}

function ProductsAndFilterGrid({ products }: { products: any }) {
	const [sortVal, setSortVal] = useState("1");
	const [filters, setFilters] = useState({ type: [], category: [] });

	return (
		<div className="w-full">
			<div className="flex w-full justify-between border-b py-4">
				<span>{products.length} Resultat</span>
				<label htmlFor="sort" className="sr-only">
					Sortera efter
				</label>
				<select
					id="sort"
					onChange={(e) => setSortVal(e.target.value)}
					className="rounded-lg border px-2 py-1"
				>
					<option value="1" aria-label="">
						Sortera efter
					</option>
					<option value="2">Popularitet</option>
					<option value="3">Betyg</option>
					<option value="4">Pris (Lågt till högt)</option>
					<option value="5">Pris (Högt till lågt)</option>
				</select>
			</div>
			<div className="grid gap-4 py-4 md:grid-cols-4">
				{/* <Filters setFilters={setFilters} /> */}
				<div className="col-span-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
					<ProductGrid
						products={products}
						sortVal={sortVal}
						filters={filters}
					/>
				</div>
			</div>
		</div>
	);
}

function Filters({ setFilters }: { setFilters: any }) {
	function onFilterChange(e: any, type: string) {
		if (e.target.checked) {
			setFilters((prev: any) => ({
				...prev,
				[type]: [...prev[type], e.target.value],
			}));
		} else {
			setFilters((prev: any) => {
				const newFilters = prev[type].filter(
					(filter: string) => filter !== e.target.value,
				);

				return {
					...prev,
					[type]: newFilters,
				};
			});
		}
	}

	return (
		<div className="space-y-4">
			<h3 className="text-2xl font-bold text-gray-900">Filter</h3>
			<div>
				<h4 className="border-b py-1">Typ</h4>
				<ul className="mt-2 space-y-2">
					<li className="flex items-center gap-2">
						<input
							type="checkbox"
							className="h-4 w-4"
							value="common"
							onChange={(e) => onFilterChange(e, "type")}
						/>
						<label>Storlekar</label>
					</li>
					<li className="flex items-center gap-2">
						<input
							type="checkbox"
							className="h-4 w-4"
							value="template"
							onChange={(e) => onFilterChange(e, "type")}
						/>
						<label>Mallar</label>
					</li>
				</ul>
			</div>
			{/* <div>
				<h4 className="border-b py-1">Motiv</h4>
				<ul className="mt-2 flex md:flex-col gap-2">
					<li className="flex items-center gap-2">
						<input
							type="checkbox"
							className="w-4 h-4"
							value="city"
							onChange={(e) => onFilterChange(e, "category")}
						/>
						<label>Städer</label>
					</li>
					<li className="flex items-center gap-2">
						<input
							type="checkbox"
							className="w-4 h-4"
							value="family"
							onChange={(e) => onFilterChange(e, "category")}
						/>
						<label>Familj</label>
					</li>
					<li className="flex items-center gap-2">
						<input
							type="checkbox"
							className="w-4 h-4"
							value="animal"
							onChange={(e) => onFilterChange(e, "category")}
						/>
						<label>Djur</label>
					</li>
				</ul>
			</div> */}
		</div>
	);
}

function ProductGrid({
	products,
	sortVal,
	filters,
}: {
	products: any;
	sortVal: string;
	filters: { type: string[]; category: string[] };
}) {
	const router = useRouter();

	const filteredProducts = products
		?.filter((product: any) => {
			if (router.query.search_input) {
				return product.name
					.toLowerCase()
					.includes(
						router.query.search_input.toString().toLowerCase(),
					);
			} else {
				return true;
			}
		})
		.filter((product: any) => {
			return (
				(filters.category.length === 0 ||
					filters.category.includes(product.metadata.category)) &&
				(filters.type.length === 0 ||
					filters.type.includes(product.metadata.type))
			);
		})
		.sort((a: any, b: any) => {
			return sortVal === "4"
				? a.price - b.price
				: sortVal === "5"
					? b.price - a.price
					: 0;
		});

	if (filteredProducts.length === 0) {
		return (
			<>
				<div className="col-span-full space-y-4 py-4">
					<p className="text-muted">
						Inga produkter matchade din sökning.
					</p>
					<h3 className="text-2xl font-bold text-gray-900">
						Föreslagna produkter
					</h3>
				</div>
				{products.map((product: any) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						price={product.price}
						image={product.image}
						currency={product.currency}
					/>
				))}
			</>
		);
	}

	return filteredProducts.map((product: any) => (
		<ProductCard
			key={product.id}
			id={product.id}
			name={product.name}
			price={product.price}
			image={product.image}
			currency={product.currency}
			h2
		/>
	));
}

export async function getStaticProps() {
	const products = await GetProducts(false);

	return {
		props: {
			products,
		},
	};
}
