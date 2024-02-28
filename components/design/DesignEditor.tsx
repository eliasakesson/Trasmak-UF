import {
	HTMLProps,
	LegacyRef,
	RefObject,
	createContext,
	forwardRef,
	useCallback,
	useContext,
} from "react";
import { DesignProps, ObjectProps } from "../../utils/design/Interfaces";
import debounce from "lodash.debounce";

import { FaTrash, FaExpand } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { GetObjectDimensions } from "../../utils/design/Helper";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import useIsAdmin from "@/utils/useIsAdmin";
import { DesignerContext } from "@/pages/designer";
import {
	TbChevronDownLeft,
	TbChevronDownRight,
	TbChevronUpLeft,
	TbChevronUpRight,
	TbSquareChevronDown,
	TbSquareChevronLeft,
	TbSquareChevronRight,
	TbSquareChevronUp,
	TbStackPop,
	TbStackPush,
} from "react-icons/tb";

const SelectedObjectContext = createContext({
	object: null as ObjectProps | null,
	setObject: (obj: ObjectProps) => {},
});

export const DesignEditor = forwardRef<HTMLElement, HTMLProps<HTMLDivElement>>(
	(props, ref) => {
		const {
			currentDesign,
			setCurrentDesign,
			selectedObjectID,
			setSelectedObjectID,
		} = useContext(DesignerContext);
		const [user] = useAuthState(auth);
		const isAdmin = useIsAdmin(user);

		const object =
			currentDesign?.objects?.find(
				(obj) => obj.id === selectedObjectID,
			) ?? null;

		function setObject(obj: ObjectProps) {
			const objects = currentDesign.objects.map((o: ObjectProps) => {
				if (o.id === obj.id) {
					return obj;
				}
				return o;
			});
			setCurrentDesign({ ...currentDesign, objects });
		}

		function removeObject() {
			const objects = currentDesign.objects.filter(
				(o) => o.id !== selectedObjectID,
			);
			setCurrentDesign({ ...currentDesign, objects });
			setSelectedObjectID(null);
		}

		return (
			<SelectedObjectContext.Provider value={{ object, setObject }}>
				<div
					ref={ref as LegacyRef<HTMLDivElement> | undefined}
					style={!object ? { display: "none" } : {}}
					className="absolute z-30 flex max-w-full flex-col gap-2 rounded-md border bg-white p-4"
					id="editor"
				>
					{object && (
						<>
							<div className="flex flex-wrap items-center gap-2">
								{object?.type === "image" && (
									<ImageInput
										label="Bildkälla"
										objKey="content"
									/>
								)}
								{object?.type === "rectangle" && (
									<ColorInput label="Färg" objKey="color" />
								)}
								{object.type === "text" && (
									<TextArea
										label="Text"
										objKey="content"
										className="h-16"
									/>
								)}
								<div className="relative flex h-16 flex-wrap items-center justify-center gap-4 rounded-md border border-gray-300 px-4">
									{object?.type !== "text" && (
										<button
											onClick={() =>
												setObject({
													...object,
													x: 0,
													y: 0,
													width: 1,
													height: 1,
												})
											}
										>
											<FaExpand />
										</button>
									)}
									<button
										onClick={() =>
											ChangeOrder(
												currentDesign,
												setCurrentDesign,
												object,
												1,
											)
										}
									>
										<TbStackPop className="text-xl" />
									</button>
									<button
										onClick={() =>
											ChangeOrder(
												currentDesign,
												setCurrentDesign,
												object,
												-1,
											)
										}
									>
										<TbStackPush className="text-xl" />
									</button>
									<button onClick={() => removeObject()}>
										<FaTrash />
									</button>
								</div>
								<DirectionInput
									label="Riktning"
									objKeyX="imageX"
									objKeyY="imageY"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								{object?.type === "text" && (
									<ColorInput label="Färg" objKey="color" />
								)}
								<NumberInput
									label="Textstorlek (px)"
									objKey="size"
									range={{ min: 1, max: 250, step: 1 }}
								/>
								<Select
									label="Font"
									objKey="font"
									options={[
										{ value: "cinzel", text: "Cinzel" },
										{
											value: "dancing script",
											text: "Dancing Script",
										},
										{
											value: "comfortaa",
											text: "Comfortaa",
										},
										{
											value: "courgette",
											text: "Courgette",
										},
										{ value: "sono", text: "Sono" },
										{ value: "whisper", text: "Whisper" },
										{
											value: "plus jakarta sans",
											text: "Plus Jakarta Sans",
										},
										{
											value: "courier new",
											text: "Courier New",
										},
										{
											value: "times new roman",
											text: "Times New Roman",
										},
										{ value: "arial", text: "Arial" },
									]}
								/>
								<Select
									label="Bildjustering"
									objKey="fit"
									options={[
										{ value: "cover", text: "Inzoomad" },
										{
											value: "contain",
											text: "Utzoomad",
										},
										{ value: "fill", text: "Sträckt" },
									]}
								/>
								<NumberInput
									label="Rundning (%)"
									objKey="radius"
									range={{ min: 0, max: 0.5, step: 0.01 }}
									percentage
								/>
								<NumberInput
									label="Zoom (%)"
									objKey="zoom"
									range={{ min: 1, max: 2.5, step: 0.01 }}
									percentage
								/>
								{isAdmin && (
									<CheckboxInput
										label="Template"
										objKey="template"
									/>
								)}
							</div>
						</>
					)}
				</div>
			</SelectedObjectContext.Provider>
		);
	},
);

