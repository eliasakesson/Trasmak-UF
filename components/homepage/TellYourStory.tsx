import Image from "next/image";
import { FaDog, FaGlobe, FaMotorcycle } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

export default function TellYourStory() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-8 px-8 md:flex-row md:gap-16 md:py-16">
			<div className="flex flex-1 flex-col gap-4">
				<h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl xl:text-5xl">
					Berätta din historia
				</h2>
				<p className="max-w-prose text-base text-gray-600 xl:text-xl">
					Ge din måltid en personlig touch med en bricka som startar
					konversationer.
				</p>
				<div className="grid auto-cols-min grid-flow-col grid-rows-2 gap-8 md:flex md:flex-wrap">
					<span className="flex items-center gap-4">
						<FaGlobe className="inline-block text-2xl text-primary" />
						<p className="text-xl">Platser</p>
					</span>
					<span className="flex items-center gap-4">
						<FaDog className="inline-block text-2xl text-primary" />
						<p className="text-xl">Husdjur</p>
					</span>
					<span className="flex items-center gap-4">
						<FaUserGroup className="inline-block text-2xl text-primary" />
						<p className="text-xl">Familj</p>
					</span>
					<span className="flex items-center gap-4">
						<FaMotorcycle className="inline-block text-2xl text-primary" />
						<p className="text-xl">Fordon</p>
					</span>
				</div>
			</div>
			<div className="grid aspect-square w-full flex-1 grid-cols-3 grid-rows-3 gap-4 sm:w-2/3 md:w-full">
				<div className="relative col-span-3 w-full bg-primary">
					<Image
						src="/images/bread.jpg"
						alt="Bild på produktion"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
				<div className="relative col-span-2 row-span-2 w-full overflow-hidden bg-primary md:rounded-bl-[10vh]">
					<Image
						src="/images/kiwi.jpg"
						alt="Bild på produktion"
						fill
						sizes="100%"
						className="object-cover"
						quality={100}
						priority
					/>
				</div>
				<div className="row-span-2 bg-primary"></div>
			</div>
		</div>
	);
}
