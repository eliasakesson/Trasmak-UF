import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	FaShoppingCart,
	FaSearch,
	FaBars,
	FaCrown,
	FaStar,
	FaPencilRuler,
	FaUser,
} from "react-icons/fa";
import { TbTemplate } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { GoLaw } from "react-icons/go";
import { BsChevronDown } from "react-icons/bs";
import { AiFillLayout } from "react-icons/ai";
import { motion, useAnimationControls } from "framer-motion";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { useRouter } from "next/router";
import { FaX } from "react-icons/fa6";
import { signInWithGoogle } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import GetConfig from "@/utils/getConfig";
import { useWindowSize } from "@/utils/hooks";

const Header = () => {
	return (
		<>
			<Announcement />
			<div className="sticky top-0 z-50">
				<Navbar />
				<Navigation />
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
		<div className="bg-primary_dark text-white py-2">
			<div className="container mx-auto flex justify-center items-center">
				<p className="text-sm font-semibold text-center">
					FRI FRAKT VI KÖP ÖVER{" "}
					{freeShippingThreshold
						? formatCurrencyString({
								value: freeShippingThreshold,
								currency: "sek",
						  })
						: "???"}
				</p>
			</div>
		</div>
	);
}

function Navbar() {
	return (
		<div className="bg-white z-20 border-b">
			<div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8">
				<div className="flex gap-4 md:hidden flex-1">
					<HamburgerMenu />
				</div>
				<div className="md:flex-1 flex-[2]">
					<Link
						href="/"
						className="flex items-center gap-4 md:justify-start justify-center md:w-fit"
					>
						<Image
							src="/images/logo.png"
							alt="TRÄSMAK"
							width={220}
							height={60}
						/>
					</Link>
				</div>
				<div className="hidden md:flex items-center">
					<Search />
				</div>
				<div className="flex items-center justify-end flex-1 gap-6">
					<CartButton />
					<UserButton />
				</div>
			</div>
		</div>
	);
}

function HamburgerMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const controls = useAnimationControls();

	useEffect(() => {
		if (isMenuOpen) {
			controls.start({ translateX: 0, opacity: 1 });
		} else {
			controls.start({ translateX: "-100%", opacity: 0 });
		}
	}, [isMenuOpen]);

	return (
		<>
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
				animate={controls}
				className="absolute z-50 top-[73px] h-[calc(100vh-73px)] left-0 bg-white w-80 px-4 py-4 border-r-2 border-gray-300"
			>
				<div className="flex flex-col space-y-4">
					<Search setHamburgerMenuOpen={setIsMenuOpen} />
				</div>
				<ul className="flex flex-col gap-2 py-8 px-2">
					<li>
						<Link
							onClick={() => setIsMenuOpen(false)}
							href="/design"
							className="text-xl flex gap-4 items-center py-2"
						>
							<FaPencilRuler className="text-xl" />
							Designa din bricka
						</Link>
					</li>
					<li>
						<Link
							onClick={() => setIsMenuOpen(false)}
							href="/products"
							className="text-xl flex gap-4 items-center py-2"
						>
							<FaCrown className="text-xl" />
							Våra produkter
						</Link>
					</li>
					<li>
						<Link
							onClick={() => setIsMenuOpen(false)}
							href="/terms"
							className="text-xl flex gap-4 items-center py-2"
						>
							<GoLaw className="text-xl" />
							Våra köpvillkor
						</Link>
					</li>
				</ul>
			</motion.div>
		</>
	);
}

