import AdminWrapper from "@/components/admin/AdminWrapper";
import { useEffect, useState } from "react";
import GetOrders from "@/utils/admin/getOrders";

export default function Admin() {
	return (
		<AdminWrapper>
			<AdminPage />
		</AdminWrapper>
	);
}

function AdminPage() {
	const [orders, setOrders] = useState<any>([]);

	useEffect(() => {
		const orders = async () => {
			setOrders(await GetOrders());
		};

		orders();
	}, []);

	return (
		<div>
			<h1>Admin</h1>
			<div className="flex flex-col gap-4">
				{orders.map((order: any, i: number) => (
					<div key={i} className="flex flex-col gap-2">
						<h2 className="font-bold">{order.customer.name}</h2>
						<span>Order Total: {order.total}</span>
					</div>
				))}
			</div>
		</div>
	);
}
