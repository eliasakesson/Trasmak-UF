import { DesignerContext } from "@/pages/designer";
import { useCallback, useContext } from "react";
import defaultDesign from "@/data/defaultdesign.json";
import { DesignProps } from "@/utils/design/Interfaces";
import { ToolBarContext } from "./ToolBar";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

export default function ImagePopup() {
	const { currentDesign, setCurrentDesign, traySize } =
		useContext(DesignerContext);
	const { setOpenMenu } = useContext(ToolBarContext);

	function addImage(image: HTMLImageElement) {
		const id =
			currentDesign.objects.length > 0
				? Math.max(...currentDesign.objects.map((o) => o.id)) + 1
				: 1;

		const order =
			Math.max(...currentDesign.objects.map((obj) => obj.order), 0) + 1;

		const aspectRatio =
			image.width / image.height / (traySize.width / traySize.height);
		const width = aspectRatio > 1 ? 0.5 : aspectRatio * 0.5;
		const height = aspectRatio > 1 ? aspectRatio * 0.5 : 0.5;

		const x = 0.5 - width / 2;
		const y = 0.5 - height / 2;

		setCurrentDesign({
			...currentDesign,
			objects: [
				...currentDesign.objects,
				{
					...defaultDesign["image"],
					content: image.src,
					image,
					id,
					order,
					x,
					y,
					width,
					height,
				},
			],
		} as DesignProps);

		setOpenMenu(null);
	}

	return (
		<div className="space-y-2 rounded-xl bg-slate-200 p-4">
			<h3 className="text-xl font-semibold">Bilder</h3>
			<ImageInput label="Picture" setImage={addImage} />
		</div>
	);
}

function ImageInput({
	label,
	setImage,
}: {
	label: string;
	setImage: (image: HTMLImageElement) => void;
}) {
	const onDrop = useCallback(
		(acceptedFiles: any) => {
			if (acceptedFiles && acceptedFiles.length > 0) {
				const reader = new FileReader();

				reader.onloadend = () => {
					const img = new Image();
					img.src = reader.result as string;

					img.onload = () => {
						const resolution = img.width * img.height;
						if (resolution < 250000) {
							toast.error(
								"Bilden är för lågupplöst. Välj en bild med högre upplösning.",
							);
						} else {
							console.log(reader.result);
							setImage(img);
						}
					};
				};

				reader.readAsDataURL(acceptedFiles[0]);
			}
		},
		[setImage],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		noClick: true,
	});

	return (
		<div className="flex grow flex-col gap-1">
			<label
				{...getRootProps()}
				className="h-16 cursor-pointer rounded-md border border-gray-300 px-4 hover:border-gray-200"
				htmlFor={label}
			>
				<div className="flex h-full items-center justify-center gap-2">
					<svg
						className="h-6 w-6 text-muted_light"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 16"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
						/>
					</svg>
					<div>
						<p className="whitespace-nowrap text-sm font-semibold text-muted_light">
							Klicka för att ladda upp bild
						</p>
						<p className="whitespace-nowrap text-sm text-muted_light">
							eller dra och släpp en bild här
						</p>
					</div>
				</div>
				<input
					{...getInputProps()}
					name={label}
					id={label}
					className="hidden"
				/>
			</label>
		</div>
	);
}
