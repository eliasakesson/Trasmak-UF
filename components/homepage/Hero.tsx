import Image from "next/image";
import Link from "next/link";
import { Stars } from "../Rating";

export default function Hero() {
	return (
		<section className="flex min-h-[calc(100vh-111px)] flex-col">
			<div className="relative grid max-h-[50vh] min-h-[25vh] gap-8 md:flex-grow md:grid-cols-3">
				<div className="relative bg-primary md:col-span-2">
					<Image
						src="/images/norway.jpg"
						alt="TRÄSMAK"
						fill
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
				<div className="relative hidden bg-primary py-8 md:block">
					<Image
						src="/images/sally.png"
						alt="TRÄSMAK"
						fill
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
			</div>
			<div className="flex flex-grow-0 flex-col justify-between gap-4 p-8 md:flex-row md:items-end md:gap-8 md:px-[8vw] md:py-16">
				<h1 className="whitespace-nowrap text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl xl:text-7xl">
					<span className="text-primary">Träbricka</span> med
					<br />
					personligt motiv
				</h1>
				<p className="max-w-prose text-base text-gray-600 lg:text-lg xl:text-xl 2xl:text-2xl">
					Träbricka i björkfanér med personligt motiv. Tillverkad i
					Småland med hög kvalité. Vi erbjuder moderna och stilrena
					brickor med eller utan personliga motiv. Välj en av våra
					färdiga mallar eller designa din egen bricka från grunden.
				</p>
			</div>
			<div className="grid flex-grow-0 gap-8 md:flex-grow md:grid-cols-2">
				<div className="flex flex-col gap-4 px-8 pb-4 md:px-[8vw] md:pb-8 md:pr-0">
					<Link
						href="/designer"
						className="flex w-full items-center justify-between rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light 2xl:px-16"
					>
						Designa din bricka
						<span className="hidden text-sm font-normal text-gray-200 md:block">
							“För dig som söker något unikt”
						</span>
					</Link>
					<Link
						href="/products"
						className="w-fit rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 2xl:px-16"
					>
						Se våra produkter
					</Link>
					<Stars rating={5} size="xl" className="md:mt-4">
						<p className="text-sm text-muted md:text-base">
							10+ 5-stjärniga recensioner
						</p>
					</Stars>
				</div>
				<div className="relative hidden md:block">
					<Image
						src="/images/familj.jpg"
						alt="TRÄSMAK"
						fill
						sizes="100%"
						className="object-cover object-[50%75%]"
						quality={100}
						priority
					/>
				</div>
			</div>
		</section>
	);
}
