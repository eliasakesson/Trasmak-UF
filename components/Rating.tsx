import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Rating({
	productID,
	size = "md",
}: {
	productID: string;
	size?: "sm" | "md" | "xl";
}) {
	const [rating, setRating] = useState<number>(0);
	const [amount, setAmount] = useState<number>(0);

	useEffect(() => {
		const productRatingRef = ref(db, `products/${productID}/ratings`);

		get(productRatingRef).then((snapshot) => {
			const data = snapshot.val();
			if (!data) return;

			const ratings = Object.values(data);
			const amount = ratings.length;
			if (!amount) return;

			const total: any = ratings.reduce(
				(acc: any, current: any) => acc + current.rating,
				0,
			);
			console.log(total / amount);

			setAmount(amount);
			setRating(total / amount);
		});
	}, [productID]);

	return (
		<Stars rating={rating} size={size}>
			<p className="text-md ml-1 text-muted">({amount})</p>
		</Stars>
	);
}

export function Stars({
	rating,
	size = "md",
	children,
	className,
}: {
	rating: number;
	size?: "sm" | "md" | "xl";
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex items-center ${size == "sm" ? "gap-0" : size == "md" ? "gap-1" : "gap-2"} ${className}`}
		>
			{[...Array(5)].map((_, index) => (
				<Star key={index} rating={rating} index={index} size={size} />
			))}
			{children}
		</div>
	);
}

export function RatingStars({
	rating,
	setRating,
	size = "md",
}: {
	rating: number;
	setRating: (rating: number) => void;
	size?: "sm" | "md" | "xl";
}) {
	return (
		<div
			className={`flex items-center ${size == "sm" ? "gap-0" : size == "md" ? "gap-1" : "gap-2"}`}
		>
			{[...Array(5)].map((_, index) => (
				<button onClick={() => setRating(index + 1)}>
					<Star
						key={index}
						rating={rating}
						index={index}
						size={size}
					/>
				</button>
			))}
		</div>
	);
}

function Star({
	rating,
	index,
	size = "md",
}: {
	rating: number;
	index: number;
	size?: "sm" | "md" | "xl";
}) {
	return rating > index && rating < index + 1 ? (
		<FaStarHalfAlt
			key={index}
			className={`text-yellow-500 ${size == "sm" ? "text-sm" : size == "md" ? "text-md" : "text-xl"}`}
		/>
	) : rating > index ? (
		<FaStar
			key={index}
			className={`text-yellow-500 ${size == "sm" ? "text-sm" : size == "md" ? "text-md" : "text-xl"}`}
		/>
	) : (
		<FaStar
			key={index}
			className={`text-gray-400 ${size == "sm" ? "text-sm" : size == "md" ? "text-md" : "text-xl"}`}
		/>
	);
}
