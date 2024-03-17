import SavedDesigns from "@/components/design/SavedDesigns";
import { auth } from "@/firebase";
import GetProducts from "@/utils/stripe/getProducts";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Head from "next/head";
import { useContext } from "react";
import { SiteContext } from "./_app";

export default function Profile({ products }: { products: any[] }) {
	const [user, loading, error] = useAuthState(auth);

	const { setDesign } = useContext(SiteContext);
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Profil - Träsmak UF</title>
				<meta
					name="description"
					content="Din profil för att fortsätta designa dina brickor."
				/>
				<meta name="robots" content="noindex, follow" />
			</Head>
			{user ? (
				<main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-7xl flex-col items-center space-y-16 px-8 py-16">
					<div className="flex w-full flex-col items-center gap-2 border-b pb-8">
						<Image
							src={user.photoURL || "/images/default-profile.png"}
							alt=""
							width={80}
							height={80}
							className="rounded-full"
						/>
						<h1 className="text-4xl font-bold text-gray-900">
							{user.displayName || "Anonym"}
						</h1>
						<span className="text-muted">{user.email}</span>
					</div>
					<div className="space-y-4">
						<h2 className="text-4xl font-bold">
							Mina sparade designs
						</h2>
						<p className="text-lg text-muted">
							Fortsätt där du slutade och spara dina designs för
							att komma tillbaka till dem senare.
						</p>
						<br />
						<SavedDesigns
							products={products}
							onSelect={(design) => {
								setDesign(design);
								router.push({
									pathname: "/designer",
								});
							}}
							canvasClassKey="profile-saved-template-canvas"
						/>
					</div>
				</main>
			) : loading ? (
				<div className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-7xl flex-col items-center space-y-8 px-8 py-16">
					<div>Laddar...</div>
				</div>
			) : (
				<div className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-7xl flex-col items-center space-y-8 px-8 py-16">
					<div>Du är inte inloggad</div>
				</div>
			)}
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
