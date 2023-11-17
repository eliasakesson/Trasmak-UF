import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	FaShoppingCart,
	FaSearch,
	FaBars,
	FaCrown,
	FaExclamation,
	FaStar,
	FaPencilRuler,
} from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { AiFillLayout } from "react-icons/ai";
import { motion, useAnimationControls } from "framer-motion";
import { useShoppingCart } from "use-shopping-cart";
import GetProducts from "@/utils/getProducts";
import { useRouter } from "next/router";

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
	return (
		<div className="bg-primary text-white py-2">
			<div className="container mx-auto flex justify-center items-center">
				<p className="text-sm font-semibold">
					FRI FRAKT VID KÖP ÖVER 500 KR
				</p>
			</div>
		</div>
	);
}

function Navbar() {
	return (
		<div className="bg-white z-20">
			<div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8">
				<div className="flex gap-4 md:hidden flex-1">
					<button className="text-gray-700 hover:text-gray-900 focus:outline-none">
						<FaBars className="h-6 w-6" />
					</button>
				</div>
				<div className="flex-1">
					<Link
						href="/"
						className="flex items-center gap-4 md:justify-start justify-center"
					>
						<svg
							width="200"
							height="40"
							viewBox="0 0 369.89473684210526 66.52189637425474"
						>
							<defs id="SvgjsDefs5784"></defs>
							<g
								id="SvgjsG5785"
								transform="matrix(1.0278572684208238,0,0,1.0278572684208238,0,0)"
								className="fill-primary"
							>
								<path
									xmlns="http://www.w3.org/2000/svg"
									d="M53.075,54.975c20.879,8.143,32.001,1.531,36.534,9.744H0C0,64.719,25.201,44.102,53.075,54.975z M47.938,49.723v-7.754  h15.132l-11.15-13.296h8.686l-10.7-11.827h6.383L44.432,0L32.583,16.847h6.375L28.264,28.673h8.682L25.805,41.969h15.114v6.602  C44.555,48.586,47.938,49.723,47.938,49.723z M19.33,43.334l10.425-12.443h-8.923l7.849-8.678l-4.376-6.16L14.347,30.08h4.27  l-9.25,13.254H19.33z M59.319,30.844l10.297,12.573h8.825l-6.188-8.647h4.888L66.757,10.405l-5.874,12.58l7.154,7.906L59.319,30.844  z M27.622,44.188H20.98v6.939c0,0,3.346-1.434,6.642-1.535V44.188z M69.352,44.188h-5.192l-0.13,9.604  c3.29,1.039,5.322,1.301,5.322,1.301V44.188z"
								></path>
							</g>
							<g
								id="SvgjsG5786"
								transform="matrix(3.3738190555369223,0,0,3.3738190555369223,109.16599147854505,-10.242914333221535)"
								fill="#132a3a"
							>
								<path d="M6.64 10.34 l0 2.78 l-2.8 0 l0 1.88 c0 1.54 1.02 2.32 2.5 2.32 c0.18 0 0.34 -0.02 0.48 -0.04 s0.26 -0.04 0.4 -0.06 l0 2.78 c-0.18 0.02 -0.32 0.06 -0.42 0.08 c-0.12 0.02 -0.32 0.02 -0.58 0.02 c-3.02 0 -5.38 -2.06 -5.38 -5.1 l0 -7.4 l3 0 l0 2.74 l2.8 0 z M11.399999999999999 15 l0 5 l-3 0 l0 -4.98 c0 -3.32 2.44 -5.12 5.52 -5.12 c0.1 0 0.24 0 0.38 0.02 s0.3 0.06 0.44 0.08 l0 2.9 c-0.1 -0.02 -0.22 -0.04 -0.36 -0.06 s-0.26 -0.04 -0.36 -0.04 c-0.5 0 -0.9 0.06 -1.24 0.16 c-0.56 0.2 -1.06 0.58 -1.24 1.18 c-0.1 0.26 -0.14 0.56 -0.14 0.86 z M22.78 15 c-0.08 -1.46 -0.74 -2.32 -2.26 -2.32 c-0.42 0 -0.78 0.06 -1.08 0.18 c-0.92 0.42 -1.26 1.2 -1.26 2.16 c0 0.32 0.04 0.62 0.14 0.88 c0.3 1.04 1.2 1.42 2.2 1.42 c1.52 0 2.26 -0.82 2.26 -2.32 z M26.58 20 l-3 0 c-0.2 -0.5 -0.38 -1 -0.5 -1.52 c-0.68 1.12 -1.72 1.62 -3 1.62 c-2.86 0 -4.9 -2.4 -4.9 -5.14 c0 -3.16 2.36 -5.06 5.34 -5.06 c3.18 0 5.18 2.04 5.26 5.1 c0.02 0.26 0.02 0.56 0.02 0.92 c0 1.4 0.22 2.8 0.78 4.08 z M18.86 8.8 c-0.76 0 -1.28 -0.52 -1.28 -1.28 s0.54 -1.24 1.28 -1.24 s1.24 0.5 1.24 1.24 s-0.48 1.28 -1.24 1.28 z M22.86 8.8 c-0.76 0 -1.28 -0.52 -1.28 -1.28 s0.54 -1.24 1.28 -1.24 s1.24 0.5 1.24 1.24 s-0.48 1.28 -1.24 1.28 z M27.32 19.68 l0 -2.8 c1.32 0.4 2.98 0.48 4.34 0.48 c0.54 0 0.96 -0.02 1.26 -0.08 c0.28 -0.04 0.42 -0.14 0.42 -0.28 c0 -0.06 -0.02 -0.1 -0.06 -0.16 c-0.2 -0.2 -0.64 -0.3 -0.9 -0.36 s-0.6 -0.14 -1.02 -0.22 c-0.34 -0.06 -0.74 -0.14 -1.2 -0.24 c-1.56 -0.34 -2.76 -1.22 -2.76 -2.9 c0 -2.48 2.42 -3.22 4.46 -3.22 c1.28 0 2.56 0.18 3.82 0.44 l0 2.82 c-1.26 -0.38 -2.68 -0.48 -4 -0.48 c-0.52 0 -0.88 0.02 -1.1 0.08 s-0.34 0.16 -0.34 0.28 c0 0.18 0.18 0.3 0.52 0.36 c0.34 0.08 0.82 0.18 1.4 0.28 c0.52 0.1 1.02 0.2 1.5 0.32 c1.48 0.38 2.54 1.18 2.54 2.78 c0 2.68 -2.7 3.34 -4.86 3.34 c-1.36 0 -2.7 -0.18 -4.02 -0.44 z M53.620000000000005 14.6 l0 5.4 l-3 0 l0 -5.4 c0 -1.14 -0.54 -1.92 -1.74 -1.92 c-1.18 0 -1.76 0.8 -1.76 1.92 l0 5.4 l-3 0 l0 -5.4 c0 -1.14 -0.58 -1.92 -1.78 -1.92 c-1.18 0 -1.72 0.8 -1.72 1.92 l0 5.4 l-3 0 l0 -5.4 c0 -2.9 1.98 -4.7 4.76 -4.7 c1.42 0 2.52 0.66 3.24 1.88 c0.72 -1.22 1.82 -1.88 3.24 -1.88 c2.88 0 4.76 1.9 4.76 4.7 z M62.480000000000004 15 c-0.08 -1.46 -0.74 -2.32 -2.26 -2.32 c-0.42 0 -0.78 0.06 -1.08 0.18 c-0.92 0.42 -1.26 1.2 -1.26 2.16 c0 0.32 0.04 0.62 0.14 0.88 c0.3 1.04 1.2 1.42 2.2 1.42 c1.52 0 2.26 -0.82 2.26 -2.32 z M66.28 20 l-3 0 c-0.2 -0.5 -0.38 -1 -0.5 -1.52 c-0.68 1.12 -1.72 1.62 -3 1.62 c-2.86 0 -4.9 -2.4 -4.9 -5.14 c0 -3.16 2.36 -5.06 5.34 -5.06 c3.18 0 5.18 2.04 5.26 5.1 c0.02 0.26 0.02 0.56 0.02 0.92 c0 1.4 0.22 2.8 0.78 4.08 z M73.28 10 l3 0 l0 1 c0 1.52 -0.52 2.98 -1.64 4.02 l2.64 4.98 l-3.7 0 l-3.1 -5.92 l0 5.92 l-3 0 l0 -14 l3 0 l0 7.54 l0.46 0 c1.62 0 2.34 -1.08 2.34 -2.56 l0 -0.98 z"></path>
							</g>
						</svg>
					</Link>
				</div>
				<div className="hidden md:flex items-center">
					<Search />
				</div>
				<div className="flex items-center justify-end flex-1">
					<CartButton />
				</div>
			</div>
		</div>
	);
}

