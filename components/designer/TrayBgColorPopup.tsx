import { useContext } from "react";
import { DesignProps } from "@/utils/designer/Interfaces";
import { motion } from "framer-motion";
import { Colorful } from "@uiw/react-color/src/index";
import { DesignerContext } from "@/pages/designer";

export default function TrayBgColorPopup() {
	const { currentDesign, setCurrentDesign } = useContext(DesignerContext);

	return (
		<motion.div className="rounded-xl bg-slate-300 p-2">
			<motion.div className="flex flex-col gap-4 rounded-lg">
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
					className="border border-slate-100"
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
	);
}

function ColorSwatch({ color }: { color: string }) {
	const { currentDesign, setCurrentDesign } = useContext(DesignerContext);

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
			className="h-8 w-8 rounded-lg border border-slate-100"
			style={{ backgroundColor: color }}
		></button>
	);
}

function ImageSwatch({ image }: { image: string }) {
	const { currentDesign, setCurrentDesign } = useContext(DesignerContext);

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
			className="h-8 w-full overflow-hidden rounded-lg border border-slate-100"
		>
			<img src={image} alt="" className="h-full w-full object-cover" />
		</button>
	);
}
