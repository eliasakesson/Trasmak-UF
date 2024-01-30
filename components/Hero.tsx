import Image from "next/image";
import Link from "next/link";
import { Stars } from "./Rating";

export default function Hero() {
	return (
		<section className="flex min-h-[calc(100vh-111px)] flex-col">
			<div className="relative grid flex-1 gap-8 md:flex-[4] md:grid-cols-3">
				<div className="relative bg-primary md:col-span-2">
					<Image
						src="/images/valnöt.jpg"
						alt="TRÄSMAK"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
				<div className="relative hidden bg-primary md:block">
					<Image
						src="/images/black.jpg"
						alt="TRÄSMAK"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
			</div>
			<div className="flex flex-col justify-between gap-8 p-8 md:flex-row md:items-end md:px-[8vw] md:py-16">
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
			<div className="grid gap-8 md:flex-1 md:grid-cols-2">
				<div className="flex flex-col gap-4 px-8 pb-8 md:px-[8vw] md:pr-0">
					<Link
						href="/design"
						className="flex w-full items-center justify-between rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light 2xl:px-16"
					>
						Designa din bricka
						<span className="hidden text-sm font-normal text-gray-200 md:block">
							“För dig som söker något unikt”
						</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/products"
							className="w-fit rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 2xl:px-16"
						>
							Se våra produkter
						</Link>
						<p className="hidden text-sm font-normal text-muted md:block">
							20+ olika storlekar och former
						</p>
					</div>
					<Stars rating={5} size="xl" className="mt-4">
						<p className="text-sm text-muted md:text-base">
							10+ 5-stjärniga recensioner
						</p>
					</Stars>
				</div>
				<div className="relative hidden md:block">
					<Image
						src="/images/section1.jpg"
						alt="TRÄSMAK"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
			</div>
		</section>
	);
}
