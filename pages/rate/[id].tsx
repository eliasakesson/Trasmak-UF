import { RatingStars } from "@/components/Rating";
import { GetProduct } from "@/utils/stripe/getProducts";
import { stripe } from "@/utils/stripe/stripe";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Rate({ product }: { product: any }) {
	const [rating, setRating] = useState<number>(0);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (rating === 0) {
			toast.error(
				"Du måste välja ett betyg för att skicka in din recension.",
			);
			return;
		}

		fetch(
			`/api/rate?productID=${product.id}&rating=${rating}&rateToken=gnigajiofjioajf
        `,
			{
				method: "POST",
			},
		)
			.then((res) => res.json())
			.then((data) => {
				// If the rate has a success statusCode
				if (data.statusCode === 200) {
					toast.success("Tack för din recension!");
				} else {
					toast.error(data.message);
				}
			})
			.catch((err) => {
				toast.error("Något gick fel. Försök igen senare.");
			});
	}

	return (
		<main className="flex min-h-[calc(100vh-111px)] flex-col items-center justify-center gap-4">
			<div className="relative aspect-square h-[25vh]">
				<Image src={product.image} alt={product.name} fill />
			</div>
			<h1 className="text-3xl font-semibold">{product.name}</h1>
			<RatingStars rating={rating} setRating={setRating} size="xl" />
			<form onSubmit={handleSubmit}>
				<button
					type="submit"
					className="flex items-center justify-between rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light lg:px-16 2xl:px-32"
				>
					Skicka in betyg
				</button>
			</form>
		</main>
	);
}

export async function getStaticProps({ params }: { params: { id: string } }) {
	const product = await GetProduct("price_" + params.id);

	return {
		props: {
			product,
		},
		revalidate: 3600,
	};
}

export async function getStaticPaths() {
	const inventory = await stripe.prices.list({
		expand: ["data.product"],
	});

	const paths = inventory.data.map((product: any) => ({
		params: {
			id: product.id.slice(6, product.id.length),
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
}
