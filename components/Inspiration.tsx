import Image from "next/image";

export default function Inspiration() {
	const images = [
		"/images/section1.jpg",
		"/images/valnöt.jpg",
		"/images/hero.jpg",
	];

	return (
		<section className="flex flex-col space-y-4 w-full text-center">
			<h2 className="text-4xl font-bold">Inspiration</h2>
			<p className="text-muted text-lg">
				Få inspiration till din nästa bricka
			</p>
			<br />
			<div className="w-full grid lg:grid-cols-3 lg:gap-8 grid-cols-1 gap-4 text-left">
				{images.map((image, index) => (
					<div key={index} className="relative aspect-video">
						<Image
							src={image}
							alt=""
							layout="fill"
							className="lg:rounded-2xl rounded-xl object-cover"
						/>
					</div>
				))}
			</div>
		</section>
	);
}
