import { useEffect, useState, createContext, useContext } from "react";
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
	const [show, setShow] = useState<"hide" | "welcome" | "tutorial">("hide");

	useEffect(() => {
		const hasVisitedDesigner = localStorage.getItem("hasVisitedDesigner");
		if (!hasVisitedDesigner) {
			setTimeout(() => setShow("welcome"), 500);
		}
	}, []);

	return (
		<>
			<button
				className="flex items-center justify-center h-full aspect-square font-bold rounded-xl border"
				onClick={() => setShow("tutorial")}>
				<FaInfo />
			</button>
			{show !== "hide" && (
				<motion.div
					initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
					animate={
						show === "welcome" || show === "tutorial"
							? {
									backdropFilter: "blur(2px)",
									opacity: 1,
							  }
							: {
									backdropFilter: "blur(0px)",
									opacity: 0,
							  }
					}
					className="z-50 fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center backdrop-blur-[2px]">
					<div className="bg-white rounded-xl p-16 max-w-3xl w-full relative">
						{show === "welcome" && <Welcome setShow={setShow} />}
						{show === "tutorial" && <Tutorial setShow={setShow} />}
					</div>
				</motion.div>
			)}
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
	const headers = ["window", "tools", "templates", "save", "order"];
	const [currenetHeader, setCurrentHeader] = useState("window");

	function NextHeader() {
		const currentIndex = headers.indexOf(currenetHeader);
		const nextIndex = currentIndex + 1;
		if (nextIndex < headers.length) {
			setCurrentHeader(headers[nextIndex]);
		}
	}

	function PreviousHeader() {
		const currentIndex = headers.indexOf(currenetHeader);
		const previousIndex = currentIndex - 1;
		if (previousIndex >= 0) {
			setCurrentHeader(headers[previousIndex]);
		}
	}

	return (
		<>
			<div className="space-y-8">
				<ul className="flex gap-4 text-lg">
					<HeaderItem
						active={currenetHeader === "window"}
						onClick={() => setCurrentHeader("window")}>
						Designfönstret
					</HeaderItem>
					<HeaderItem
						active={currenetHeader === "tools"}
						onClick={() => setCurrentHeader("tools")}>
						Verktyg
					</HeaderItem>
					<HeaderItem
						active={currenetHeader === "templates"}
						onClick={() => setCurrentHeader("templates")}>
						Mallar
					</HeaderItem>
					<HeaderItem
						active={currenetHeader === "save"}
						onClick={() => setCurrentHeader("save")}>
						Spara
					</HeaderItem>
					<HeaderItem
						active={currenetHeader === "order"}
						onClick={() => setCurrentHeader("order")}>
						Beställ
					</HeaderItem>
				</ul>
				{currenetHeader === "window" && <GeneralTutorial />}
				{currenetHeader === "tools" && <ToolsTutorial />}
				<div className="flex justify-between text-muted font-medium">
					<div>
						<button
							onClick={() => PreviousHeader()}
							className="flex gap-2 items-center">
							<FaArrowLeft />
						</button>
					</div>
					<div>
						<button
							onClick={() => NextHeader()}
							className="flex gap-2 items-center ml-auto">
							Nästa steg <FaArrowRight />
						</button>
					</div>
				</div>
			</div>
			<button
				className="absolute top-8 right-8"
				onClick={() => setShow("hide")}>
				<FaTimes size={20} />
			</button>
		</>
	);
}

