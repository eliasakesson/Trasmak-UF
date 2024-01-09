import { FaStar } from "react-icons/fa";

export default function Stars({
	rating,
	amount,
	small,
}: {
	rating: number;
	amount?: number;
	small?: boolean;
}) {
	return (
		<div className={`flex items-center ${small ? "gap-0" : "gap-1"}`}>
			{[...Array(5)].map((_, index) => (
				<FaStar
					key={index}
					className={`${
						rating > index ? "text-yellow-500" : "text-gray-400"
					} ${small ? "text-xs" : "text-xl"}}`}
				/>
			))}
			{amount && <p className="ml-1 text-muted text-md">({amount})</p>}
		</div>
	);
}
