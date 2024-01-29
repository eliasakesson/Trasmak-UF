import Image from "next/image";

export default function About() {
	return (
		<div className="bg-primary py-8 md:py-16">
			<div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 px-8 md:items-center lg:flex-row lg:gap-16">
				<h2 className="order-2 text-3xl font-bold leading-tight text-white md:order-1 lg:text-4xl xl:text-5xl">
					Våra produkter
				</h2>
				<div className="relative order-1 aspect-square w-full flex-1 md:order-2">
					<Image
						src="/images/green.jpg"
						alt="Bild på produktion"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
				<div className="order-3 flex flex-1 flex-col gap-4">
					<p className="max-w-prose text-base text-gray-100 xl:text-xl">
						<span className="font-semibold">
							Våra produkter är handtillverkade
						</span>{" "}
						i Småland och är gjorda av FSC certifierad björkfaner
						från Sverige.
						<br />
						<br />
						<span className="font-semibold">
							Motiven trycks med miljövänlig
						</span>{" "}
						UV-print, vilket ger vibranta färger och en snygg
						finish. Motivet är sedan skyddat med ett melaminlager
						som gör brickan slitstark och tålig mot värme.
					</p>
				</div>
			</div>
		</div>
	);
}
