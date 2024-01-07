import Image from "next/image";
import Link from "next/link";
import { FaImage, FaInfo } from "react-icons/fa";
import { HiArrowLongRight } from "react-icons/hi2";

export default function Section2() {
	return (
		<div>
			<section className="flex lg:flex-row flex-col max-lg:gap-8">
				<div className="flex-1 flex pl-32">
					<div className="relative lg:h-[60vh] h-[40vh] flex-1 bg-primary lg:rounded-tr-[10vh]">
						<Image
							src="/images/designer.png"
							alt=""
							layout="fill"
							className="p-2 object-cover object-top lg:rounded-tr-[10vh]"
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
			<section className="flex lg:flex-row flex-col-reverse">
				<div className="lg:flex-1 flex">
					<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 py-8 flex flex-col justify-center gap-8 h-full">
						<h2 className="xl:text-5xl lg:text-4xl text-3xl font-bold leading-tight text-gray-900">
							Vi guidar dig genom hela processen
						</h2>
						<p className="xl:text-xl text-base text-gray-600 max-w-full">
							Vi har gjort en enkel guide som hjälper dig att
							komma igång med att designa din egen bricka. Du
							hittar den genom att klicka på knappen nedan.
						</p>
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Starta guiden
						</Link>
					</div>
				</div>
				<div className="flex-1 flex">
					<div className="relative flex-1 flex flex-col justify-center gap-8 items-center bg-primary lg:rounded-bl-[10vh] aspect-video">
						<div className="flex gap-4 items-center">
							<p className="font-semibold bg-white px-2 py-1 rounded-md flex items-center">
								Välj textverktyget{" "}
								<span className="bg-gray-300 h-8 w-8 flex items-center justify-center rounded-md ml-2">
									T
								</span>
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Sätt ut text
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Ändra storlek och färg
							</p>
						</div>
						<div className="gap-4 items-center hidden md:flex">
							<p className="font-semibold bg-white px-2 py-1 rounded-md flex items-center">
								Välj bildverktyget
								<span className="bg-gray-300 h-8 w-8 flex items-center justify-center rounded-md ml-2">
									<FaImage />
								</span>
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Klicka för att sätta ut bild
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Välj bild att ladda upp
							</p>
						</div>
						<div className="gap-4 items-center hidden md:flex">
							<p className="font-semibold bg-white p-2 rounded-md">
								Klicka för att sätta ut bild
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Klicka för att sätta ut bild
							</p>
							<HiArrowLongRight className="text-white text-4xl" />
							<p className="font-semibold bg-white p-2 rounded-md">
								Välj bild att ladda upp
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
