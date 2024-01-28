import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DesignProps, ObjectProps } from "@/utils/design/Interfaces";
import { MdFormatColorFill } from "react-icons/md";
import { motion, useAnimation } from "framer-motion";
import { Colorful } from "@uiw/react-color/src/index";

const TrayBackgroundPopupContext = createContext<{
	currentDesign: DesignProps | null;
	setCurrentDesign: (currentDesign: DesignProps) => void;
}>({
	currentDesign: null,
	setCurrentDesign: () => {},
});

export default function TrayBackgroundPopup({
	currentDesign,
	setCurrentDesign,
}: {
	currentDesign: DesignProps | null;
	setCurrentDesign: (currentDesign: DesignProps) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const controls = useAnimation();
	const innerControls = useAnimation();

	useEffect(() => {
		if (isOpen) {
			controls.start({ scaleY: 1, opacity: 1 });
			innerControls.start({
				opacity: 1,
				translateY: 0,
				transition: { delay: 0.1 },
			});
		} else {
			controls.start({ scaleY: 0, opacity: 0 });
			innerControls.start({
				opacity: 0,
				translateY: -20,
				transition: { duration: 0 },
			});
		}
	}, [isOpen, controls, innerControls]);

	return (
		<TrayBackgroundPopupContext.Provider
			value={{ currentDesign, setCurrentDesign }}
		>
			<div className="relative h-full">
				<div
					onClick={() => setIsOpen(false)}
					className={`${
						isOpen ? "" : "hidden"
					} fixed bottom-0 left-0 right-0 top-0 z-20`}
				></div>
				<button
					aria-label="Select tray background color"
					onClick={() => setIsOpen(!isOpen)}
					className="relative h-12 w-12 rounded-md border-2"
				>
					<MdFormatColorFill
						size={20}
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					/>
				</button>
				<motion.div
					initial={{ scaleY: 0 }}
					animate={controls}
					className="absolute left-0 top-10 z-30 origin-top rounded-xl border bg-white"
				>
					<motion.div
						initial={{ opacity: 0, translateY: -20 }}
						animate={innerControls}
						className="space-y-4 p-4"
					>
						<Colorful
							color={currentDesign?.color || "#000"}
							onChange={(color) =>
								currentDesign &&
								setCurrentDesign({
									...currentDesign,
									color: color.hex,
									image: "",
								})
							}
							disableAlpha
						/>
						<div className="grid grid-cols-6 gap-1">
							<ColorSwatch color="#FFFFFF" />
							<ColorSwatch color="#eeeeee" />
							<ColorSwatch color="#DADADA" />
							<ColorSwatch color="#464646" />
							<ColorSwatch color="#000000" />
							<ColorSwatch color="#5C3A2D" />
							<ColorSwatch color="#BCE3C5" />
							<ColorSwatch color="#A3C57D" />
							<ColorSwatch color="#B5EAEA" />
							<ColorSwatch color="#75AADB" />
							<ColorSwatch color="#F9AEF9" />
							<ColorSwatch color="#B39BCB" />
							<ColorSwatch color="#F2E2D2" />
							<ColorSwatch color="#F9E2AE" />
							<ColorSwatch color="#FFD3D8" />
							<ColorSwatch color="#F9AEAE" />
							<ColorSwatch color="#E07A5F" />
							<ColorSwatch color="#FF6F61" />
						</div>
						<ImageSwatch image="/images/birch.jpg" />
					</motion.div>
				</motion.div>
			</div>
		</TrayBackgroundPopupContext.Provider>
	);
}

function ColorSwatch({ color }: { color: string }) {
	const { currentDesign, setCurrentDesign } = useContext(
		TrayBackgroundPopupContext,
	);

	return (
		<button
			aria-label={`Select color ${color}`}
			onClick={() =>
				setCurrentDesign({
					...currentDesign,
					color,
					image: "",
				} as DesignProps)
			}
			className="h-8 w-8 rounded-lg border border-gray-300"
			style={{ backgroundColor: color }}
		></button>
	);
}

function ImageSwatch({ image }: { image: string }) {
	const { currentDesign, setCurrentDesign } = useContext(
		TrayBackgroundPopupContext,
	);

	async function onClick() {
		const img = new Image();
		img.src = image;
		img.onload = () => {
			setCurrentDesign({
				...currentDesign,
				image,
				imageElement: img,
				color: "",
			} as DesignProps);
		};
		img.onerror = () => {
			console.log("error");
		};
	}

	return (
		<button
			aria-label="Select birch image as tray background"
			onClick={onClick}
			className="h-8 w-full rounded-lg border"
		>
			<img src={image} alt="" className="h-full w-full object-cover" />
		</button>
	);
}
