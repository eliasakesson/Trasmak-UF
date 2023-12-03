import { Draw, GetTrayObjFromCanvas } from "@/pages/design";
import Link from "next/link";
import { useEffect } from "react";
import { LuRecycle } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";

export default function Section2() {
	return (
		<div>
			<section className="flex max-lg:flex-col max-lg:gap-8">
				<div className="flex-1 flex">
					<div className="flex-1 bg-primary lg:rounded-tr-[10vh] lg:p-24 p-8">
						<img
							src="/images/designer.png"
							alt=""
							className="lg:rounded-2xl rounded-xl"
						/>
					</div>
				</div>
				<div className="lg:flex-1 flex">
					<div className="lg:pr-[10vw] lg:pl-[5vw] px-8 py-8 flex flex-col justify-center gap-8 h-full">
						<h2 className="xl:text-5xl lg:text-4xl text-3xl font-bold leading-tight text-gray-900">
							Designa din egen bricka med vårt enkla verktyg
						</h2>
						<p className="xl:text-xl text-base text-gray-600 max-w-full">
							Du kan välja mellan att utgå från en av våra färdiga
							mallar eller skapa en helt egen design. Välj mellan
							olika storlekar och lägg enkelt till text och bild
							direkt i verktyget, så sköter vi resten.
						</p>
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Designa din bricka
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
