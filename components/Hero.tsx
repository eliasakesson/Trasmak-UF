import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import useSwipe from "@/utils/useSwipe";

export default function Hero() {
	const [scrollY, setScrollY] = useState(0);
	const [currentSlide, setCurrentSlide] = useState(0);
	const controls = useAnimationControls();

	const slides = [
		"/images/valnöt.jpg",
		"/images/lemon.jpg",
		"/images/black.jpg",
		"/images/hero.jpg",
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

		controls.start({
			x: `-${currentSlide * 25}%`,
			transition: {
				duration: 0.5,
				ease: "easeInOut",
			},
		});
		controls
			.start({
				filter: `blur(2px)`,
				transition: {
					duration: 0.25,
					ease: "circIn",
				},
			})
			.then(() => {
				controls.start({
					filter: `blur(0px)`,
					transition: {
						duration: 0.25,
						ease: "circOut",
					},
				});
			});

		return () => clearInterval(interval);
	}, [currentSlide, controls]);

	const swipeHandlers = useSwipe({
		onSwipedLeft: () =>
			setCurrentSlide((currentSlide) =>
				currentSlide === slides.length - 1 ? 0 : currentSlide + 1
			),
		onSwipedRight: () =>
			setCurrentSlide((currentSlide) =>
				currentSlide === 0 ? slides.length - 1 : currentSlide - 1
			),
	});

	return (
		<section className="lg:min-h-[calc(100vh-153px)] min-h-[calc(100vh-111px)] flex lg:flex-row flex-col-reverse max-lg:gap-8">
			<div className="lg:flex-1 flex max-lg:h-1/2">
				<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 lg:h-md:pb-[153px] lg:py-8 py-4 flex flex-col justify-center lg:gap-8 gap-2 h-full">
					<h1 className="xl:text-7xl lg:text-6xl text-4xl font-bold leading-tight text-gray-900">
						<span className="text-primary">Träbricka</span> med
						<br />
						personligt motiv
					</h1>
					<p className="xl:text-xl text-base text-gray-600 max-w-full">
						Träbricka i björkfanér med personligt motiv. Tillverkad i Småland med hög kvalité.
						Vi erbjuder moderna och stilrena brickor med eller utan personliga motiv. Välj en av våra
						färdiga mallar eller designa din egen bricka från grunden.
					</p>
					<div className="flex lg:gap-4 gap-2 lg:flex-row flex-col pt-4 lg:pb-0 pb-16">
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
							Designa din bricka
						</Link>
						<Link
							href="/design-generator"
							className="border-2 lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
							Skapa design från bild
						</Link>
					</div>
				</div>
			</div>
			<div className="flex-1 flex max-lg:h-1/2">
				<div
					className="flex-1 bg-primary relative overflow-hidden"
					style={{ borderBottomLeftRadius: scrollY / 2 }}
					{...swipeHandlers}>
					<motion.div
						animate={controls}
						className="flex h-full"
						style={{
							width: `${slides.length * 100}%`,
						}}>
						{slides.map((slide, i) => (
							<div key={i} className="w-full relative">
								<Image
									src={slide}
									layout="fill"
									alt=""
									className="object-cover"
								/>
							</div>
						))}
					</motion.div>
					<div className="absolute lg:bottom-8 bottom-4 left-1/2 -translate-x-1/2 p-1 bg-gray-50 flex gap-1 rounded-full">
						{slides.map((_, i) => (
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
