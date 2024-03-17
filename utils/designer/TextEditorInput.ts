import { GetObjectDimensions } from "./Helper";
import { ObjectProps, SelectionProps } from "./Interfaces";

export default function CanvasTextEditorInput(
	canvas: HTMLCanvasElement,
	trayObject: ObjectProps,
	selection: SelectionProps,
	setSelection: (obj: SelectionProps) => void,
	object: ObjectProps,
	setObject: (obj: ObjectProps) => void
) {
	const input = document.createElement("textarea");
	const ctx = canvas.getContext("2d");
	const rect = canvas.getBoundingClientRect();
	if (!ctx || !rect) return;

	const { x, y, width, height } = GetObjectDimensions(
		ctx,
		trayObject,
		object
	);

	// Set the initial value of the input to the current text
	input.value = object.content ?? "";
	input.selectionStart = selection.start ?? input.value.length;
	input.selectionEnd = selection.end ?? input.value.length;
	input.style.position = "absolute";
	input.style.left = `${x * (rect.width / canvas.width) - 8}px`;
	input.style.top = `${y * (rect.height / canvas.height) - 16}px`;
	input.style.width = `${width * (rect.width / canvas.width)}px`;
	input.style.height = `${height * (rect.height / canvas.height)}px`;
	input.style.padding = "8px";
	input.style.boxSizing = "content-box";
	input.style.fontSize = `${
		(object.size ?? 0) * (rect.width / canvas.width)
	}px`;
	input.style.fontFamily = object.font ?? "sans-serif";
	input.style.verticalAlign = "top";
	input.style.outline = "none";
	input.style.border = "none";
	input.style.background = "transparent";
	input.style.webkitTextFillColor = "transparent";
	input.style.resize = "none";
	input.style.overflow = "hidden";
	// Append the input to the body
	(canvas.parentNode || document.body).appendChild(input);

	// Focus on the input and select its text
	input.focus();

	// Event listener to handle the input changes
	input.addEventListener("input", (e) => {
		setSelection({
			start: input?.selectionStart || null,
			end: input?.selectionEnd || null,
		});

		const target = e.target as HTMLTextAreaElement;
		setObject({
			...object,
			content: target.value,
		});
	});

	return input;
}
