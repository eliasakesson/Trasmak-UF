import GeneratedDesigns from "@/components/design/GeneratedDesigns";
import { DesignProps } from "@/utils/designer/Interfaces";
import GetProducts from "@/utils/stripe/getProducts";
import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { SiteContext } from "./_app";
import Head from "next/head";

export default function DesignGenerator({ products }: { products: any[] }) {
	const [image, setImage] = useState("");
	const router = useRouter();
	const { setDesign } = useContext(SiteContext);

	const onDrop = useCallback((acceptedFiles: any) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			const reader = new FileReader();

			reader.onloadend = () => {
				const img = new Image();
				img.src = reader.result as string;

				img.onload = () => {
					const resolution = img.width * img.height;
					if (resolution < 250000) {
						toast.error(
							"Bilden är för lågupplöst. Välj en bild med högre upplösning.",
						);
					} else {
						toast.success("Bilden är uppladdad!");
						setImage(reader.result as string);
					}
				};
			};

			reader.readAsDataURL(acceptedFiles[0]);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		noClick: true,
	});

	function onSelect(design: DesignProps) {
		setDesign(design);
		router.push("/designer");
	}

	return (
		<>
			<Head>
				<title>Skapa design från bild - Träsmak UF</title>
				<meta
					name="description"
					content="Designa din egen bricka eller glasunderlägg genom att ladda upp en bild. Vi genererar ett urval av designförslag baserat på din bild. Välj en design för att komma till designern, där du kan anpassa den efter dina önskemål."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="mx-auto min-h-[calc(100vh-108px)] max-w-7xl space-y-8 px-8 py-16">
				<div className="flex flex-col gap-4 text-center">
					<h1 className="text-4xl font-bold text-gray-900">
						Ladda upp en bild, vi gör resten
					</h1>
					<p className="mx-auto max-w-prose text-muted">
						Vi genererar ett urval av designförslag baserat på din
						bild. Välj en design för att komma till designern, där
						du kan anpassa den efter dina önskemål.
					</p>
				</div>
				<div className="mx-auto flex max-w-7xl grow flex-col gap-1">
					<label
						{...getRootProps()}
						className="cursor-pointer rounded-md border border-gray-300 px-4 py-8 hover:border-gray-200"
						htmlFor="image-upload"
					>
						<div className="flex h-full flex-col items-center justify-center gap-2">
							<svg
								className="h-12 w-12 text-muted_light"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<div>
								<p className="whitespace-nowrap font-semibold text-muted_light">
									Klicka för att ladda upp bild
								</p>
								<p className="whitespace-nowrap text-muted_light">
									eller dra och släpp en bild här
								</p>
							</div>
						</div>
						<input
							{...getInputProps()}
							name="image-upload"
							id="image-upload"
							className="hidden"
						/>
					</label>
				</div>
				<GeneratedDesigns
					products={products}
					image={image}
					onSelect={onSelect}
				/>
			</main>
		</>
	);
}

export async function getStaticProps() {
	const products = await GetProducts();

	return {
		props: {
			products,
		},
	};
}
