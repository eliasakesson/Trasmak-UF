import { motion } from "framer-motion";

export default function Hero() {
	return (
		<div className="lg:h-[75vh] md:h-[calc(100vh-158px)] h-[calc(100vh-108px)] w-full flex lg:flex-row flex-col lg:justify-between items-center relative py-8">
			<div className="lg:hidden w-full max-w-prose h-full bg-green-500 rounded-xl"></div>
			<div className="sm:space-y-8 space-y-4 max-w-prose py-8">
				<h1 className="md:text-6xl sm:text-5xl text-4xl font-bold leading-tight text-gray-900">
					Personlig touch till ditt hem med graverad bricka.
				</h1>
				<p className="sm:text-xl text-base text-gray-600 max-w-full">
					Utforska vårt utvalda sortiment av närtillverkade brickor,
					lasergraverade med omsorg och precision i Sverige. Ge ditt
					hem eller företag en unik touch med våra skräddarsydda
					designs.
				</p>
				<br />
				<div className="flex gap-4 sm:flex-row flex-col">
					<button className="bg-primary text-white px-12 py-3 font-semibold rounded-md hover:bg-primary_light transition-colors duration-200">
						Designa din bricka
					</button>
					<button className="border-2 px-12 py-3 font-semibold rounded-md hover:bg-gray-100 transition-colors duration-200">
						Se våra brickor
					</button>
				</div>
			</div>
			<div className="hidden lg:block">
				<motion.div
					className="absolute -z-10 top-[55%] w-0 h-0 flex items-center justify-center"
					initial={{ left: "150%" }}
					animate={{ left: "75%" }}
					transition={{ type: "spring", stiffness: 50, delay: 0.1 }}>
					<div className="xl:h-72 h-56 aspect-video bg-black rounded-xl p-2">
						<img
							src="/images/bricka1.jpg"
							alt=""
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				</motion.div>
				<motion.div
					className="absolute -z-10 xl:top-1/4 top-1/3 w-0 h-0 flex items-center justify-center"
					initial={{ left: "150%" }}
					animate={{ left: "85%" }}
					transition={{ type: "spring", stiffness: 50, delay: 0.5 }}>
					<div className="xl:h-56 h-40 aspect-video bg-green-500 rounded-xl p-2">
						<img
							src="/images/bricka2.jpg"
							alt=""
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
