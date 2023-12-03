import Image from "next/image";

export default function Inspiration() {
	return (
		<section className="flex flex-col space-y-4 w-full text-center">
			<h2 className="text-4xl font-bold">Inspiration</h2>
			<p className="text-muted text-lg">
				Få inspiration till din nästa bricka
			</p>
			<br />
			<div className="w-full grid lg:grid-cols-3 lg:gap-8 grid-cols-2 gap-4 text-left"></div>
		</section>
	);
}
