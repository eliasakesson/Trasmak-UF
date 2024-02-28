import Image from "next/image";
import Link from "next/link";
import { FaBookmark, FaImage, FaPen } from "react-icons/fa";

export default function HowToDesign() {
	return (
		<div className="mx-auto w-full max-w-7xl space-y-8 px-8 lg:space-y-16">
			<div className="flex flex-col items-center gap-4 text-center">
				<h2 className="text-3xl font-bold leading-tight text-gray-900 lg:text-4xl xl:text-5xl">
					Hur designar jag en bricka?
				</h2>
				<p className="max-w-prose text-base text-gray-600 xl:text-xl">
					Att designa en bricka är enkelt. Du kan välja mellan flera
					olika sätt att komma igång, beroende på hur du vill göra.
				</p>
			</div>
			<div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-16">
				<div className="flex flex-col space-y-4">
					<h3 className="flex items-center gap-4 text-3xl font-bold">
						<FaPen />
						Designa själv
					</h3>
					<p className="max-w-prose text-muted lg:text-lg">
						Om du söker en mer personlig bricka kan du designa den
						själv. Med vårt enkla verktyg kan du få en unik bricka
						som passar just dig.
						<br />
						<br />
						Om du vill ha lite hjälp på traven kan du kolla in vår
						guide som hjälper dig att komma igång.
					</p>
					<br />
					<div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
						{/* <Link
							href="/designer?t=guide"
							className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
						>
							Starta guiden
						</Link> */}
						<Link
							href="/designer"
							className="w-full rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-16"
						>
							Designa själv
						</Link>
					</div>
				</div>
				<div className="relative aspect-video w-full flex-1 lg:w-auto">
					<Image
						src="/images/designer.png"
						alt=""
						fill
						className="border-2 border-gray-300 object-cover object-top"
					/>
				</div>
			</div>
			<div className="relative flex flex-col items-center justify-between gap-8 bg-slate-200 py-16 lg:flex-row lg:gap-16">
				<div className="absolute bottom-0 left-full top-0 w-full bg-slate-200"></div>
				<div className="absolute bottom-0 right-full top-0 w-full bg-slate-200"></div>
				<div className="relative aspect-video w-full flex-1 lg:w-auto">
					<Image
						src="/images/design-generator.png"
						alt=""
						fill
						className="border-2 border-gray-300 object-cover object-top"
					/>
					d
				</div>
				<div className="flex flex-col space-y-4 lg:items-end lg:text-right">
					<h3 className="flex items-center gap-4 text-3xl font-bold">
						<FaImage />
						Utgå från en bild
					</h3>
					<p className="max-w-prose text-lg text-muted">
						Det enklaste sättet att komma igång är att utgå från en
						bild. Ladda upp en bild och välj en storlek, så tar vi
						fram massor av förslag på brickor som passar.
					</p>
					<br />
					<Link
						href="/templates"
						className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
					>
						Ta mig till bildverktyget
					</Link>
				</div>
			</div>
			<div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-16">
				<div className="flex flex-col space-y-4">
					<h3 className="flex items-center gap-4 text-3xl font-bold">
						<FaBookmark />
						Utgå från en mall
					</h3>
					<p className="max-w-prose text-lg text-muted">
						Vi har massvis färdiga mallar som du kan utgå från, som
						du enkelt kan anpassa med din egen text och bild. Du kan
						alltid anpassa mallarna efter dina önskemål.
					</p>
					<br />
					<Link
						href="/design-generator"
						className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
					>
						Visa mallar
					</Link>
				</div>
				<div className="relative aspect-video w-full flex-1 lg:w-auto">
					<Image
						src="/images/templates.png"
						alt=""
						fill
						className="border-2 border-gray-300 object-cover object-top"
					/>
				</div>
			</div>
		</div>
	);
}
