import Image from "next/image";
import Link from "next/link";
import { FaBookmark, FaImage, FaInfo, FaPen } from "react-icons/fa";
import { HiArrowLongRight } from "react-icons/hi2";

export default function Section2() {
	return (
		<div className="max-w-7xl mx-auto w-full lg:space-y-32 space-y-16 px-4">
			<div className="text-center flex flex-col items-center gap-4">
				<h2 className="xl:text-5xl lg:text-4xl text-3xl font-bold leading-tight text-gray-900">
					Hur designar jag en bricka?
				</h2>
				<p className="xl:text-xl text-base text-gray-600 max-w-prose">
					Att designa en bricka är enkelt. Du kan välja mellan flera
					olika sätt att komma igång, beroende på hur du vill göra.
				</p>
			</div>
			<div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-8">
				<div className="flex flex-col space-y-4">
					<h3 className="lg:text-4xl text-3xl font-bold flex items-center gap-4">
						<FaPen />
						Designa själv
					</h3>
					<p className="text-muted lg:text-lg max-w-prose">
						Om du söker en mer personlig bricka kan du designa den
						själv. Med vårt enkla verktyg kan du få en unik bricka
						som passar just dig.
						<br />
						<br />
						Om du vill ha lite hjälp på traven kan du kolla in vår
						guide som hjälper dig att komma igång.
					</p>
					<br />
					<div className="flex lg:flex-row flex-col lg:gap-4 gap-2">
						<Link
							href="/design?t"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Starta guiden
						</Link>
						<Link
							href="/design"
							className="border-2 lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
							Designa själv
						</Link>
					</div>
				</div>
				<div>
					<Image
						src="/images/designer.png"
						alt=""
						width={500}
						height={300}
						className="h-f aspect-video object-cover object-top border-2 border-gray-300 rounded-lg"
					/>
				</div>
			</div>
			<div className="flex lg:flex-row flex-col items-center justify-between gap-8">
				<div>
					<Image
						src="/images/designer.png"
						alt=""
						width={500}
						height={300}
						className="h-f aspect-video object-cover object-top border-2 border-gray-300 rounded-lg"
					/>
				</div>
				<div className="flex flex-col lg:items-end lg:text-right space-y-4">
					<h3 className="lg:text-4xl text-3xl font-bold flex items-center gap-4">
						<FaBookmark />
						Utgå från en mall
					</h3>
					<p className="text-muted text-lg max-w-prose">
						Vi har massvis färdiga mallar som du kan utgå från, som
						du enkelt kan anpassa med din egen text och bild. Du kan
						alltid anpassa mallarna efter dina önskemål.
					</p>
					<br />
					<Link
						href="/templates"
						className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
						Visa mallar
					</Link>
				</div>
			</div>
			<div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-8">
				<div className="flex flex-col space-y-4">
					<h3 className="lg:text-4xl text-3xl font-bold flex items-center gap-4">
						<FaImage />
						Utgå från en bild
					</h3>
					<p className="text-muted text-lg max-w-prose">
						Det enklaste sättet att komma igång är att utgå från en
						bild. Ladda upp en bild och välj en storlek, så tar vi
						fram massor av förslag på brickor som passar.
					</p>
					<br />
					<Link
						href="/design"
						className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
						Ta mig till bildverktyget
					</Link>
				</div>
				<div>
					<Image
						src="/images/designer.png"
						alt=""
						width={500}
						height={300}
						className="h-f aspect-video object-cover object-top border-2 border-gray-300 rounded-lg"
					/>
				</div>
			</div>
		</div>
	);
}
