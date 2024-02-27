import Link from "next/link";
import { useContext, useRef } from "react";
import { DesignerContext } from "@/pages/designer";
import AddToCart from "@/utils/design/CartHelper";
import { useShoppingCart } from "use-shopping-cart";

import { MdAddShoppingCart } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import { FaHeart, FaInfo, FaSave } from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaI } from "react-icons/fa6";
import toast from "react-hot-toast";
import { SaveDesign } from "@/utils/design/DesignSaver";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function DesignerButtons() {
	return (
		<>
			<BottomRightButtons />
			<BottomLeftButtons />
			<TopLeftButtons />
		</>
	);
}

function BottomLeftButtons() {
	const [user] = useAuthState(auth);
	const { currentDesign } = useContext(DesignerContext);

	return (
		<div className="absolute bottom-8 left-8 flex flex-col-reverse items-start gap-4">
			<ButtonWithTooltip
				className="flex items-center gap-2 rounded-lg bg-primary p-4 font-semibold text-white transition-colors hover:bg-primary_light disabled:hover:bg-primary_dark"
				position="right"
				tooltip={
					user ? "Spara design" : "Logga in för att spara design"
				}
				disabled={!user}
				onClick={() =>
					user &&
					toast.promise(SaveDesign(currentDesign, user), {
						loading: "Sparar design...",
						success: "Design sparad",
						error: "Fel vid sparning",
					})
				}
			>
				<FaSave className="text-2xl" />
			</ButtonWithTooltip>
			<ButtonWithTooltip
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip={
					user
						? "Mina sparade designs"
						: "Logga in för att se sparade designs"
				}
				disabled={!user}
			>
				<FaHeart className="text-2xl" />
			</ButtonWithTooltip>
			<ButtonWithTooltip
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Mallar"
			>
				<HiTemplate className="text-2xl" />
			</ButtonWithTooltip>
		</div>
	);
}

function TopLeftButtons() {
	return (
		<div className="absolute left-8 top-8 flex flex-col items-start gap-4">
			<ButtonWithTooltip
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Visa guide"
			>
				<FaInfo className="text-2xl" />
			</ButtonWithTooltip>
		</div>
	);
}

function BottomRightButtons() {
	const { currentDesign, products } = useContext(DesignerContext);

	const { cartDetails, addItem } = useShoppingCart();
	const isAddingToCart = useRef(false);
	const lastAddedImageURL = useRef<string | null>(null);

	return (
		<div className="pointer-events-none absolute bottom-8 right-8 flex flex-col-reverse items-end gap-4">
			<button
				className="pointer-events-auto flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light"
				onClick={() =>
					AddToCart(
						products,
						currentDesign,
						cartDetails,
						addItem,
						isAddingToCart,
						lastAddedImageURL,
					)
				}
			>
				<MdAddShoppingCart className="text-2xl" />
				Lägg till i kundvagn
			</button>
			<LinkWithTooltip
				href={`/products/${currentDesign.id}`}
				position="left"
				className="pointer-events-auto rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Gå till produkt"
			>
				<CiShoppingTag className="text-2xl" />
			</LinkWithTooltip>
		</div>
	);
}

function ButtonWithTooltip({
	children,
	tooltip,
	position,
	...props
}: {
	children: React.ReactNode;
	tooltip: string;
	position: "right" | "left";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			type="button"
			className={`${props.className} group relative`}
		>
			{children}
			<span
				className={`${position === "left" ? "right-full group-hover:-translate-x-4" : "left-full group-hover:translate-x-4"} pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-400 px-3 py-1 text-lg font-semibold opacity-0 transition-all group-hover:opacity-100 group-hover:delay-100`}
			>
				{tooltip}
			</span>
		</button>
	);
}

function LinkWithTooltip({
	children,
	tooltip,
	href,
	position,
	className,
}: {
	children: React.ReactNode;
	tooltip: string;
	href: string;
	position: "right" | "left";
	className?: string;
}) {
	return (
		<Link
			href={href}
			type="button"
			className={`${className} group relative`}
		>
			{children}
			<span
				className={`${position === "left" ? "right-full group-hover:-translate-x-4" : "left-full group-hover:translate-x-4"} pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-400 px-3 py-1 text-lg font-semibold opacity-0 transition-all group-hover:opacity-100 group-hover:delay-100`}
			>
				{tooltip}
			</span>
		</Link>
	);
}