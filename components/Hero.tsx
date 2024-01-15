import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function Hero() {
	const [scrollY, setScrollY] = useState(0);
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		"/images/hero.jpg",
		"/images/valnöt.jpg",
		"/images/hero.jpg",
		"/images/valnöt.jpg",
	];

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

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((currentSlide) =>
				currentSlide === slides.length - 1 ? 0 : currentSlide + 1
			);
		}, 5000);

		return () => clearInterval(interval);
	}, [currentSlide]);

	const controls = useAnimationControls();

	return (
		<section className="lg:min-h-[calc(100vh-153px)] min-h-[calc(100vh-111px)] flex lg:flex-row flex-col-reverse max-lg:gap-8">
			<div className="lg:flex-1 flex max-lg:h-1/2">
				<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 lg:h-md:pb-[153px] lg:py-8 py-4 flex flex-col justify-center lg:gap-8 gap-2 h-full">
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
					<div className="flex lg:gap-4 gap-2 lg:flex-row flex-col pt-4 lg:pb-0 pb-16">
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Designa din bricka
						</Link>
						<Link
							href="/products"
							className="border-2 lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
							Se våra brickor
						</Link>
					</div>
				</div>
			</div>
			<div className="flex-1 flex max-lg:h-1/2">
				<div
					className="flex-1 bg-primary relative overflow-hidden"
					style={{ borderBottomLeftRadius: scrollY }}>
					<motion.div animate={controls}>
						<Image
							src={slides[currentSlide]}
							layout="fill"
							alt=""
							className="object-cover"
						/>
					</motion.div>
					<div className="absolute lg:bottom-8 bottom-4 left-1/2 -translate-x-1/2 p-1 bg-gray-50 flex gap-1 rounded-full">
						{slides.map((slide, i) => (
							<button
								aria-label={`Button slide ${i + 1}`}
								key={i}
								className={`h-4 rounded-full transition-all ${
									currentSlide === i
										? "bg-primary_light opacity-50 w-16"
										: "bg-gray-300 w-4"
								}`}
								onClick={() => setCurrentSlide(i)}></button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
