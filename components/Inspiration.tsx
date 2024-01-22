import Image from "next/image";

export default function Inspiration() {
	const images = [
		"/images/section1.jpg",
		"/images/valnöt.jpg",
		"/images/hero.jpg",
	];

	return (
		<section className="flex flex-col space-y-4 w-full text-center">
			<h2 className="lg:text-4xl text-3xl font-bold">Inspiration</h2>
			<p className="text-muted text-lg">
				Få inspiration till din nästa bricka
			</p>
			<br />
			<div className="w-full grid lg:grid-cols-3 md:grid-cols-2 lg:gap-8 grid-cols-1 gap-4 text-left">
				{images.map((image, index) => (
					<div
						key={index}
						className={`relative aspect-video lg:rounded-2xl rounded-xl overflow-hidden lg:hover:scale-150 lg:hover:-translate-y-8 hover:z-10 hover:shadow-xl transition-all ease-in-out duration-300 ${
							index % 3 === 0
								? "origin-top-left"
								: index % 3 === 1
								? "origin-top"
								: "origin-top-right"
						}`}>
						<Image
							src={image}
							alt=""
							layout="fill"
							className="object-cover"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
