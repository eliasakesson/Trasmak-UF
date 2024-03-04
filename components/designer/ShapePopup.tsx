import { DesignerContext } from "@/pages/designer";
import { useContext } from "react";
import defaultDesign from "@/data/defaultdesign.json";
import { DesignProps } from "@/utils/design/Interfaces";
import { ToolBarContext } from "./ToolBar";
import { FaStar } from "react-icons/fa";

export default function ShapePopup() {
	const shapes = [
		{ value: "rectangle", icon: <div className="h-8 w-8 bg-black"></div> },
		{
			value: "circle",
			icon: <div className="h-8 w-8 rounded-full bg-black"></div>,
		},
		// {
		// 	value: "triangle",
		// 	icon: (
		// 		<div
		// 			className="h-0 w-0
		// border-b-[24px] border-l-[16px]
		// border-r-[16px] border-b-black
		// border-l-transparent border-r-transparent"
		// 		></div>
		// 	),
		// },
		// { value: "star", icon: <FaStar className="h-8 w-8" /> },
	];

	const { currentDesign, setCurrentDesign } = useContext(DesignerContext);
	const { setOpenMenu } = useContext(ToolBarContext);

	function addShape(shape: string) {
		const id =
			currentDesign.objects.length > 0
				? Math.max(...currentDesign.objects.map((o) => o.id)) + 1
				: 1;

		const order =
			Math.max(...currentDesign.objects.map((obj) => obj.order), 0) + 1;

		setCurrentDesign({
			...currentDesign,
			objects: [
				...currentDesign.objects,
				{
					...defaultDesign["rectangle"],
					content: shape,
					id,
					order,
					radius: shape === "circle" ? 0.5 : 0,
				},
			],
		} as DesignProps);

		setOpenMenu(null);
	}

	return (
		<div className="space-y-2 rounded-xl bg-slate-200  p-4">
			<h3 className="text-xl font-semibold">Former</h3>
			<div className="grid grid-cols-[repeat(2,1fr)] gap-1">
				{shapes.map((shape) => (
					<button
						onClick={() => addShape(shape.value)}
						key={shape.value}
						className="w-full whitespace-nowrap rounded-lg bg-white p-4 text-center text-2xl"
					>
						{shape.icon}
					</button>
				))}
			</div>
		</div>
	);
}
