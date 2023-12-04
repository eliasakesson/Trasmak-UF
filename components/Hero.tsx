import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		function handleScroll() {
			if (window.innerWidth < 1024) {
				setScrollY(0);
				return;
			}
			setScrollY(window.scrollY);
		}

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section className="lg:min-h-[calc(100vh-153px)] min-h-[calc(100vh-111px)] flex lg:flex-row flex-col-reverse max-lg:gap-8">
			<div className="lg:flex-1 flex max-lg:h-1/2">
				<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 lg:h-md:pb-[153px] py-8 flex flex-col justify-center gap-8 h-full">
					<h1 className="xl:text-7xl lg:text-6xl text-4xl font-bold leading-tight text-gray-900">
						<span className="text-primary">Personlig</span> design
						<br />
						till ditt hem
					</h1>
					<p className="xl:text-xl text-base text-gray-600 max-w-full">
						Designa din egen träbricka med vårt enkla verktyg. Utgå
						från en av våra färdiga mallar eller skapa en helt egen
						design. Välj mellan olika storlekar och få en
						närproducerad bricka levererad till dörren.
					</p>
					<div className="flex gap-4 max-lg:flex-col md:pt-4">
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Designa din bricka
						</Link>
						<Link
							href="/products"
							className="border-2 lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Se våra mallar
						</Link>
					</div>
				</div>
			</div>
			<div className="flex-1 flex max-lg:h-1/2">
				<div
					className="flex-1 bg-primary relative overflow-hidden"
					style={{ borderBottomLeftRadius: scrollY }}>
					<Image
						src="/images/hero.jpg"
						layout="fill"
						objectFit="cover"
						objectPosition="center"
						alt=""
					/>
				</div>
			</div>
		</section>
	);
}
