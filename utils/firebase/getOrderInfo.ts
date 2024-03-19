import { ref, get, onValue, update } from "firebase/database";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

export default function useOrderInfo(orderID: string) {
	const [orderInfo, setOrderInfo] = useState<any>(null);

	useEffect(() => {
		const orderRef = ref(db, `orders/${orderID}`);

		onValue(orderRef, (snapshot) => {
			const data = snapshot.val();
			setOrderInfo(data);
		});
	}, []);

	return orderInfo;
}

export function updateOrderStatus(orderID: string, status: string) {
	const orderRef = ref(db, `orders/${orderID}`);
	update(orderRef, { status });
}
