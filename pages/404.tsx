import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
	return (
		<>
			<Head>
				<title>404 - Träsmak UF</title>
				<meta
					name="description"
					content="404 - The page you are looking for does not exist."
				/>
				<meta name="robots" content="noindex, follow" />
			</Head>
			<main className="h-[calc(100vh-108px)] pb-[108px] w-full flex flex-col gap-4 items-center justify-center">
				<h1 className="text-4xl font-bold text-gray-900">
					404 - Page Not Found
				</h1>
				<p className="text-gray-600">
					The page you are looking for does not exist.
				</p>
				<br />
				<Link
					href="/"
					className="text-primary hover:text-primary_light transition-colors">
					Go back home
				</Link>
			</main>
		</>
	);
}
