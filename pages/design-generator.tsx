import GeneratedDesigns from "@/components/design/GeneratedDesigns";
import { DesignProps } from "@/utils/design/Interfaces";
import GetProducts from "@/utils/getProducts";
import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { SiteContext } from "./_app";
import { useWindowSize } from "@/utils/hooks";
import Head from "next/head";
import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

export default function DesignGenerator({ products }: { products: any[] }) {
	const [image, setImage] = useState("");
	const router = useRouter();
	const windowSize = useWindowSize();
	const { setDesign } = useContext(SiteContext);

	const onDrop = useCallback((acceptedFiles: any) => {
		console.log(acceptedFiles);
		if (acceptedFiles && acceptedFiles.length > 0) {
			const reader = new FileReader();

			reader.onloadend = () => {
				const img = new Image();
				img.src = reader.result as string;

				img.onload = () => {
					const resolution = img.width * img.height;
					if (resolution < 250000) {
						toast.error(
							"Bilden är för lågupplöst. Välj en bild med högre upplösning."
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
		router.push("/design");
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
			<main className="max-w-7xl mx-auto px-8 py-16 space-y-8 min-h-[calc(100vh-108px)]">
				<div className="text-center flex flex-col gap-4">
					<h1 className="text-4xl font-bold text-gray-900">
						Ladda upp en bild, vi gör resten
					</h1>
					<p className="max-w-prose text-muted mx-auto">
						Vi genererar ett urval av designförslag baserat på din
						bild. Välj en design för att komma till designern, där
						du kan anpassa den efter dina önskemål.
					</p>
				</div>
				<div className="flex flex-col gap-1 grow max-w-7xl mx-auto">
					<label
						{...getRootProps()}
						className="cursor-pointer border border-gray-300 rounded-md px-4 py-8 hover:border-gray-200"
						htmlFor="image-upload">
						<div className="flex flex-col items-center justify-center gap-2 h-full">
							<svg
								className="w-12 h-12 text-muted_light"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16">
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<div>
								<p className="text-muted_light font-semibold whitespace-nowrap">
									Klicka för att ladda upp bild
								</p>
								<p className="text-muted_light whitespace-nowrap">
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
