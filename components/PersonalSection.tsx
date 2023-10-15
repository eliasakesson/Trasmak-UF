export default function PersonalSection() {
	return (
		<section className="space-y-8">
			<div className="space-y-4">
				<h2 className="text-4xl font-bold">Gör den personlig</h2>
				<p className="max-w-prose text-muted text-lg">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit.
					Consectetur neque nesciunt eveniet maxime adipisci earum
					fuga iste omnis saepe quidem, animi rerum perferendis
					praesentium.
				</p>
			</div>
			<div className="grid grid-cols-2 grid-rows-2 w-full gap-4">
				<div className="bg-gray-100 aspect-video rounded-lg"></div>
				<div className="bg-gray-100 aspect-video rounded-lg"></div>
				<div className="bg-gray-100 aspect-video rounded-lg"></div>
				<div className="bg-gray-100 aspect-video rounded-lg"></div>
			</div>
		</section>
	);
}
