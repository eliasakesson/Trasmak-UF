import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";

export default function Spinner() {
	return (
		<motion.div
			animate={{ rotate: 360 }}
			transition={{
				repeat: Infinity,
				duration: 2,
				ease: "linear",
			}}>
			<AiOutlineLoading3Quarters />
		</motion.div>
	);
}
