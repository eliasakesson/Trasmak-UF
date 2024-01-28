import Image from "next/image";

export default function About() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-8 lg:flex-row lg:gap-16">
			<div className="relative aspect-video w-full flex-1">
				<Image
					src="/images/production.jpg"
					alt="Bild på produktion"
					fill
					objectFit="cover"
					objectPosition="center"
					quality={100}
					priority
				/>
			</div>
			<div className="flex flex-1 flex-col gap-4">
				<h2 className="text-3xl font-bold leading-tight text-gray-900 lg:text-4xl xl:text-5xl">
					Vår vision
				</h2>
				<p className="max-w-prose text-base text-gray-600 xl:text-xl">
					Vår vision är att skapa en produkt som är både hållbar och
					personlig. Våra produkter är handtillverkade i Småland och
					är gjorda av FSC certifierad björkfaner från Sverige.
					Motiven trycks med miljövänlig UV-print, vilket ger vibranta
					färger och en snygg finish. Motivet är sedan skyddat med ett
					melaminlager som gör brickan slitstark och tålig mot värme.
				</p>
			</div>
		</div>
	);
}
