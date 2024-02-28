import { useState, createContext, useContext, useEffect } from "react";
import { FaImage, FaPlus, FaShapes } from "react-icons/fa";
import { MdFormatColorFill, MdTextFields } from "react-icons/md";
import { TbRectangleFilled } from "react-icons/tb";
import TrayBgColorPopup from "./TrayBgColorPopup";
import { motion } from "framer-motion";
import TextPopup from "./TextPopup";
import ShapePopup from "./ShapePopup";
import ImagePopup from "./ImagePopup";
import { DesignerContext } from "@/pages/designer";
import TrayPopup from "./TrayPopup";
import Image from "next/image";

export const ToolBarContext = createContext<{
	openMenu: string | null;
	setOpenMenu: (openMenu: string | null) => void;
}>({
	openMenu: null,
	setOpenMenu: () => {},
});

export default function ToolBar() {
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	return (
		<ToolBarContext.Provider value={{ openMenu, setOpenMenu }}>
			{openMenu && (
				<div
					onClick={() => setOpenMenu(null)}
					className="fixed bottom-0 left-0 right-0 top-0"
				></div>
			)}
			<div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-xl bg-slate-200 p-2">
				<Tool tool="text" tooltip="Lägg till text">
					<MdTextFields />
					<FaPlus className="absolute right-2 top-2 text-xs text-slate-700" />
				</Tool>
				<Tool tool="image" tooltip="Lägg till bild">
					<FaImage />
					<FaPlus className="absolute right-2 top-2 text-xs text-slate-700" />
				</Tool>
				<Tool tool="shape" tooltip="Lägg till form">
					<FaShapes />
					<FaPlus className="absolute right-2 top-2 text-xs text-slate-700" />
				</Tool>
				<div className="border border-slate-300"></div>
				<Tool tool="color" tooltip="Byt bakgrundsfärg">
					<MdFormatColorFill />
				</Tool>
				<Tool tool="tray" tooltip="Byt bricka">
					<TbRectangleFilled />
				</Tool>
			</div>
			<SizeText />
		</ToolBarContext.Provider>
	);
}

function SizeText() {
	const { currentDesign, products } = useContext(DesignerContext);
	const [text, setText] = useState("");

	useEffect(() => {
		if (!currentDesign.id) return;

		const selectedProduct = products.find(
			(product) => product.id === `price_${currentDesign.id}`,
		);

		if (selectedProduct) {
			setText(
				`${selectedProduct.metadata.width}x${selectedProduct.metadata.height} cm`,
			);
		}
	}, [currentDesign.id]);

	return (
		<span className="absolute bottom-28 left-1/2 -z-10 -translate-x-1/2 transform text-slate-700">
			{text}
		</span>
	);
}

function ToolPopup({ tool }: { tool: string }) {
	const { openMenu } = useContext(ToolBarContext);

	const popups = {
		color: <TrayBgColorPopup />,
		text: <TextPopup />,
		shape: <ShapePopup />,
		image: <ImagePopup />,
		tray: <TrayPopup />,
	};

	if (openMenu !== tool) return null;

	return (
		<div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2">
			{Object.keys(popups).map((key: string) => {
				return key === tool ? (
					<motion.div
						key={key}
						initial={{ translateY: "10%", opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
					>
						{popups[key as keyof typeof popups]}
					</motion.div>
				) : null;
			})}
		</div>
	);
}

function Tool({
	tool,
	tooltip,
	children,
}: {
	tool: string;
	tooltip: string;
	children: React.ReactNode;
}) {
	const { openMenu, setOpenMenu } = useContext(ToolBarContext);

	const onClick = () => {
		if (openMenu === tool) {
			setOpenMenu(null);
		} else {
			setOpenMenu(tool);
		}
	};

	return (
		<div className="lg:relative">
			<ToolPopup tool={tool} />
			<ButtonWithTooltip
				tooltip={tooltip}
				className="relative rounded-lg bg-white p-4 text-2xl transition-colors hover:bg-slate-100"
				onClick={onClick}
			>
				{children}
			</ButtonWithTooltip>
		</div>
	);
}

function ButtonWithTooltip({
	children,
	tooltip,
	...props
}: {
	children: React.ReactNode;
	tooltip: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			type="button"
			className={`${props.className} group relative`}
		>
			{children}
			<span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-200 px-3 py-1 text-lg opacity-0 transition-all group-hover:-translate-y-full group-hover:opacity-100 group-hover:delay-100">
				{tooltip}
			</span>
		</button>
	);
}
