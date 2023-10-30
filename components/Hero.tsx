import { motion } from "framer-motion";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function Hero() {
	return (
		<section className="min-h-[75vh] w-full flex lg:flex-row flex-col-reverse lg:justify-between items-center relative py-8">
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
					<Link
						href="/design"
						className="bg-primary text-white px-12 py-3 font-semibold rounded-md hover:bg-primary_light transition-colors"
					>
						Designa din bricka
					</Link>
					<Link
						href="/products"
						className="border-2 px-12 py-3 font-semibold rounded-md hover:bg-gray-100 transition-colors"
					>
						Se våra brickor
					</Link>
				</div>
			</div>
			<div className="flex flex-col items-end -space-y-8">
				<motion.div
					initial={{ translateX: 50, opacity: 0 }}
					animate={{ translateX: 0, opacity: 1 }}
					className="flex items-center justify-center z-10"
					transition={{ type: "spring", stiffness: 50, delay: 0.1 }}
				>
					<div className="relative xl:h-56 lg:h-40 sm:h-32 h-24 aspect-video bg-amber-700 border-amber-600 border-8 rounded-xl sm:p-6 p-3 flex flex-col items-center justify-center">
						<span className="font-serif md:text-3xl italic text-amber-900 tracking-wider">
							Sally
						</span>
						<FaHeart className="h-2/3 w-2/3 text-transparent stroke-amber-800 stroke-[16px]" />
					</div>
				</motion.div>
				<motion.div
					initial={{ translateX: 50, opacity: 0 }}
					animate={{ translateX: 0, opacity: 1 }}
					className="flex items-center justify-center"
					transition={{ type: "spring", stiffness: 50 }}
				>
					<div className="relative xl:h-72 lg:h-56 sm:h-48 h-36 sm:mr-16 mr-8 aspect-video bg-amber-800 border-amber-700 border-8 rounded-xl sm:p-6 p-3">
						<span className="text-white font-bold xl:text-5xl sm:text-4xl text-xl">
							VÄRNAMO
						</span>
						<div className="absolute top-0 left-0 right-0 bottom-0 flex items-end">
							<div className="border-t-4 border-r-4 border-amber-900 w-[10%] h-3/5"></div>
							<div className="border-t-4 border-amber-950 w-[10%] h-1/4 opacity-50"></div>
							<div className="border-4 border-b-0 border-amber-900 w-[15%] h-1/2 opacity-50"></div>
							<div className="border-t-4 border-amber-950 w-[10%] h-1/6 opacity-50"></div>
							<div className="border-4 border-b-0 border-amber-900 w-[20%] h-4/6"></div>
							<div className="border-t-4 border-amber-950 flex-1 h-1/5 opacity-50"></div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
