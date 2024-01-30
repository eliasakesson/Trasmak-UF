import Link from "next/link";
import Image from "next/image";
import {
	useEffect,
	useState,
	forwardRef,
	useRef,
	createContext,
	useContext,
} from "react";
import {
	FaShoppingCart,
	FaSearch,
	FaBars,
	FaUser,
	FaSignOutAlt,
	FaPlus,
	FaExclamation,
} from "react-icons/fa";
import {
	RiFunctionFill,
	RiGuideFill,
	RiImageFill,
	RiPencilFill,
	RiStackFill,
	RiStarFill,
	RiVipCrownFill,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { GoLaw } from "react-icons/go";
import { BsChevronDown } from "react-icons/bs";
import { motion, useAnimationControls } from "framer-motion";
import { useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { useRouter } from "next/router";
import { FaX } from "react-icons/fa6";
import { signInWithGoogle } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import GetConfig from "@/utils/getConfig";
import { useWindowSize } from "@/utils/hooks";
import { User } from "firebase/auth";
import SlideWrapper from "./SlideWrapper";

const Header = () => {
	return (
		<>
			<Announcement />
			<div className="sticky top-0 z-50">
				<Navbar />
			</div>
		</>
	);
};

function Announcement() {
	const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);

	useEffect(() => {
		GetConfig()
			.then((config) => {
				if (config?.freeShippingThreshold) {
					setFreeShippingThreshold(config.freeShippingThreshold);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<div className="bg-primary py-2 text-white">
			<div className="container mx-auto flex items-center justify-center">
				{freeShippingThreshold > 0 ? (
					<p className="text-center text-sm font-semibold">
						FRI FRAKT VID KÖP ÖVER {freeShippingThreshold / 100} KR
					</p>
				) : (
					"‎"
				)}
			</div>
		</div>
	);
}

function Navbar() {
	return (
		<div className="z-20 border-b bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
				<div className="flex flex-1 gap-4 md:hidden">
					<HamburgerMenu />
				</div>
				<div className="flex-[2] md:flex-1">
					<Link
						href="/"
						className="flex items-center justify-center gap-4 md:w-fit md:justify-start"
					>
						<Image
							src="/images/logo.png"
							alt="TRÄSMAK"
							width={220}
							height={60}
						/>
					</Link>
				</div>
				<div className="hidden items-center md:flex">
					<Navigation />
				</div>
				<div className="flex flex-1 items-center justify-end gap-6">
					<SearchButton />
					<UserButton />
					<CartButton />
				</div>
			</div>
		</div>
	);
}

const HamburgerContext = createContext<{
	isMenuOpen: boolean;
	setIsMenuOpen: (open: boolean) => void;
}>({
	isMenuOpen: false,
	setIsMenuOpen: () => {},
});

function HamburgerMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [user] = useAuthState(auth);

	const controls = useAnimationControls();

	useEffect(() => {
		if (isMenuOpen) {
			controls.start({ translateX: 0, opacity: 1 });
		} else {
			controls.start({ translateX: "-100%", opacity: 0 });
		}
	}, [isMenuOpen, controls]);

	return (
		<HamburgerContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
			<button
				aria-label="Open menu"
				onClick={() => setIsMenuOpen((open) => !open)}
				className="text-gray-700 hover:text-gray-900 focus:outline-none"
			>
				{isMenuOpen ? (
					<FaX className="h-6 w-6" />
				) : (
					<FaBars className="h-6 w-6" />
				)}
			</button>
			<motion.div
				initial={{ translateX: "-100%", opacity: 0 }}
				animate={controls}
				className="absolute left-0 top-[73px] z-40 flex h-[calc(100vh-73px)] w-80 flex-col space-y-2 border-r-2 border-gray-300 bg-white px-4 pb-[52px] pt-4"
			>
				<DesignNav />
				<div className="border-b"></div>
				<NavItem
					title="Alla produkter"
					description="Se alla våra produkter"
					Icon={RiStackFill}
					href="/products"
				/>
				<div className="border-b"></div>
				<MoreNav />

				<div className="relative flex flex-1 flex-col justify-end">
					<div className="sticky bottom-4 flex flex-col gap-2">
						<UserButtons
							user={user}
							onClick={() => setIsMenuOpen(false)}
						/>
					</div>
				</div>
			</motion.div>
		</HamburgerContext.Provider>
	);
}

function SearchButton() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<>
			{isSearchOpen ? (
				<Search
					buttons={
						<button
							onClick={() => setIsSearchOpen(false)}
							className="h-5 w-5 text-gray-400"
						>
							<FaPlus className="h-full w-full rotate-45" />
						</button>
					}
				/>
			) : (
				<button
					aria-label="Open search"
					onClick={() => setIsSearchOpen((open) => !open)}
					className="hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none md:block"
				>
					<FaSearch className="h-6 w-6" />
				</button>
			)}
		</>
	);
}

function Search({
	setHamburgerMenuOpen,
	buttons,
}: {
	setHamburgerMenuOpen?: any;
	buttons?: React.ReactNode;
}) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [products, setProducts] = useState([]);

	const router = useRouter();
	const { width } = useWindowSize();

	useEffect(() => {
		GetProducts().then((products) => setProducts(products as any));
	}, []);

	return (
		<div className="relative w-96 max-w-full">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setIsSearchOpen(false);
					setHamburgerMenuOpen?.(false);
					router.push(`/products?search_input=${searchInput}`);
				}}
			>
				<input
					type="text"
					placeholder="Sök"
					onFocus={() => setIsSearchOpen(true)}
					onBlur={() => setIsSearchOpen(false)}
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</form>
			<div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-3">
				<Link
					aria-label="Search"
					href={`/products?serach_input=${searchInput}`}
					onClick={() => {
						setIsSearchOpen(false);
						setHamburgerMenuOpen?.(false);
					}}
				>
					<FaSearch className="h-5 w-5 text-gray-400" />
				</Link>
				{buttons}
			</div>
			<div
				onPointerDown={(e) => e.preventDefault()}
				className={`${
					isSearchOpen ? "" : "hidden"
				} absolute z-40 mt-2 w-full space-y-2 rounded-md border bg-white p-4`}
			>
				<span className="font-semibold text-muted_light">
					Andra har sökt efter
				</span>
				<ul className="flex flex-col">
					{products
						?.filter(
							(product: any) =>
								!searchInput ||
								product.name
									.toLowerCase()
									.includes(searchInput.toLowerCase()),
						)
						.slice(0, 3)
						.map((product: any) => (
							<li key={product.id}>
								<Link
									aria-label={`Search for ${product.name}`}
									href={`/${
										width >= 768 ? "design?d=" : "products/"
									}${product.id.substring(
										6,
										product.id.length,
									)}`}
									onClick={() => {
										setIsSearchOpen(false);
										setHamburgerMenuOpen?.(false);
									}}
								>
									<div className="flex w-full items-center gap-4 py-2">
										<img
											src={product.image}
											alt={product.name}
											className="h-8 w-8 rounded-sm object-contain hue-rotate-[50deg] saturate-150"
										/>
										<span>{product.name}</span>
									</div>
								</Link>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}

function UserButton() {
	const [isOpen, setIsOpen] = useState(false);

	const controls = useAnimationControls();
	const innerControls = useAnimationControls();

	const [user] = useAuthState(auth);

	useEffect(() => {
		if (isOpen) {
			controls.start({ scaleY: 1, opacity: 1 });
			innerControls.start({
				opacity: 1,
				translateY: 0,
				transition: { delay: 0.1 },
			});
		} else {
			controls.start({ scaleY: 0, opacity: 0 });
			innerControls.start({
				opacity: 0,
				translateY: -20,
				transition: { duration: 0 },
			});
		}
	}, [isOpen]);

	return (
		<div className="relative hidden md:block">
			<div
				onClick={() => setIsOpen(false)}
				className={`${
					isOpen ? "" : "hidden"
				} fixed bottom-0 left-0 right-0 top-0 z-20`}
			></div>
			<button
				aria-label="User menu"
				className={`${
					user?.photoURL ? "" : "p-2"
				} text-gray-700 hover:text-gray-900 focus:outline-none`}
				onClick={() => setIsOpen((open) => !open)}
			>
				{user?.photoURL ? (
					<Image
						src={user.photoURL}
						alt=""
						width={32}
						height={32}
						className="rounded-full"
					/>
				) : (
					<FaUser className="h-6 w-6" />
				)}
			</button>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="absolute right-0 top-8 z-30 min-w-[256px] origin-top rounded-xl border bg-white"
			>
				<motion.div
					initial={{ opacity: 0, translateY: -20 }}
					animate={innerControls}
					className="space-y-4 p-4"
				>
					<span className="whitespace-nowrap text-xl font-semibold">
						{user ? "Min profil" : "Du är inte inloggad"}
					</span>
					<div className="flex flex-col gap-2">
						<UserButtons
							user={user}
							onClick={() => setIsOpen(false)}
						/>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}

function UserButtons({
	user,
	onClick,
}: {
	user: User | null | undefined;
	onClick: () => void;
}) {
	return user ? (
		<>
			<Link
				href="/profile"
				onClick={onClick}
				className="flex w-full items-center  gap-3 whitespace-nowrap rounded-lg border-2 px-4 py-2 text-left font-semibold transition-colors hover:bg-slate-100"
			>
				<FaUser size={16} />
				Min profil
			</Link>
			<button
				onClick={() => auth.signOut()}
				className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-left font-semibold transition-colors hover:bg-red-100"
			>
				<FaSignOutAlt size={16} />
				Logga ut
			</button>
		</>
	) : (
		<>
			<button
				onClick={signInWithGoogle}
				className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-4 py-2 font-semibold transition-colors hover:bg-slate-100"
			>
				<FcGoogle className="text-xl text-red-500" />
				Fortsätt med Google
			</button>
			<span className="text-center text-muted">eller</span>
			<Link
				href="/signup"
				onClick={onClick}
				className="w-full rounded-lg bg-primary px-4 py-[10px] text-center font-semibold text-white transition-colors hover:bg-primary_light"
			>
				Skapa konto
			</Link>
			<Link
				href="/login"
				onClick={onClick}
				className="w-full whitespace-nowrap rounded-lg border-2 px-4 py-2 text-center font-semibold transition-colors hover:bg-slate-100"
			>
				Logga in
			</Link>
		</>
	);
}

function CartButton() {
	const { formattedTotalPrice, cartCount, cartDetails } = useShoppingCart();

	const [isCartOpen, setIsCartOpen] = useState(false);

	const controls = useAnimationControls();
	const innerControls = useAnimationControls();

	useEffect(() => {
		if (isCartOpen) {
			controls.start({ scaleY: 1, opacity: 1 });
			innerControls.start({
				opacity: 1,
				translateY: 0,
				transition: { delay: 0.1 },
			});
		} else {
			controls.start({ scaleY: 0, opacity: 0 });
			innerControls.start({
				opacity: 0,
				translateY: -20,
				transition: { duration: 0 },
			});
		}
	}, [isCartOpen]);

	return (
		<div className="relative z-20">
			<div
				onClick={() => setIsCartOpen(false)}
				className={`${
					isCartOpen ? "" : "hidden"
				} fixed bottom-0 left-0 right-0 top-0 z-20`}
			></div>
			<button
				className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
				onClick={() => setIsCartOpen((open) => !open)}
			>
				<FaShoppingCart className="h-6 w-6" />
				<span className="absolute right-2 top-2 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-bold leading-none text-red-100">
					{cartCount}
				</span>
			</button>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="absolute right-0 top-8 z-30 min-w-[256px] origin-top rounded-xl border bg-white"
			>
				<motion.div
					initial={{ opacity: 0, translateY: -20 }}
					animate={innerControls}
					className="space-y-4 p-4"
				>
					<span className="whitespace-nowrap text-xl font-semibold">
						Min varukorg
						<span className="font-normal"> ({cartCount})</span>
					</span>
					<ul>
						{Object.entries(cartDetails ?? {}).map(
							([key, item]) => (
								<li
									key={key}
									className="flex items-center gap-4 border-b py-2"
								>
									<div className="h-fit overflow-hidden rounded-lg border bg-gray-100">
										<Image
											src={item.image ?? ""}
											alt={item.name}
											width={56}
											height={56}
											className="aspect-square object-contain hue-rotate-[50deg] saturate-150"
										/>
									</div>
									<div className="flex flex-col justify-center">
										<span className="max-w-[16ch] font-semibold">
											{item.name}
										</span>
										<span className="text-sm text-gray-600">
											{item.quantity} x{" "}
											{item.formattedPrice}
										</span>
									</div>
								</li>
							),
						)}
					</ul>
					<div className="flex gap-2">
						<span className="font-bold">Totalt:</span>
						<span>{formattedTotalPrice}</span>
					</div>
					<div className="flex gap-2">
						<Link
							href="/cart"
							onClick={() => setIsCartOpen(false)}
							className="w-full rounded-lg border-2 px-8 py-2 text-center font-semibold transition-colors hover:bg-slate-100"
						>
							Gå till varukorgen
						</Link>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}

function Navigation() {
	const [hovering, setHovering] = useState<number | null>(null);
	const [left, setLeft] = useState<number | null>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(
		null,
	);

	const refs = useRef<(HTMLUListElement | null)[]>([]);

	function onMouseEnter(index: number, e: any) {
		setHovering(index);
		setLeft(e.currentTarget.offsetLeft - 64);

		const ref = refs.current[index];
		if (ref) {
			setTimeout(() => {
				setSize({
					width: ref.offsetWidth + 32,
					height: ref.offsetHeight + 32,
				});
			}, 0);
		}
	}

	function onMouseLeave() {
		setHovering(null);
		setSize(null);
	}

	return (
		<nav className="relative" onMouseLeave={onMouseLeave}>
			<ul className="mx-auto flex max-w-7xl justify-center gap-8 px-4 md:justify-center lg:gap-12">
				<li
					className="cursor-pointer py-2 text-sm text-gray-600 hover:text-gray-800 lg:text-base"
					onMouseEnter={(e) => onMouseEnter(0, e)}
				>
					Designa din bricka
					<BsChevronDown className="ml-1 inline-block" />
				</li>
				<li
					className="cursor-pointer py-2 text-sm text-gray-600 hover:text-gray-800 lg:text-base"
					onMouseEnter={(e) => onMouseEnter(1, e)}
				>
					Våra produkter
					<BsChevronDown className="ml-1 inline-block" />
				</li>
				<li
					className="cursor-pointer py-2 text-sm text-gray-600 hover:text-gray-800 lg:text-base"
					onMouseEnter={(e) => onMouseEnter(2, e)}
				>
					Fler tjänster
					<BsChevronDown className="ml-1 inline-block" />
				</li>
			</ul>
			<div
				style={{
					left: left || 0,
					height: size?.height || 0,
					width: size?.width || 0,
				}}
				className={`absolute top-8 overflow-hidden rounded-md bg-white p-4 shadow-lg duration-300 ${hovering !== null ? "transition-all" : "pointer-events-none hidden"}`}
			>
				<SlideWrapper index={0} hovering={hovering}>
					<DesignNav ref={(element) => (refs.current[0] = element)} />
				</SlideWrapper>
				<SlideWrapper index={1} hovering={hovering}>
					<ProductsNav
						ref={(element) => (refs.current[1] = element)}
					/>
				</SlideWrapper>
				<SlideWrapper index={2} hovering={hovering}>
					<MoreNav ref={(element) => (refs.current[2] = element)} />
				</SlideWrapper>
			</div>
		</nav>
	);
}

const ProductsNav = forwardRef<HTMLUListElement>((props, ref) => {
	return (
		<ul
			ref={ref}
			className="grid w-full gap-1 md:w-max md:grid-cols-2 md:gap-4"
		>
			<li>
				<NavItem
					title="Bästsäljare"
					description="Se våra mest sålda produkter"
					Icon={RiVipCrownFill}
					href="/products"
				/>
			</li>
			<li>
				<NavItem
					title="Populära"
					description="Missa inte våra populäraste produkter"
					Icon={RiStarFill}
					href="/products"
				/>
			</li>
			<li>
				<NavItem
					title="Nyheter"
					description="Se våra senaste produkter"
					Icon={FaExclamation}
					href="/products"
				/>
			</li>
			<li>
				<NavItem
					title="Alla produkter"
					description="Se alla våra produkter"
					Icon={RiStackFill}
					href="/products"
				/>
			</li>
		</ul>
	);
});

const DesignNav = forwardRef<HTMLUListElement>((props, ref) => {
	return (
		<ul
			ref={ref}
			className="grid w-full gap-1 md:w-max md:grid-cols-2 md:gap-4"
		>
			<li className="order-2 md:order-3">
				<NavItem
					title="Designa fritt"
					description="Designa din bricka från grunden"
					Icon={RiPencilFill}
					href="/design"
				/>
			</li>
			<li className="order-3 md:order-2">
				<NavItem
					title="Designa från mall"
					description="Välj en av våra färdiga mallar och designa din bricka"
					Icon={RiFunctionFill}
					href="/templates"
				/>
			</li>
			<li className="order-1 md:order-1">
				<NavItem
					title="Lär dig designern"
					description="Lär dig hur du använder vårt designverktyg"
					Icon={RiGuideFill}
					href="/design?t=guide"
				/>
			</li>
			<li className="order-4">
				<NavItem
					title="Designa från bild"
					description="Ladda upp en bild och designa din bricka"
					Icon={RiImageFill}
					href="/design-generator"
				/>
			</li>
		</ul>
	);
});

const MoreNav = forwardRef<HTMLUListElement>((props, ref) => {
	return (
		<ul ref={ref} className="grid w-full gap-1 md:w-max md:gap-4">
			<li>
				<NavItem
					title="Våra köpvillkor"
					description="Köpvillkor för att handla på Träsmak.se"
					Icon={GoLaw}
					href="/terms"
				/>
			</li>
		</ul>
	);
});

ProductsNav.displayName = "ProductsNav";
DesignNav.displayName = "DesignNav";
MoreNav.displayName = "MoreNav";

function NavItem({
	title,
	description,
	Icon,
	href,
}: {
	title: string;
	description: string;
	Icon: any;
	href: string;
}) {
	const { setIsMenuOpen } = useContext(HamburgerContext);

	return (
		<Link
			href={href}
			onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
			className="flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-gray-50 md:h-full md:p-4"
		>
			<Icon className="text-3xl text-primary md:text-5xl" />
			<div>
				<span className="text-lg font-semibold md:text-xl">
					{title}
				</span>
				<p className="hidden max-w-[30ch] text-sm text-gray-600 md:block">
					{description}
				</p>
			</div>
		</Link>
	);
}

export default Header;
