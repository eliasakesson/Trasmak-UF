import { DesignerContext } from "@/pages/designer";
import { useContext } from "react";
import defaultDesign from "@/data/defaultdesign.json";
import { DesignProps, ObjectProps } from "@/utils/designer/Interfaces";
import { ToolBarContext } from "./ToolBar";
import { GetObjectDimensions } from "@/utils/designer/Helper";

export default function TextPopup() {
	const fonts = [
		{ value: "cinzel", text: "Cinzel" },
		{ value: "dancing script", text: "Dancing Script" },
		{ value: "comfortaa", text: "Comfortaa" },
		{ value: "courgette", text: "Courgette" },
		{ value: "sono", text: "Sono" },
		{ value: "whisper", text: "Whisper" },
		{
			value: "plus jakarta sans",
			text: "Plus Jakarta Sans",
		},
		{ value: "courier new", text: "Courier New" },
		{
			value: "times new roman",
			text: "Times New Roman",
		},
		{ value: "arial", text: "Arial" },
	];

	const { currentDesign, setCurrentDesign, trayObject } =
		useContext(DesignerContext);
	const { setOpenMenu } = useContext(ToolBarContext);

	function addText(font: string) {
		const id =
			currentDesign.objects.length > 0
				? Math.max(...currentDesign.objects.map((o) => o.id)) + 1
				: 1;

		const order =
			Math.max(...currentDesign.objects.map((obj) => obj.order), 0) + 1;

		let object = {
			...defaultDesign["text"],
			font,
			id,
			order,
		} as ObjectProps;

		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d");

		if (ctx && trayObject) {
			const { width, height } = GetObjectDimensions(
				ctx,
				trayObject,
				object,
			);

			const x = 0.5 - width / (trayObject.width ?? 1) / 2;
			const y = 0.5 - height / (trayObject.height ?? 1) / 2;

			object = {
				...object,
				x,
				y,
			};
		}

		setCurrentDesign({
			...currentDesign,
			objects: [...currentDesign.objects, object],
		} as DesignProps);

		setOpenMenu(null);
	}

	return (
		<div className="space-y-2 rounded-xl bg-slate-200 p-4">
			<h3 className="text-xl font-semibold">Texter</h3>
			<div className="grid grid-cols-[repeat(2,1fr)] gap-1">
				{fonts.map((font) => (
					<button
						onClick={() => addText(font.value)}
						key={font.value}
						className="w-full whitespace-nowrap rounded-lg bg-white px-4 py-1 text-center"
						style={{ fontFamily: font.value }}
					>
						{font.text}
					</button>
				))}
			</div>
		</div>
	);
}