DesignEditor.displayName = "DesignEditor";

function ChangeOrder(
	design: DesignProps,
	setDesign: (design: any) => void,
	object: ObjectProps,
	order: number,
) {
	const maxOrder = Math.max(...design.objects.map((o) => o.order));
	const minOrder = Math.min(...design.objects.map((o) => o.order));

	const selectedObject = design.objects.find((obj) => obj.id === object.id);
	if (!selectedObject) return;

	if (order > 0 && selectedObject.order === maxOrder) return;
	if (order < 0 && selectedObject.order === minOrder) return;

	setDesign((d: DesignProps) => {
		if (!d) return d;
		const objects = d.objects.map((obj: ObjectProps) => {
			if (order > 0) {
				if (obj.id === object.id) {
					return { ...obj, order: obj.order + 1 };
				}
				if (obj.order === selectedObject.order + 1) {
					return { ...obj, order: obj.order - 1 };
				}
			} else {
				if (obj.id === object.id) {
					return { ...obj, order: obj.order - 1 };
				}
				if (obj.order === selectedObject.order - 1) {
					return { ...obj, order: obj.order + 1 };
				}
			}

			return obj;
		});

		return { ...d, objects };
	});
}

function TextArea({
	label,
	objKey,
	className,
}: {
	label: string;
	objKey: "content";
	className?: string;
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className={`flex grow flex-col gap-1  ${className}`}>
			<label className="sr-only" htmlFor={label}>
				{label}
			</label>
			<textarea
				name={label}
				id={label}
				className="h-full resize-none rounded-md border border-gray-300 p-2"
				rows={1}
				placeholder={label}
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}
			/>
		</div>
	);
}

function TextInput({ label, objKey }: { label: string; objKey: "content" }) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="flex grow flex-col gap-1">
			<Label label={label} />
			<input
				type="text"
				name={label}
				id={label}
				className="h-full rounded-md border border-gray-300 p-2"
				value={(objKey in object ? object[objKey] : "") as string}
				onChange={(e) =>
					setObject({
						...object,
						[objKey]: e.target.value,
					})
				}
			/>
		</div>
	);
}

