import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { DesignerContext } from "@/pages/designer";
import AddToCart from "@/utils/designer/CartHelper";
import { useShoppingCart } from "use-shopping-cart";

import { MdAddShoppingCart, MdBugReport } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import {
	FaHeart,
	FaInfo,
	FaQuestion,
	FaQuestionCircle,
	FaSave,
} from "react-icons/fa";
import { HiTemplate } from "react-icons/hi";
import { FaI } from "react-icons/fa6";
import toast from "react-hot-toast";
import { SaveDesign } from "@/utils/designer/DesignSaver";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";

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
	const router = useRouter();
	const { currentDesign } = useContext(DesignerContext);

	return (
		<div className="absolute right-4 top-4 flex gap-4 lg:bottom-8 lg:left-8 lg:right-auto lg:top-auto lg:flex-col-reverse lg:items-start">
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
				onClick={() => router.replace("/designer#saved-designs")}
			>
				<FaHeart className="text-2xl" />
			</ButtonWithTooltip>
			<ButtonWithTooltip
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Mallar"
				onClick={() => router.replace("/designer#templates")}
			>
				<HiTemplate className="text-2xl" />
			</ButtonWithTooltip>
		</div>
	);
}

function TopLeftButtons() {
	return (
		<div className="absolute left-4 top-4 flex flex-col items-start gap-4 lg:left-8 lg:top-8">
			{/* <LinkWithTooltip
				href="/designer?t=guide"
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Visa guide"
			>
				<FaQuestionCircle className="text-2xl" />
			</LinkWithTooltip> */}
			<LinkWithTooltip
				href="/bug-report"
				position="right"
				className="rounded-lg bg-slate-400 p-4 text-2xl text-white transition-colors hover:bg-slate-500"
				tooltip="Rapportera bugg"
			>
				<MdBugReport className="text-2xl" />
			</LinkWithTooltip>
		</div>
	);
}

function BottomRightButtons() {
	const { currentDesign, products } = useContext(DesignerContext);

	const { cartDetails, addItem } = useShoppingCart();
	const isAddingToCart = useRef(false);
	const lastAddedImageURL = useRef<string | null>(null);

	useEffect(() => {
		lastAddedImageURL.current = null;
	}, [currentDesign]);

	return (
		<div className="absolute bottom-2 left-4 right-4 flex flex-row-reverse items-end justify-between gap-4 lg:pointer-events-none lg:bottom-8 lg:right-8 lg:flex-col-reverse">
			<button
				className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:pointer-events-auto"
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
				className={`${position === "left" ? "right-full group-hover:-translate-x-4" : "left-full group-hover:translate-x-4"} pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-400 px-3 py-1 text-lg font-semibold opacity-0 transition-all group-hover:opacity-100 group-hover:delay-100 lg:block`}
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
			shallow
		>
			{children}
			<span
				className={`${position === "left" ? "right-full group-hover:-translate-x-4" : "left-full group-hover:translate-x-4"} pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-400 px-3 py-1 text-lg font-semibold opacity-0 transition-all group-hover:opacity-100 group-hover:delay-100 lg:block`}
			>
				{tooltip}
			</span>
		</Link>
	);
}
