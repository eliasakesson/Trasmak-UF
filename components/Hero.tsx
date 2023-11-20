import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { Draw, GetTrayObjFromCanvas } from "@/pages/design";
import designs from "@/data/herodesigns.json";

export default function Hero() {
	useEffect(() => {
		const canvas1 = document.getElementById("hero1") as HTMLCanvasElement;
		const canvas2 = document.getElementById("hero2") as HTMLCanvasElement;
		const canvas3 = document.getElementById("hero3") as HTMLCanvasElement;
		const canvas4 = document.getElementById("hero4") as HTMLCanvasElement;

		const tray1 = GetTrayObjFromCanvas(canvas1, 1, 43 / 33, "15");
		const tray2 = GetTrayObjFromCanvas(canvas2, 1, 43 / 33, "15");
		const tray3 = GetTrayObjFromCanvas(canvas2, 1, 43 / 33, "15");
		const tray4 = GetTrayObjFromCanvas(canvas2, 1, 43 / 33, "15");

		Draw(canvas1, tray1, designs[0]);
		Draw(canvas2, tray2, designs[1]);
		Draw(canvas3, tray3, designs[2]);
		Draw(canvas4, tray4, designs[3]);
	}, [document.fonts]);

	return (
		<section className="min-h-[calc(100vh-180px*2)] w-full flex gap-8 lg:flex-row flex-col-reverse lg:justify-between justify-end items-center py-8">
			<div className="sm:space-y-8 space-y-4 max-w-prose mx-auto lg:text-center">
				<h1 className="xl:text-7xl md:text-6xl text-4xl font-bold leading-tight text-gray-900">
					<span className="text-primary">Personlig</span> design
					<br />
					till ditt hem
				</h1>
				<p className="xl:text-xl text-base text-gray-600 max-w-full">
					Designa din egen träbricka med vårt enkla verktyg. Utgå från
					en av våra färdiga mallar eller skapa en helt egen design.
					Välj mellan olika storlekar och få en närproducerad bricka
					levererad till dörren.
				</p>
				<br />
				<div className="flex justify-center flex-1 w-full">
					<Link
						href="/design"
						className="bg-primary text-white lg:w-fit w-full lg:px-16 px-8 py-4 font-semibold rounded-md hover:bg-primary_light transition-colors">
						Designa din bricka
					</Link>
				</div>
			</div>
			<div className="relative lg:absolute h-[30vh] flex flex-col items-center -space-y-16 left-0 top-0 w-full">
				<div className="lg:absolute 2xl:left-[5vw] lg:left-[1vw] lg:top-[8vh] lg:h-[calc(10vw+5vh)] flex max-lg:max-w-[60%] max-lg:max-h-[50%] max-lg:translate-x-[6vh] z-10">
					<canvas
						id="hero1"
						className="h-full"
						width={1000}
						height={720}></canvas>
				</div>
				<div className="lg:absolute 2xl:left-[10vw] lg:left-[5vw] lg:top-[48vh] lg:h-[calc(10vw+5vh)] flex max-lg:max-w-[90%] max-lg:max-h-[75%] max-lg:-translate-x-[2vh]">
					<canvas
						id="hero2"
						className="h-full"
						width={1000}
						height={720}></canvas>
				</div>
				<div className="absolute max-lg:hidden 2xl:right-[5vw] lg:right-[1vw] lg:top-[12vh] h-[calc(10vw+5vh)] flex">
					<canvas id="hero3" width={1000} height={720}></canvas>
				</div>
				<div className="absolute max-lg:hidden 2xl:right-[10vw] lg:right-[5vw] lg:top-[52vh] h-[calc(10vw+5vh)] flex">
					<canvas id="hero4" width={1000} height={720}></canvas>
				</div>
			</div>
		</section>
	);
}