function DirectionInput({
	label,
	objKeyX,
	objKeyY,
}: {
	label: string;
	objKeyX: "imageX";
	objKeyY: "imageY";
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || object.type !== "image") return null;

	function setDirection(x: number, y: number) {
		setObject({
			...(object as ObjectProps),
			[objKeyX]: x,
			[objKeyY]: y,
		});
	}

	const x = (object[objKeyX] ?? 0.5) as number;
	const y = (object[objKeyY] ?? 0.5) as number;

	return (
		<div className="grid aspect-square grid-cols-3 grid-rows-3">
			<button
				className={x === 0 && y === 0 ? "text-primary_light" : ""}
				onClick={() => setDirection(0, 0)}
			>
				<TbChevronUpLeft />
			</button>
			<button
				className={x === 0.5 && y === 0 ? "text-primary_light" : ""}
				onClick={() => setDirection(0.5, 0)}
			>
				<TbSquareChevronUp />
			</button>
			<button
				className={x === 1 && y === 0 ? "text-primary_light" : ""}
				onClick={() => setDirection(1, 0)}
			>
				<TbChevronUpRight />
			</button>
			<button
				className={x === 0 && y === 0.5 ? "text-primary_light" : ""}
				onClick={() => setDirection(0, 0.5)}
			>
				<TbSquareChevronLeft />
			</button>
			<button
				className={
					(x === 0.5 && y === 0.5 ? "bg-primary_light" : "bg-black") +
					" m-1 rounded-full"
				}
				onClick={() => setDirection(0.5, 0.5)}
			></button>
			<button
				className={x === 1 && y === 0.5 ? "text-primary_light" : ""}
				onClick={() => setDirection(1, 0.5)}
			>
				<TbSquareChevronRight />
			</button>
			<button
				className={x === 0 && y === 1 ? "text-primary_light" : ""}
				onClick={() => setDirection(0, 1)}
			>
				<TbChevronDownLeft />
			</button>
			<button
				className={x === 0.5 && y === 1 ? "text-primary_light" : ""}
				onClick={() => setDirection(0.5, 1)}
			>
				<TbSquareChevronDown />
			</button>
			<button
				className={x === 1 && y === 1 ? "text-primary_light" : ""}
				onClick={() => setDirection(1, 1)}
			>
				<TbChevronDownRight />
			</button>
		</div>
	);
}

function ImageInput({ label, objKey }: { label: string; objKey: "content" }) {
	const { object, setObject } = useContext(SelectedObjectContext);

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
							setObject({
								...(object as ObjectProps),
								[objKey]: reader.result as string,
							});
						}
					};
				};

				reader.readAsDataURL(acceptedFiles[0]);
			}
		},
		[objKey, object, setObject],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		noClick: true,
	});

	if (!object || !(objKey in object)) return null;

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

function NumberInput({
	label,
	objKey,
	range,
	percentage = false,
}: {
	label: string;
	objKey: "radius" | "size" | "zoom";
	range: { min: number; max: number; step: number };
	percentage?: boolean;
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (
		!object ||
		(!(objKey in object) && object.type !== "image") ||
		(object.type !== "text" && objKey !== "zoom" && objKey !== "radius")
	)
		return null;

	function setValue(value: string, percentage = false) {
		const roundedValue = value ? Math.round(+value * 100) / 100 : "";
		setObject({
			...(object as ObjectProps),
			[objKey]: roundedValue
				? percentage
					? +roundedValue / 100
					: roundedValue
				: 0,
		});
	}

	const value = (object[objKey] ?? range.min) as number;
	const displayValue = value ? (percentage ? value * 100 : value) : "";

	return (
		<div className="relative flex grow items-center gap-2 rounded-md border border-gray-300 px-2 pt-3">
			<Label label={label} />
			<input
				type="range"
				name={label}
				id={label + "range"}
				min={range.min}
				max={range.max}
				step={range.step}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<input
				type="text"
				name={label}
				id={label}
				min={range.min * (percentage ? 100 : 1)}
				max={range.max * (percentage ? 100 : 1)}
				step={range.step * (percentage ? 100 : 1)}
				className="h-full w-[3ch] py-2 outline-none"
				placeholder="0"
				value={displayValue}
				onChange={(e) => setValue(e.target.value, percentage)}
			/>
		</div>
	);
}

function ColorInput({ label, objKey }: { label: string; objKey: "color" }) {
	const { object, setObject } = useContext(SelectedObjectContext);

	const debouncedSetObject = debounce((value) => {
		setObject(value);
	}, 10);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="relative flex aspect-square min-w-[48px] flex-col gap-1">
			<Label label={label} />
			<div className="relative h-full w-full rounded-md border border-gray-300">
				<input
					type="color"
					name={label}
					id={label}
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					value={object[objKey] as string}
					onChange={(e) =>
						debouncedSetObject({
							...(object as ObjectProps),
							[objKey]: e.target.value,
						})
					}
				/>
				<div
					className="pointer-events-none absolute inset-0 rounded-[4px]"
					style={{
						backgroundColor: object[objKey] as string,
					}}
				></div>
			</div>
		</div>
	);
}

