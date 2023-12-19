import { useState } from "react";
import { FaInfo, FaTimes } from "react-icons/fa";

export default function DesignerGuide() {
	const [show, setShow] = useState(false);

	return (
		<>
			<button
				className="flex items-center justify-center h-full aspect-square font-bold rounded-xl border"
				onClick={() => setShow(true)}
			>
				<FaInfo />
			</button>
			{show && (
				<article className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-xl p-8 max-w-3xl relative flex flex-col">
						<h1 className="text-2xl font-semibold">
							Designer guide
						</h1>
						<span>Steg 1</span>
						<br />
						<TextToolTutorial />
						<button
							className="absolute top-4 right-4"
							onClick={() => setShow(false)}
						>
							<FaTimes />
						</button>
					</div>
				</article>
			)}
		</>
	);
}

function TextToolTutorial() {
	return (
		<div className="flex flex-col gap-1">
			<h2 className="text-4xl font-bold">Textverktyget</h2>
			<p>Välj textverktyget</p>
			<button className="h-12 w-12 flex items-center justify-center font-bold rounded-xl border bg-gray-100">
				T
			</button>
			<p>Tryck på brickan för att sätta ut</p>
			<div></div>
			<p>Skriv din text</p>
			<div></div>
			<p>Ändra egenskaper</p>
			<div></div>
			<p>Klicka utanför texten för att avmarkera</p>
		</div>
	);
}
