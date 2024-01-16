import { db } from "@/firebase";
import { get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa";

export default function Stars({
	productID,
	small,
}: {
	productID: string;
	small?: boolean;
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
				0
			);
			console.log(total / amount);

			setAmount(amount);
			setRating(total / amount);
		});
	}, [productID]);

	return (
		<div className={`flex items-center ${small ? "gap-0" : "gap-1"}`}>
			{[...Array(5)].map((_, index) =>
				rating > index && rating < index + 1 ? (
					<FaStarHalfAlt
						key={index}
						className={`text-yellow-500 ${
							small ? "text-xs" : "text-xl"
						}}`}
					/>
				) : rating > index ? (
					<FaStar
						key={index}
						className={`text-yellow-500 ${
							small ? "text-xs" : "text-xl"
						}}`}
					/>
				) : (
					<FaStar
						key={index}
						className={`text-gray-400 ${
							small ? "text-xs" : "text-xl"
						}}`}
					/>
				)
			)}
			<p className="ml-1 text-muted text-md">({amount})</p>
		</div>
	);
}