function CheckboxInput({
	label,
	objKey,
}: {
	label: string;
	objKey: "template";
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object) return null;

	return (
		<div className="relative flex grow flex-col gap-1">
			<Label label={label} />
			<input
				type="checkbox"
				name={label}
				id={label}
				className="h-full rounded-md border border-gray-300 p-2"
				checked={object[objKey] as boolean}
				onChange={(e) =>
					setObject({
						...object,
						[objKey]: e.target.checked,
					})
				}
			/>
		</div>
	);
}

function Select({
	label,
	objKey,
	options,
}: {
	label: string;
	objKey: "font" | "fit";
	options: { value: string; text: string }[];
}) {
	const { object, setObject } = useContext(SelectedObjectContext);

	if (!object || !(objKey in object)) return null;

	return (
		<div className="relative flex grow flex-col gap-1">
			<Label label={label} />
			<select
				name={label}
				id={label}
				className="h-full rounded-md border border-gray-300 px-1 pt-3"
				style={objKey === "font" ? { fontFamily: object[objKey] } : {}}
				value={object[objKey]}
				onChange={(e) =>
					setObject({
						...(object as ObjectProps),
						[objKey]: e.target.value,
					})
				}
			>
				{options?.map((option, i) => (
					<option
						key={i}
						value={option.value}
						style={
							objKey === "font"
								? { fontFamily: option.value }
								: {}
						}
					>
						{option.text}
					</option>
				))}
			</select>
		</div>
	);
}

function Label({ label }: { label: string }) {
	return (
		<label
			className="absolute left-2 top-1 text-xs text-muted"
			htmlFor={label}
		>
			{label}
		</label>
	);
}

export function MoveDesignEditor(
	designEditorRef: RefObject<HTMLDivElement>,
	canvas: HTMLCanvasElement,
	trayObject: ObjectProps,
	selectedObject: ObjectProps | undefined,
) {
	if (!designEditorRef.current || !selectedObject) return;

	const ctx = canvas.getContext("2d");
	const rect = canvas.getBoundingClientRect();
	if (!ctx || !rect) return;

	const { x, y, height } = GetObjectDimensions(
		ctx,
		trayObject,
		selectedObject,
	);

	let left = x * (rect.width / canvas.width) - 8;
	let top = (y + height) * (rect.height / canvas.height) + 16;

	if (left > rect.width) {
		left = rect.width;
	} else if (
		rect.left + left + designEditorRef.current.offsetWidth >
		window.innerWidth
	) {
		left =
			window.innerWidth -
			rect.left -
			designEditorRef.current.offsetWidth -
			16;
	}

	if (top > rect.height) {
		top = rect.height;
	}

	designEditorRef.current.style.left = `${left}px`;
	designEditorRef.current.style.top = `${top}px`;
}