function Search({ setHamburgerMenuOpen }: { setHamburgerMenuOpen?: any }) {
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
					className="w-full border border-gray-300 rounded-md py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
			</form>
			<Link
				aria-label="Search"
				href={`/products?serach_input=${searchInput}`}
				onClick={() => {
					setIsSearchOpen(false);
					setHamburgerMenuOpen?.(false);
				}}
				className="absolute inset-y-0 right-0 flex items-center pr-3"
			>
				<FaSearch className="h-5 w-5 text-gray-400" />
			</Link>
			<div
				onPointerDown={(e) => e.preventDefault()}
				className={`${
					isSearchOpen ? "" : "hidden"
				} absolute z-10 w-full mt-2 bg-white rounded-md border p-4 space-y-2`}
			>
				<span className="text-muted_light font-semibold">
					Andra har sökt efter
				</span>
				<ul className="flex flex-col">
					{products
						?.filter(
							(product: any) =>
								!searchInput ||
								product.name
									.toLowerCase()
									.includes(searchInput.toLowerCase())
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
										product.id.length
									)}`}
									onClick={() => {
										setIsSearchOpen(false);
										setHamburgerMenuOpen?.(false);
									}}
								>
									<div className="w-full py-2 flex gap-4 items-center">
										<img
											src={product.image}
											alt={product.name}
											className="w-8 h-8 object-contain hue-rotate-[50deg] saturate-150 rounded-sm"
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

	const [user, loading, error] = useAuthState(auth);

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
		<div className="relative md:block hidden">
			<div
				onClick={() => setIsOpen(false)}
				className={`${
					isOpen ? "" : "hidden"
				} fixed top-0 left-0 right-0 bottom-0 z-20`}
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
				className="origin-top absolute top-8 right-0 min-w-[256px] bg-white border rounded-xl z-30"
			>
				<motion.div
					initial={{ opacity: 0, translateY: -20 }}
					animate={innerControls}
					className="p-4 space-y-4"
				>
					<span className="font-semibold whitespace-nowrap text-xl">
						{user ? "Min profil" : "Du är inte inloggad"}
					</span>
					<div className="flex flex-col gap-2">
						{user ? (
							<>
								<Link
									href="/profile"
									onClick={() => setIsOpen(false)}
									className="w-full text-left border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
								>
									Min profil
								</Link>
								<button
									onClick={() => auth.signOut()}
									className="w-full text-left border-2 border-red-200 bg-red-50 px-8 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors whitespace-nowrap"
								>
									Logga ut
								</button>
							</>
						) : (
							<>
								<button
									onClick={signInWithGoogle}
									className="flex gap-2 items-center justify-center w-full border-2 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
								>
									<FcGoogle className="text-red-500 text-xl" />
									Fortsätt med Google
								</button>
								<span className="text-center text-muted">
									eller
								</span>
								<Link
									href="/signup"
									onClick={() => setIsOpen(false)}
									className="w-full text-center border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
								>
									Skapa konto
								</Link>
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="w-full text-center border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
								>
									Logga in
								</Link>
							</>
						)}
					</div>
				</motion.div>
			</motion.div>
		</div>
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
				} fixed top-0 left-0 right-0 bottom-0 z-20`}
			></div>
			<button
				className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
				onClick={() => setIsCartOpen((open) => !open)}
			>
				<FaShoppingCart className="h-6 w-6" />
				<span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
					{cartCount}
				</span>
			</button>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="origin-top absolute top-8 right-0 min-w-[256px] bg-white border rounded-xl z-30"
			>
				<motion.div
					initial={{ opacity: 0, translateY: -20 }}
					animate={innerControls}
					className="p-4 space-y-4"
				>
					<span className="font-semibold whitespace-nowrap text-xl">
						Min varukorg
						<span className="font-normal"> ({cartCount})</span>
					</span>
					<ul>
						{Object.entries(cartDetails ?? {}).map(
							([key, item]) => (
								<li
									key={key}
									className="flex items-center gap-4 py-2 border-b"
								>
									<div className="bg-gray-100 h-fit rounded-lg border overflow-hidden">
										<Image
											src={item.image ?? ""}
											alt={item.name}
											width={56}
											height={56}
											className="object-contain aspect-square hue-rotate-[50deg] saturate-150"
										/>
									</div>
									<div className="flex flex-col justify-center">
										<span className="font-semibold max-w-[16ch]">
											{item.name}
										</span>
										<span className="text-sm text-gray-600">
											{item.quantity} x{" "}
											{item.formattedPrice}
										</span>
									</div>
								</li>
							)
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
							className="w-full text-center border-2 px-8 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
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
	const [whichNavOpen, setWhichNavOpen] = useState("");

	const controls = useAnimationControls();
	const innerControls = useAnimationControls();

	function handleMouseEnter() {
		controls.start({ scaleY: 1 });
		innerControls.start({
			opacity: 1,
			translateX: 0,
			transition: { delay: 0.1 },
		});
	}

	function handleMouseLeave() {
		setWhichNavOpen("");
		controls.start({ scaleY: 0 });
		innerControls.start({
			opacity: 0,
			translateX: -20,
			transition: { duration: 0 },
		});
	}

	return (
		<div
			className="hidden md:block relative bg-gray-100 py-2 border-y border-border"
			onPointerLeave={handleMouseLeave}
		>
			<ul className="max-w-7xl mx-auto flex px-8 gap-16 md:justify-start justify-center">
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={() => {
						handleMouseEnter();
						setWhichNavOpen("products");
					}}
				>
					Våra produkter
					<BsChevronDown className="inline-block ml-1" />
				</li>
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={() => {
						handleMouseEnter();
						setWhichNavOpen("design");
					}}
				>
					Designa din bricka
					<BsChevronDown className="inline-block ml-1" />
				</li>
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={() => {
						handleMouseEnter();
						setWhichNavOpen("more");
					}}
				>
					Fler tjänster
					<BsChevronDown className="inline-block ml-1" />
				</li>
			</ul>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="absolute z-50 top-10 left-0 bg-gray-100 w-full border-b origin-top overflow-hidden"
			>
				<motion.div
					initial={{ opacity: 0, translateX: -20 }}
					animate={innerControls}
					className="max-w-7xl mx-auto relative px-8 py-8 origin-top"
				>
					{whichNavOpen === "products" && <ProductsNav />}{" "}
					{whichNavOpen === "design" && <DesignNav />}{" "}
					{whichNavOpen === "more" && <MoreNav />}
				</motion.div>
			</motion.div>
		</div>
	);
}

function ProductsNav() {
	return (
		<motion.div
			className="flex gap-4"
			initial={{ opacity: 0, translateX: -20 }}
			animate={{ opacity: 1, translateX: 0 }}
		>
			<ul className="flex gap-4">
				<li>
					<Link
						href="/products"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
					>
						<FaCrown className="text-4xl" />
						<span className="text-lg">Bästsäljare</span>
					</Link>
				</li>
				<li>
					<Link
						href="/products"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
					>
						<FaStar className="text-4xl" />
						<span className="text-lg">Produkter</span>
					</Link>
				</li>
				<li>
					<Link
						href="/templates"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
					>
						<TbTemplate className="text-4xl" />
						<span className="text-lg">Mallar</span>
					</Link>
				</li>
			</ul>
		</motion.div>
	);
}

function DesignNav() {
	return (
		<motion.ul
			className="flex items-center gap-4"
			initial={{ opacity: 0, translateX: -20 }}
			animate={{ opacity: 1, translateX: 0 }}
		>
			<li>
				<Link
					href="/templates"
					className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
				>
					<AiFillLayout className="text-4xl" />
					<span className="text-lg">Starta från mall</span>
				</Link>
			</li>
			<li>
				<Link
					href="/design"
					className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
				>
					<FaPencilRuler className="text-4xl" />
					<span className="text-lg">Designa fritt</span>
				</Link>
			</li>
		</motion.ul>
	);
}

function MoreNav() {
	return (
		<motion.ul
			className="flex flex-col gap-2"
			initial={{ opacity: 0, translateX: -20 }}
			animate={{ opacity: 1, translateX: 0 }}
		>
			<li>
				<Link
					href="/terms"
					className="flex gap-2 items-center w-fit border-l-2 border-gray-300 pl-2"
				>
					<GoLaw className="text-2xl" />
					<span className="text-lg">Våra köpvillkor</span>
				</Link>
			</li>
		</motion.ul>
	);
}

export default Header;
