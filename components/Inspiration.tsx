import Image from "next/image";

export default function Inspiration() {
	const images = [
		"/images/section1.jpg",
		"/images/valnöt.jpg",
		"/images/hero.jpg",
	];

	return (
		<section className="flex w-full flex-col space-y-4 text-center">
			<h2 className="text-3xl font-bold lg:text-4xl">Inspiration</h2>
			<p className="text-lg text-muted">
				Få inspiration till din nästa bricka
			</p>
			<br />
			<div className="grid w-full grid-cols-1 gap-4 text-left md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
				{images.map((image, index) => (
					<div
						key={index}
						className={`relative aspect-video overflow-hidden rounded-xl lg:rounded-2xl`}
					>
						<Image
							src={image}
							alt=""
							fill
							sizes="100%"
							className="object-cover"
							quality={100}
						/>
					</div>
				))}
			</div>
		</section>
	);
}
