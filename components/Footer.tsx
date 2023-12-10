import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-gray-100">
			<div className="max-w-7xl mx-auto px-8 ">
				<div className="grid lg:grid-cols-4 sm:grid-cols-2 md:gap-16 gap-8 py-16">
					<div className="sm:col-span-2 space-y-8">
						<Image
							src="/images/logo.png"
							alt="TRÄSMAK"
							width={220}
							height={60}
						/>
						<p>
							Träsmak UF är ett UF-företag som erbjuder personliga
							träbrickor. Våra brickor är tillverkade i Småland
							och är av hög kvalité. Vårat mål är att erbjuda en
							produkt som är både personlig och hållbar.
						</p>
					</div>
					<div className="space-y-8">
						<h3 className="text-2xl font-semibold">Navigation</h3>
						<nav>
							<ul className="space-y-2">
								<li>
									<Link href="/" className="underline">
										Hem
									</Link>
								</li>
								<li>
									<Link
										href="/products"
										className="underline">
										Produkter
									</Link>
								</li>
								<li>
									<Link href="/design" className="underline">
										Designer
									</Link>
								</li>
							</ul>
						</nav>
					</div>
					<div className="space-y-8">
						<h3 className="text-2xl font-semibold">Kontakt</h3>
						<div className="flex flex-col gap-2">
							<a href="mailto:trasmak@gmail.com">
								<span className="text-blue-500 hover:text-blue-600">
									trasmakuf@gmail.com
								</span>
							</a>
							{/* <a href="tel:0701234567">
								<span className="text-blue-500 hover:text-blue-600">
									070-123 45 67
								</span>
							</a> */}
						</div>
					</div>
				</div>
				<div className="py-4 border-t flex sm:flex-row flex-col-reverse gap-2 justify-between items-center">
					<p className="text-gray-500">
						© 2023 Träsmak UF. All rights reserved.
					</p>
					{/* <p className="text-gray-500">
						Created by{" "}
						<a
							href="https://eliasakesson.me"
							className="text-gray-600"
							rel="noopener noreferrer"
							target="_blank">
							Elias Åkesson
						</a>
					</p> */}
				</div>
			</div>
		</footer>
	);
}
