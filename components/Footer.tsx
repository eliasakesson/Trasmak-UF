import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="mt-16 bg-gray-100">
			<div className="w-full border-y border-gray-300 bg-white py-2">
				<ul className="xs:gap-2 flex h-8  justify-center gap-1 sm:gap-8">
					<li className="relative aspect-video">
						<Image
							src="https://hjarnkraft.se/wp-content/uploads/2023/04/Swish-Logo-Secondary-Light-BG.png"
							alt="Swish"
							fill
							className="h-full rounded border-2 border-gray-300 object-contain px-1"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://images.asos-media.com/navigation/klarna-gb-png"
							alt="Klarna"
							fill
							sizes="100%"
							className="h-full rounded object-contain"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://images.asos-media.com/navigation/mastercard-png"
							alt="Mastercard"
							fill
							sizes="100%"
							className="h-full rounded object-contain"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://images.asos-media.com/navigation/visa-png"
							alt="VISA"
							fill
							sizes="100%"
							className="h-full rounded object-contain"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://images.asos-media.com/navigation/american-express-png"
							alt="American Express"
							fill
							sizes="100%"
							className="h-full rounded object-contain"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://images.asos-media.com/navigation/apple-pay-png"
							alt="Apple Pay"
							fill
							sizes="100%"
							className="h-full rounded object-contain"
						/>
					</li>
					<li className="relative aspect-video">
						<Image
							src="https://lh3.googleusercontent.com/2Bq7R5oLDG5tYVUPRnsLv7gitw9HRnqwnRC0baVxPM9rYRtNx6dv6_05YdMlCEtu-uTsk_R1mDOSkLcMZheILddlnDy1Z5LumphRoVE"
							alt="Google Pay"
							fill
							sizes="100%"
							className="h-full rounded border-2 border-gray-300 object-contain"
						/>
					</li>
				</ul>
			</div>
			<div className="mx-auto max-w-7xl px-8 ">
				<div className="grid gap-8 py-16 sm:grid-cols-2 md:gap-16 lg:grid-cols-4">
					<div className="space-y-8 sm:col-span-2">
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
										className="underline"
									>
										Produkter
									</Link>
								</li>
								<li>
									<Link
										href="/templates"
										className="underline"
									>
										Mallar
									</Link>
								</li>
								<li>
									<Link
										href="/designer"
										className="underline"
									>
										Designer
									</Link>
								</li>
								<li>
									<Link
										href="/design-generator"
										className="underline"
									>
										Design Generator
									</Link>
								</li>
								<li>
									<Link
										href="/design-generator"
										className="underline"
									>
										Köpvillkor
									</Link>
								</li>
							</ul>
						</nav>
					</div>
					<div className="space-y-8">
						<h3 className="text-2xl font-semibold">Kontakt</h3>
						<div className="flex flex-col gap-2">
							<a href="mailto:trasmakuf@gmail.com">
								<span className="text-primary hover:text-primary_light">
									trasmakuf@gmail.com
								</span>
							</a>
							<a href="tel:0701234567">
								<span className="text-primary hover:text-primary_light">
									070-344 23 65
								</span>
							</a>
						</div>
					</div>
				</div>
				<div className="flex flex-col-reverse items-center justify-between gap-2 border-t py-4 sm:flex-row">
					<p className="text-muted">
						© 2024 Träsmak UF. All rights reserved.
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
