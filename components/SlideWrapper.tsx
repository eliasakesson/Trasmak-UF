export default function SlideWrapper({
	index,
	hovering,
	children,
}: {
	index: number;
	hovering: number | null;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`absolute w-full transition-all duration-300 
            ${hovering === index ? "opacity-100" : "pointer-events-none opacity-0"}
            ${hovering === null || hovering === index ? "transform-none" : hovering! > index ? "-translate-x-24" : "translate-x-24"}
            `}
		>
			{children}
		</div>
	);
}
