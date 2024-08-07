import { useEffect, useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import useSwipe from "@/utils/useSwipe";
import { title } from "process";

export default function DesignerGuide() {
	const router = useRouter();
	const [show, setShow] = useState<
		"hide" | "welcome" | "starttutorial" | "tutorial"
	>("hide");

	useEffect(() => {
		const hasVisitedDesigner = localStorage.getItem("hasVisitedDesigner");
		if (!hasVisitedDesigner) {
			setTimeout(() => setShow("welcome"), 500);
		}
	}, []);

	useEffect(() => {
		if (router.query.t) {
			setTimeout(() => setShow("starttutorial"), 500);
			router.replace("/designer");
		}
	}, [router, router.query.t]);

	return (
		<>
			{show === "welcome" && (
				<motion.div
					initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
					animate={{
						backdropFilter: "blur(2px)",
						opacity: 1,
					}}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-[2px]"
				>
					<div className="relative flex h-full w-full max-w-3xl flex-col justify-center rounded-xl bg-white p-16 lg:h-fit">
						<Welcome setShow={setShow} />
					</div>
				</motion.div>
			)}
			{show === "starttutorial" && (
				<motion.div
					initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
					animate={{
						backdropFilter: "blur(2px)",
						opacity: 1,
					}}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-[2px]"
				>
					<div className="relative flex h-full w-full max-w-3xl flex-col justify-center rounded-xl bg-white p-16 lg:h-fit">
						<StartTutorial setShow={setShow} />
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
		<div className="flex flex-col items-center gap-8">
			<h1 className="text-center text-4xl font-bold leading-tight text-gray-900">
				Hej!
			</h1>
			<p className="1x-w-prose text-center text-base text-gray-600 xl:text-xl">
				Ser ut som att du är ny till designverktyget. Hur vill du
				fortsätta?
			</p>
			<div className="flex flex-col gap-4 md:pt-4 lg:flex-row">
				<button
					onClick={() => {
						setShow("tutorial");
						SetHasVisitedDesigner();
					}}
					className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
				>
					Visa mig hur det funkar
				</button>
				<button
					onClick={() => {
						setShow("hide");
						SetHasVisitedDesigner();
					}}
					className="w-full rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-16"
				>
					Jag vet vad jag gör
				</button>
			</div>
		</div>
	);
}

function StartTutorial({
	setShow,
}: {
	setShow: (show: "tutorial" | "hide") => void;
}) {
	function SetHasVisitedDesigner() {
		localStorage.setItem("hasVisitedDesigner", "true");
	}

	return (
		<div className="flex flex-col items-center gap-8">
			<h1 className="text-center text-4xl font-bold leading-tight text-gray-900">
				Hej!
			</h1>
			<p className="1x-w-prose text-center text-base text-gray-600 xl:text-xl">
				Välkommen till designverktyget!
				<br /> Vill du starta guiden för att lära dig hur det funkar?
			</p>
			<div className="flex flex-col gap-4 md:pt-4 lg:flex-row">
				<button
					onClick={() => {
						setShow("tutorial");
						SetHasVisitedDesigner();
					}}
					className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
				>
					Visa mig hur det funkar
				</button>
				<button
					onClick={() => {
						setShow("hide");
						SetHasVisitedDesigner();
					}}
					className="w-full rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-16"
				>
					Jag vet vad jag gör
				</button>
			</div>
		</div>
	);
}

function Tutorial({ setShow }: { setShow: (show: "hide") => void }) {
	const [step, setStep] = useState(0);

	const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
		onSwipedLeft: () => nextStep(),
		onSwipedRight: () => prevStep(),
	});

	function nextStep() {
		if (step === tutorialSteps.length - 1) {
			setShow("hide");
		} else {
			setStep((step) => step + 1);
		}
	}

	function prevStep() {
		if (step > 0) {
			setStep((step) => step - 1);
		}
	}

	return (
		<div
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-[2px]"
		>
			<div className="relative flex h-full w-full max-w-3xl flex-col justify-between gap-8 rounded-xl bg-white p-8 lg:h-fit lg:p-16">
				<button
					aria-label="Stäng guide"
					onClick={() => setShow("hide")}
					className="absolute right-4 top-4"
				>
					<FaTimes className="text-xl text-muted" />
				</button>
				<div className="flex flex-col gap-4">
					<h1 className="order-2 text-center text-2xl font-bold leading-tight text-gray-900 lg:order-1 lg:text-left">
						{tutorialSteps[step].title}
					</h1>
					<div className="order-1 lg:order-2">
						{tutorialSteps[step].video && (
							<video
								autoPlay
								loop
								muted
								playsInline
								src={tutorialSteps[step].video}
								className="hidden aspect-video w-full lg:block lg:border-y"
							></video>
						)}
						{tutorialSteps[step].videoMobile && (
							<video
								autoPlay
								loop
								muted
								playsInline
								src={tutorialSteps[step].videoMobile}
								className="aspect-square w-full lg:hidden"
							></video>
						)}
						{tutorialSteps[step].image && (
							<img
								src={tutorialSteps[step].image}
								alt=""
								className="hidden aspect-video w-full lg:block lg:border-y"
							/>
						)}
						{tutorialSteps[step].imageMobile && (
							<img
								src={tutorialSteps[step].imageMobile}
								alt=""
								className="mx-auto aspect-square w-[90%] lg:hidden"
							/>
						)}
					</div>
					<p className="order-3 text-center lg:text-left">
						{tutorialSteps[step].description}
					</p>
				</div>
				<div className="flex flex-col gap-8">
					<div className="flex justify-center gap-3 lg:hidden">
						{[...Array(tutorialSteps.length)].map((_, i) => (
							<button
								aria-label={`Steg ${i + 1}`}
								key={i}
								className={`${i === step ? "bg-muted" : "bg-slate-300"} size-2 rounded-full`}
							></button>
						))}
					</div>
					<button
						onClick={nextStep}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
					>
						{step === tutorialSteps.length - 1 ? (
							<>
								Avsluta guiden
								<FaArrowRight />
							</>
						) : (
							<>
								Nästa steg
								<FaArrowRight />
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

const tutorialSteps = [
	{
		title: "Välj bricka och färg",
		video: "/videos/GuideTrayColor.mp4",
		videoMobile: "/videos/GuideTrayColorMobile.mp4",
		description:
			"Välj vilken bricka du vill använda och vilken färg du vill ha. Du kan även välja att använda ett trämaterial som matchar baksidan.",
	},
	{
		title: "Lägg till bild",
		video: "/videos/GuideImage.mp4",
		videoMobile: "/videos/GuideImageMobile.mp4",
		description:
			"Klicka på knappen för att lägga till en bild. Du kan därefter ändra storlek och position på bilden genom att dra direkt på brickan. ",
	},
	{
		title: "Lägg till text",
		video: "/videos/GuideText.mp4",
		videoMobile: "/videos/GuideTextMobile.mp4",
		description:
			"Klicka på knappen för att lägga till text. Du kan därefter ändra texten och flytta den genom att dra direkt på brickan.",
	},
	{
		title: "Beställ eller spara design",
		image: "/images/GuideBuySave.png",
		imageMobile: "/images/GuideBuySaveMobile.png",
		description:
			"När du är nöjd med din design kan du beställa den. Om du inte är redo att beställa kan du spara designen för att komma tillbaka till den senare, genom att spara den till ditt konto.",
	},
];
