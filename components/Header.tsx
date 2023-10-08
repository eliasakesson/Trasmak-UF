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
	FaList,
	FaPencilRuler,
} from "react-icons/fa";
import { AiFillLayout } from "react-icons/ai";
import { motion, useAnimationControls } from "framer-motion";
import { useShoppingCart } from "use-shopping-cart";

const Header = () => {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const toggleCart = () => {
		setIsCartOpen(!isCartOpen);
	};

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	return (
		<>
			<Announcement />
			<div className="sticky top-0">
				<Navbar />
				<Navigation />
			</div>
		</>
	);
};

function Announcement() {
	return (
		<div className="bg-amber-800 text-white py-2">
			<div className="container mx-auto flex justify-center items-center">
				<p className="text-sm font-semibold">
					JUST NU: KÖP 3 FÅ 1 EXTRA PÅ KÖPET
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
					<button className="text-gray-700 hover:text-gray-900 focus:outline-none">
						<FaSearch className="h-6 w-6" />
					</button>
				</div>
				<div className="flex-1">
					<Link
						href="/"
						className="flex items-center gap-4 md:justify-start justify-center">
						<Image
							src="https://secure.webtoolhub.com/static/resources/icons/set85/6f09cff8.png"
							alt="Logo"
							width={40}
							height={40}
						/>
						<span className="text-lg font-semibold">Logo</span>
					</Link>
				</div>
				<div className="hidden md:flex items-center">
					<div className="relative w-96">
						<input
							type="text"
							placeholder="Search"
							className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
						/>
						<div className="absolute inset-y-0 left-0 flex items-center pl-3">
							<FaSearch className="h-5 w-5 text-gray-400" />
						</div>
					</div>
				</div>
				<div className="flex items-center justify-end flex-1">
					<CartButton />
				</div>
			</div>
		</div>
	);
}

function CartButton() {
	const { formattedTotalPrice, cartCount, cartDetails } = useShoppingCart();

	console.log(cartDetails);

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
		<div
			className="relative z-20"
			onPointerLeave={() => setIsCartOpen(false)}>
			{/* Mobile version */}
			<button
				className="md:hidden relative p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
				onClick={() => setIsCartOpen((open) => !open)}>
				<FaShoppingCart className="h-6 w-6" />
				<span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-amber-600 rounded-full">
					{cartCount}
				</span>
			</button>
			<div
				className="hidden md:block p-2 relative text-gray-700 hover:text-gray-900 focus:outline-none"
				onPointerEnter={() => setIsCartOpen(true)}>
				<FaShoppingCart className="h-6 w-6" />
				<span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-amber-600 rounded-full">
					{cartCount}
				</span>
			</div>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="origin-top absolute top-8 right-0 min-w-[256px] bg-white border rounded-xl">
				<motion.div
					initial={{ opacity: 0, translateY: -20 }}
					animate={innerControls}
					className="p-4 space-y-4">
					<span className="font-semibold whitespace-nowrap text-xl">
						Min varukorg
						<span className="font-normal"> ({cartCount})</span>
					</span>
					<ul className="border-t">
						{Object.entries(cartDetails ?? {}).map(
							([key, item]) => (
								<li
									key={key}
									className="flex gap-4 py-2 border-b">
									<div className="bg-gray-100 rounded-lg border">
										<Image
											src={item.image ?? ""}
											alt={item.name}
											width={56}
											height={56}
											className="object-cover mix-blend-multiply"
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
							className="whitespace-nowrap bg-gray-400 text-white px-8 py-2 rounded-lg">
							Varukorg
						</Link>
						<button className="whitespace-nowrap bg-amber-800 text-white px-8 py-2 rounded-lg">
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
			onPointerLeave={handleMouseLeave}>
			<ul className="max-w-7xl mx-auto flex px-8 gap-16 md:justify-start justify-center">
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={() => {
						handleMouseEnter();
						setWhichNavOpen("products");
					}}>
					Våra produkter
				</li>
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={() => {
						handleMouseEnter();
						setWhichNavOpen("design");
					}}>
					Designa din egen
				</li>
				<li
					className="text-gray-600 hover:text-gray-800 cursor-pointer"
					onPointerEnter={handleMouseLeave}>
					Om oss
				</li>
			</ul>
			<motion.div
				initial={{ scaleY: 0 }}
				animate={controls}
				className="absolute z-10 top-10 left-0 bg-gray-100 w-full border-b origin-top overflow-hidden">
				<motion.div
					initial={{ opacity: 0, translateX: -20 }}
					animate={innerControls}
					className="max-w-7xl mx-auto relative px-8 py-8 origin-top">
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
			animate={{ opacity: 1, translateX: 0 }}>
			<ul className="flex gap-4">
				<li>
					<Link
						href="/"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl">
						<FaCrown className="text-4xl" />
						<span className="text-lg">Bästsäljare</span>
					</Link>
				</li>
				<li>
					<Link
						href="/"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl">
						<FaStar className="text-4xl" />
						<span className="text-lg">Utvalda</span>
					</Link>
				</li>
				<li>
					<Link
						href="/"
						className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl">
						<FaExclamation className="text-4xl" />
						<span className="text-lg">Nya</span>
					</Link>
				</li>
			</ul>
			<div className="mx-8 w-px self-stretch bg-muted_light"></div>
			<ul className="space-y-4">
				<li>
					<Link href="" className="text-lg text-muted">
						Visa alla
					</Link>
				</li>
				<li>
					<Link href="" className="text-lg text-muted">
						Mallar
					</Link>
				</li>
				<li>
					<Link href="" className="text-lg text-muted">
						Städer
					</Link>
				</li>
				<li>
					<Link href="" className="text-lg text-muted">
						Familj
					</Link>
				</li>
				<li>
					<Link href="" className="text-lg text-muted">
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
			animate={{ opacity: 1, translateX: 0 }}>
			<li>
				<Link
					href="/"
					className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl">
					<AiFillLayout className="text-4xl" />
					<span className="text-lg">Starta från mall</span>
				</Link>
			</li>
			<li>
				<Link
					href="/"
					className="h-32 aspect-video border border-muted_light flex flex-col gap-2 items-center justify-center rounded-xl">
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
							stroke="currentColor">
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
