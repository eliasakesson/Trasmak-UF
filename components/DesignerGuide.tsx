import { useEffect, useState, createContext, useContext, useRef } from "react";
import {
	FaArrowLeft,
	FaArrowRight,
	FaImage,
	FaInfo,
	FaMousePointer,
	FaSquare,
	FaTimes,
} from "react-icons/fa";
import { LuTextCursor } from "react-icons/lu";
import { motion } from "framer-motion";

export default function DesignerGuide() {
	const [show, setShow] = useState<"hide" | "welcome" | "tutorial">(
		"welcome"
	);

	// useEffect(() => {
	// 	const hasVisitedDesigner = localStorage.getItem("hasVisitedDesigner");
	// 	if (!hasVisitedDesigner) {
	// 		setTimeout(() => setShow("welcome"), 500);
	// 	}
	// }, []);

	return (
		<>
			<button
				className="flex items-center justify-center h-full aspect-square font-bold rounded-xl border"
				onClick={() => setShow("tutorial")}>
				<FaInfo />
			</button>
			{show === "welcome" && (
				<motion.div
					initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
					animate={{
						backdropFilter: "blur(2px)",
						opacity: 1,
					}}
					className="z-50 fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center backdrop-blur-[2px]">
					<div className="bg-white rounded-xl p-16 max-w-3xl w-full relative">
						<Welcome setShow={setShow} />
					</div>
				</motion.div>
			)}
			{show === "tutorial" && <Tutorial setShow={setShow} />}
		</>
	);
}

function Welcome({
	setShow,
}: {
	setShow: (show: "tutorial" | "hide") => void;
}) {
	function SetHasVisitedDesigner() {
		localStorage.setItem("hasVisitedDesigner", "true");
	}

	return (
		<div className="flex flex-col gap-8 items-center">
			<h1 className="xl:text-4xl lg:text-3xl text-2xl font-bold leading-tight text-gray-900 text-center">
				Hej!
			</h1>
			<p className="xl:text-xl text-base text-gray-600 max-w-prose">
				Ser ut som att du är ny till designverktyget. Hur vill du
				fortsätta?
			</p>
			<div className="flex gap-4 lg:flex-row flex-col md:pt-4">
				<button
					onClick={() => {
						setShow("tutorial");
						SetHasVisitedDesigner();
					}}
					className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors">
					Visa mig hur det funkar
				</button>
				<button
					onClick={() => {
						setShow("hide");
						SetHasVisitedDesigner();
					}}
					className="border-2 lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
					Jag vet vad jag gör
				</button>
			</div>
		</div>
	);
}

function Tutorial({ setShow }: { setShow: (show: "hide") => void }) {
	const [step, setStep] = useState(0);

	const steps = [
		<Step
			title="Storlekar"
			text="Här kan du välja vilken storlek du vill ha på din bricka. Prova
		att välja en av storlekarna genom att klicka på den. Du kan alltid ändra storlek
		senare."
			nextStep={NextStep}
			elementID="products"
			position="left"
		/>,
		<Step
			title="Verktyg"
			text="Här är alla verktyg du kan använda för att designa din bricka. Du kan
			välja ett verktyg genom att klicka på det."
			nextStep={NextStep}
			elementID="tools"
			position="bottom"
		/>,
		<Step
			title="Välj Textverktyget"
			text=""
			nextStep={NextStep}
			elementID="texttool"
			position="right"
		/>,
		<Step
			title="Sätt ut text"
			text="När du har valt textverktyget kan du sätta ut text på din bricka genom
			att klicka på brickan där du vill ha texten. Du kan ändra texten genom att
			börja skriva direkt."
			nextStep={NextStep}
			elementID="canvasparent"
			position="right"
		/>,
		<Step
			title="Välj Bildverktyget"
			text=""
			nextStep={NextStep}
			elementID="imagetool"
			position="right"
		/>,
		<Step
			title="Sätt ut bild"
			text="När du har valt bildverktyget kan du sätta ut en bild på din bricka genom
			att klicka på brickan där du vill ha bilden, alternativt hålla inne muspekaren och dra för att
			bestämma storlek och placering."
			nextStep={NextStep}
			elementID="canvasparent"
			position="right"
		/>,
		<Step
			title="Ändra bild"
			text="När du har placerat ut en bild kan du ändra bilden och andra egenskaper genom att välja en bild i rutan till vänster. Du kan också ändra storlek och placering genom att dra i hörnen på bilden."
			nextStep={NextStep}
			elementID="editor"
			position="right"
		/>,
		<Step
			title="Mallar"
			text="Här finns alla mallar du kan utgå ifrån när du designar din bricka. Du
			kan välja en mall genom att klicka på den."
			nextStep={NextStep}
			elementID="templates"
			position="top"
		/>,
	];

	function NextStep() {
		setStep((prev) => (prev >= steps.length - 1 ? 0 : prev + 1));
		if (step >= steps.length - 1) {
			setShow("hide");
		}
	}

	return steps[step];
}

function Step({
	title,
	text,
	nextStep,
	elementID,
	position,
}: {
	title: string;
	text: string;
	nextStep: () => void;
	elementID?: string;
	position?: "left" | "right" | "top" | "bottom";
}) {
	const gap = 16;
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!elementID) return;

		const element = document.getElementById(elementID);
		if (element) {
			const rect = element.getBoundingClientRect();

			ref.current?.style.setProperty(
				"left",
				position === "left"
					? rect.left - (ref.current?.offsetWidth || 0) - gap + "px"
					: position === "right"
					? rect.left + rect.width + gap + "px"
					: rect.left + "px"
			);

			ref.current?.style.setProperty(
				"top",
				position === "top"
					? rect.top - (ref.current?.offsetHeight || 0) - gap + "px"
					: position === "bottom"
					? rect.top + rect.height + gap + "px"
					: rect.top + gap + "px"
			);

			window.scrollTo({
				top:
					(ref?.current?.offsetTop ?? 0) -
					(position === "top"
						? window.innerHeight / 6
						: (window.innerHeight * 2) / 3),
				behavior: "smooth",
			});
		}
	}, [elementID, position, gap, ref]);

	return (
		<div
			ref={ref}
			className="absolute bg-white rounded-xl p-8 flex flex-col gap-4 z-50 shadow-md">
			<h2 className="xl:text-2xl lg:text-xl text-lg font-semibold leading-tight text-gray-900">
				{title}
			</h2>
			<p className="max-w-[40ch]">{text}</p>
			<button
				onClick={nextStep}
				className="flex gap-2 items-center text-muted font-medium">
				Nästa steg <FaArrowRight />
			</button>
		</div>
	);
}
