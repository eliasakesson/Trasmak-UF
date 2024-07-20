import { useState } from "react";
import { FaCookieBite } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { PiSmileySad } from "react-icons/pi";
import { MdEmail, MdInfo, MdInfoOutline, MdPhone } from "react-icons/md";

export default function Popup() {
	const [isOpen, setIsOpen] = useState(true);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
						animate={{
							backdropFilter: "blur(2px)",
							opacity: 1,
						}}
						exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
						onClick={close}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-[2px]"
					>
						<div
							onClick={(e) => e.stopPropagation()}
							className="relative flex h-full w-full max-w-3xl flex-col justify-center rounded-xl bg-white p-16 lg:h-fit"
						>
							<div className="flex flex-col gap-8">
								<PiSmileySad
									size={60}
									className="text-primary"
								/>
								<h1 className="text-balance text-4xl font-bold leading-tight text-gray-900">
									Vår resa som UF-företag är avslutad
								</h1>
								<div className="flex flex-col gap-2">
									<p className="1x-w-prose text-base text-gray-600 xl:text-xl">
										Vi har stängt vår försäljning, men vi är
										fortfarande kontaktbara enligt
										uppgifterna nedan. Tack för stödet under
										detta underbara år!
									</p>
									<p className="1x-w-prose mb-6 text-sm italic text-gray-500 xl:text-xl">
										Hemsidan är fortfarande uppe i
										testsyfte, beställningar går EJ igenom.
									</p>
									<a
										href="mailto:trasmakuf@gmail.com"
										className="flex w-fit items-center gap-2"
									>
										<MdEmail />
										<span className="text-primary hover:text-primary_light">
											trasmakuf@gmail.com
										</span>
									</a>
									<a
										href="tel:0701234567"
										className="flex w-fit items-center gap-2"
									>
										<MdPhone />
										<span className="text-primary hover:text-primary_light">
											070-344 23 65
										</span>
									</a>
								</div>
								<div className="flex flex-col gap-4 md:pt-4 lg:flex-row">
									<button
										onClick={close}
										className="w-full rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-16"
									>
										Jag förstår
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{!isOpen && (
					<motion.button
						initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
						animate={{
							backdropFilter: "blur(2px)",
							opacity: 1,
						}}
						exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
						onClick={open}
						className="fixed bottom-8 right-8 z-20 flex items-center justify-center rounded-md border-2 border-border bg-white p-3 text-xl shadow-lg transition-colors hover:bg-slate-100"
					>
						<MdInfoOutline />
					</motion.button>
				)}
			</AnimatePresence>
		</>
	);
}
