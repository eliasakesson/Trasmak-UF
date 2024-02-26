import AdminWrapper from "@/components/admin/AdminWrapper";
import { useEffect, useState } from "react";
import GetOrders from "@/utils/admin/getOrders";
import GetBalance, { GetOrderTotal } from "@/utils/admin/getBalance";
import { formatCurrencyString } from "use-shopping-cart";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export default function Admin() {
	return (
		<AdminWrapper>
			<AdminPage />
		</AdminWrapper>
	);
}

function AdminPage() {
	const [user] = useAuthState(auth);
	const [orderTotal, setOrderTotal] = useState<any>(0);
	const [balance, setBalance] = useState<any>(0);
	const [orders, setOrders] = useState<any>([]);

	useEffect(() => {
		const fetch = async () => {
			setOrderTotal(await GetOrderTotal());
			setOrders(await GetOrders());
			setBalance(await GetBalance());
		};

		fetch();
	}, []);

	return (
		<div className="mx-auto min-h-screen max-w-7xl space-y-8 px-8 py-16">
			<span className="text-xl font-semibold text-muted">Admin</span>
			<h1 className="text-5xl font-semibold">
				Hej,{" "}
				<span className="font-bold">
					{user?.displayName?.split(" ")[0]}
				</span>
			</h1>
			<div className="flex gap-16">
				<div className="space-y-4">
					<h2 className="text-3xl font-semibold">Konto</h2>
					<div className="flex items-center justify-between gap-8">
						<h3 className="font-semibold">Total försäljning</h3>
						<span>
							{orderTotal &&
								formatCurrencyString({
									value: orderTotal.total,
									currency: orderTotal.currency,
								})}
						</span>
					</div>
					<div className="flex items-center justify-between gap-8">
						<h3 className="font-semibold">Tillgängligt</h3>
						<span>
							{balance &&
								formatCurrencyString({
									value: balance.available,
									currency: balance.currency,
								})}
						</span>
					</div>
					<div className="flex items-center justify-between gap-8">
						<h3 className="font-semibold">Pågående</h3>
						<span>
							{balance &&
								formatCurrencyString({
									value: balance.pending,
									currency: balance.currency,
								})}
						</span>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="text-3xl font-semibold">Orders</h2>
					<div className="flex w-fit flex-col gap-4">
						{orders.map((order: any, i: number) => (
							<Order order={order} key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function Order({ order }: { order: any }) {
	return (
		<Link href={`/admin/orders/${order.id}`}>
			<div className="flex items-center justify-end gap-8 border-2 p-4">
				<div className="flex flex-1 flex-col">
					<h2 className="font-bold">{order.customer.name}</h2>
					<span>{order.customer.email}</span>
				</div>
				<span>
					{new Date(order.created * 1000).toLocaleDateString()}
				</span>
				<span className="font-bold">
					{formatCurrencyString({
						value: order.total,
						currency: order.currency,
					})}
				</span>
			</div>
		</Link>
	);
}