function GeneralTutorial() {
	return (
		<div className="flex gap-8">
			<div className="space-y-4">
				<TrayTutorialStep className="">
					<></>
				</TrayTutorialStep>
				<p>
					Här ser du hur din bricka ser ut. Du kan själv välja hur den
					ska se ut genom att lägga till bilder, text och andra
					element.
				</p>
			</div>
			<div className="space-y-4">
				<div className="grid grid-flow-col gap-2 justify-start">
					<div className="w-6 h-6 rounded-md bg-red-500"></div>
					<div>
						<p>Yttre kanten på säkerhetsmarginalen</p>
						<p className="text-sm">
							Brickornas motiv kan förskjutas något vid
							tillverkning. Säkerhetsmarginalen är där för att
							säkerställa att inget viktigt hamnar utanför
							brickan.
						</p>
					</div>
				</div>
				<div className="grid grid-flow-col gap-2 justify-start">
					<div className="w-6 h-6 rounded-md bg-blue-500"></div>
					<div>
						<p>Yttre kanten av brickan</p>
						<p className="text-sm">
							Här innanför placeras viktiga element som inte får
							hamna utanför brickan. Men bilder och annat som
							täcker hela brickan bör gå ända ut i den röda zonen.
						</p>
					</div>
				</div>
				<div className="grid grid-flow-col gap-2 justify-start">
					<div className="w-6 h-6 rounded-md bg-green-500"></div>
					<div>
						<p>Yttre kanten av brickan</p>
						<p className="text-sm">
							Här innanför placeras viktiga element som inte får
							hamna utanför brickan. Men bilder och annat som
							täcker hela brickan bör gå ända ut i den röda zonen.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function ToolsTutorial() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-flow-col gap-4 justify-start">
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-100">
					<FaMousePointer />
				</button>
				<p>
					Markören kan användas för att markera och flytta runt
					element på din bricka.
				</p>
			</div>
			<div className="grid grid-flow-col gap-4 justify-start">
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-100">
					T
				</button>
				<p>
					Textverktyget kan användas för att skriva text. Välj
					verktyget och klicka på brickan för att sätta ut texten.
					Sedan kan du skriva din text.
				</p>
			</div>
			<div className="grid grid-flow-col gap-4 justify-start">
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-100">
					<FaImage />
				</button>
				<p>
					Bildverktyget kan användas för att lägga till bilder. Välj
					verktyget och klicka på brickan för att sätta ut eller
					klicka och dra för att sätta ut en bild i en specifik
					storlek.
				</p>
			</div>
			<div className="grid grid-flow-col gap-4 justify-start">
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-100">
					<FaSquare />
				</button>
				<p>
					Rektangelverktyget kan användas för att lägga till
					rektanglar. Välj verktyget och klicka på brickan för att
					sätta ut eller klicka och dra för att sätta ut en rektangel
					i en specifik storlek.
				</p>
			</div>
		</div>
	);
}

function HeaderItem({
	children,
	onClick,
	active,
}: {
	children: React.ReactNode;
	onClick: () => void;
	active: boolean;
}) {
	return (
		<li className="relative group">
			<button className={active ? "font-medium" : ""} onClick={onClick}>
				{children}
			</button>
			<span
				className={`absolute left-0 bottom-0 h-[2px] w-full group-hover:bg-gray-200 ${
					active ? "!bg-gray-300" : "bg-transparent"
				}`}></span>
		</li>
	);
}

function OldTutorial({ setShow }: { setShow: (show: "hide") => void }) {
	return (
		<article className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-xl p-8 max-w-3xl w-full relative flex flex-col">
				<h1 className="text-2xl font-semibold">Designer guide</h1>
				<span>Steg 1</span>
				<br />
				<TextToolTutorial />
				<button
					className="absolute top-4 right-4"
					onClick={() => setShow("hide")}>
					<FaTimes />
				</button>
			</div>
		</article>
	);
}

function TextToolTutorial() {
	return (
		<div className="flex flex-col gap-1">
			<h2 className="text-4xl font-bold">Textverktyget</h2>
			<p>Välj textverktyget</p>
			<div className="flex gap-2">
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-200">
					<FaMousePointer />
				</button>
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-50">
					T
				</button>
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-200">
					<FaImage />
				</button>
				<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-200">
					<FaSquare />
				</button>
			</div>
			<p>Tryck på brickan för att sätta ut</p>
			<TrayTutorialStep className="p-6">
				<LuTextCursor size={16} />
			</TrayTutorialStep>
			<p>Skriv din text</p>
			<TrayTutorialStep className="px-6 py-4">
				<span className="text-xl">Text</span>
			</TrayTutorialStep>
			<p>Ändra egenskaper</p>
			<TrayTutorialStep className="px-6 py-4 relative">
				<span className="text-xl">Text</span>
				<div className="bg-white w-20 h-12 rounded p-2">
					<div className="bg-gray-100 text-sm w-fit px-1">20</div>
				</div>
			</TrayTutorialStep>
			<p>Klicka utanför texten för att avmarkera</p>
			<TrayTutorialStep className="relative px-6 py-4">
				<span className="text-xl">Text</span>
				<LuTextCursor size={16} className="absolute -right-10 top-2" />
			</TrayTutorialStep>
		</div>
	);
}

function TrayTutorialStep({
	children,
	className,
}: {
	children: React.ReactNode;
	className: string;
}) {
	return (
		<div className="h-48 aspect-[6/4] w-fit bg-gray-100 rounded-md py-4 px-12">
			<div className="bg-gray-200 w-full h-full rounded-[32px] p-2 border-red-500 border">
				<div className="w-full h-full border-blue-500 border rounded-[24px]">
					<div
						className={`w-full h-full border-gray-100 border-[12px] rounded-[24px] ${className}`}>
						<div className="border-green-500 border h-full rounded-[12px]">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
