import { useContext, useEffect, useState } from "react";
import { DesignerContext } from "@/pages/designer";
import { DesignProps, ObjectProps } from "@/utils/designer/Interfaces";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function LocalDesignSaver() {
	const { currentDesign, setCurrentDesign } = useContext(DesignerContext);
	const [lastDesign, setLastDesign] = useState<DesignProps | null>(null);

	useEffect(() => {
		loadDesign();
	}, []);

	async function loadDesign() {
		const localDesign = localStorage.getItem("currentDesign");
		if (!localDesign) return;

		const parsedDesign = JSON.parse(localDesign) as DesignProps;
		if (
			parsedDesign &&
			parsedDesign?.id &&
			parsedDesign?.objects?.length > 0
		) {
			const objects = await Promise.all(
				parsedDesign.objects.map((object) => {
					if (object.type === "image") {
						const img = new Image();
						img.src = object.content;
						return new Promise<ObjectProps>((resolve) => {
							img.onload = () => {
								resolve({ ...object, image: img });
							};
						});
					}

					return Promise.resolve(object);
				}),
			);

			setLastDesign({ ...parsedDesign, objects });
		}
	}

	useEffect(() => {
		if (currentDesign.id) {
			try {
				localStorage.setItem(
					"currentDesign",
					JSON.stringify(currentDesign),
				);
			} catch (error) {
				console.error(error);
			}
		}
	}, [currentDesign]);

	function acceptDesign() {
		if (!lastDesign) return;

		setCurrentDesign(lastDesign);
		setLastDesign(null);
	}

	function declineDesign() {
		setLastDesign(null);
		localStorage.removeItem("lastDesign");
	}

	if (lastDesign)
		return (
			<motion.div
				initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
				animate={{
					backdropFilter: "blur(2px)",
					opacity: 1,
				}}
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-[2px]"
			>
				<div className="relative mx-4 flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl bg-white p-16">
					<h1 className="text-center text-2xl font-bold leading-tight text-gray-900 lg:text-3xl xl:text-4xl">
						Hej!
					</h1>
					<p className="max-w-prose text-center text-base text-gray-600 xl:text-xl">
						Vi hittade en sparad design som du kan fortsätta att
						arbeta med.
					</p>
					<div className="flex flex-col gap-4 md:pt-4 lg:flex-row">
						<button
							onClick={acceptDesign}
							className="w-full rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-16"
						>
							Använd sparad design
						</button>
						<button
							onClick={declineDesign}
							className="w-full rounded-lg border-2 px-8 py-4 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-16"
						>
							Börja från grunden
						</button>
					</div>
					<button
						className="absolute right-8 top-8"
						onClick={declineDesign}
					>
						<FaTimes />
					</button>
				</div>
			</motion.div>
		);

	return null;
}
