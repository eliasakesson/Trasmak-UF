import { ref, get, onValue, update, set } from "firebase/database";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

export default function useOrderInfo(orderID: string) {
	const [orderInfo, setOrderInfo] = useState<any>(null);

	useEffect(() => {
		const orderRef = ref(db, `orders/${orderID}`);

		onValue(orderRef, (snapshot) => {
			const data = snapshot.val();
			setOrderInfo(data);
			
			if (!data?.orderNr){
				(async () => {
					const orderNr = await getNextOrderNr();
					setOrderNr(orderID, orderNr);
				})();
			}
		});
	}, []);

	return orderInfo;
}

export async function GetOrderInfo(orderID: string) {
	const orderRef = ref(db, `orders/${orderID}`);

	return get(orderRef).then((snapshot) => snapshot.val());
}

async function getNextOrderNr() {
	const orderRef = ref(db, "orders");
	
	return get(orderRef).then((snapshot) => {
		const orders = snapshot.val();
		const orderNrs = Object.values(orders).map((order: any) => order.orderNr).filter(Boolean);
		const maxOrderNr = Math.max(1000, Math.max(...orderNrs));
		return maxOrderNr + 1;
	});
}

export function setOrderNr(orderID: string, orderNr: number) {
	const orderRef = ref(db, `orders/${orderID}`);
	update(orderRef, { orderNr });
}

export function setOrderStatus(orderID: string, status: string) {
	const orderRef = ref(db, `orders/${orderID}`);
	update(orderRef, { status });
}