function Search() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchInput, setSearchInput] = useState("");
	const [products, setProducts] = useState([]);

	const router = useRouter();

	useEffect(() => {
		GetProducts().then((products) => setProducts(products as any));
	}, []);

	return (
		<div className="relative w-96">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setIsSearchOpen(false);
					router.push(`/products?search_input=${searchInput}`);
				}}
			>
				<input
					type="text"
					placeholder="Search"
					onFocus={() => setIsSearchOpen(true)}
					onBlur={() => setIsSearchOpen(false)}
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					className="w-full border border-gray-300 rounded-md py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
			</form>
			<Link
				href={`/products?serach_input=${searchInput}`}
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
									href={`/products/${product.id.substring(
										6,
										product.id.length
									)}`}
									onClick={() => {
										setIsSearchOpen(false);
									}}
								>
									<div className="w-full py-2 flex gap-4 items-center">
										<img
											src={product.image}
											alt={product.name}
											className="w-8 h-8 object-contain"
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
				} fixed top-0 left-0 right-0 bottom-0`}
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
				className="origin-top absolute top-8 right-0 min-w-[256px] bg-white border rounded-xl"
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
									className="flex gap-4 py-2 border-b"
								>
									<div className="bg-gray-100 rounded-lg border">
										<Image
											src={item.image ?? ""}
											alt={item.name}
											width={56}
											height={56}
											className="object-contain mix-blend-multiply aspect-square"
										/>
									</div>
									<div className="flex flex-col justify-center">
										<span className="font-semibold">
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
							className="whitespace-nowrap border-2 px-8 py-2 rounded-lg font-semibold"
						>
							Varukorg
						</Link>
						<button className="whitespace-nowrap bg-primary text-white px-8 py-2 rounded-lg font-semibold">
							Köp nu
						</button>
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
					className="text-gray-600 hover:text-gray-800 cursor-pointer ml-auto"
					onPointerEnter={handleMouseLeave}
				>
					Om oss
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
					{whichNavOpen === "products" ? (
						<ProductsNav />
					) : whichNavOpen === "design" ? (
						<DesignNav />
					) : null}
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
						<span className="text-lg">Utvalda</span>
					</Link>
				</li>
				<li>
					<Link
						href="/products"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl"
					>
						<FaExclamation className="text-4xl" />
						<span className="text-lg">Nya</span>
					</Link>
				</li>
			</ul>
			<div className="mx-8 w-px self-stretch bg-muted_light"></div>
			<ul className="space-y-4">
				<li>
					<Link href="/products" className="text-lg text-muted">
						Visa alla
					</Link>
				</li>
				<li>
					<Link href="/products" className="text-lg text-muted">
						Mallar
					</Link>
				</li>
				<li>
					<Link href="/products" className="text-lg text-muted">
						Städer
					</Link>
				</li>
				<li>
					<Link href="/products" className="text-lg text-muted">
						Familj
					</Link>
				</li>
				<li>
					<Link href="/products" className="text-lg text-muted">
						Djur
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
					href="/design"
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

function MobileSearch() {
	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
			<div className="absolute top-0 right-0 bg-white w-80 h-screen px-4 py-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium">Search</h2>
					<button className="text-gray-700 hover:text-gray-900 focus:outline-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div className="flex flex-col space-y-4">
					<input
						type="text"
						placeholder="Search"
						className="border border-gray-300 rounded-md py-2 pl-4 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
					/>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
						Search
					</button>
				</div>
			</div>
		</div>
	);
}

export default Header;
