import AdminWrapper from "@/components/admin/AdminWrapper";
import { ReactNode, use, useEffect, useMemo, useRef, useState } from "react";
import GetOrders from "@/utils/admin/getOrders";
import { formatCurrencyString } from "use-shopping-cart";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";
import { TbBrandCashapp } from "react-icons/tb";
import { FaShoppingCart, FaUsers } from "react-icons/fa";

export default function Admin({ ...props }) {
	return (
		<AdminWrapper>
			<AdminPage {...props} />
		</AdminWrapper>
	);
}

function AdminPage() {
	const [user] = useAuthState(auth);

	const [orders, setOrders] = useState<any[]>([]);
	const orderTotal = useMemo(() => {
		return orders.reduce(
			(acc: any, order: any) => {
				acc.total += order.total;
				return acc;
			},
			{ total: 0, currency: "SEK" },
		);
	}, [orders]);

	useEffect(() => {
		if (!user) return;

		async function getOrders() {
			const orders = await GetOrders();
			setOrders(orders);
		}

		getOrders();
	}, [user]);

	return (
		<div className="mx-auto min-h-screen max-w-7xl space-y-8 px-8 py-16">
			<span className="text-xl text-muted">
				Hej,{" "}
				<span className="font-bold">
					{user?.displayName?.split(" ")[0]}
				</span>
				. Här är din översikt.
			</span>
			<TopCards orderTotal={orderTotal} orders={orders} />
			<Orders orders={orders} />
		</div>
	);
}

function TopCards({ orderTotal, orders }: { orderTotal: any; orders: any }) {
	const productsSold = useMemo(() => {
		return orders.reduce((acc: number, order: any) => {
			return acc + order.products.length;
		}, 0);
	}, [orders]);

	const [totalVisits, setTotalVisits] = useState(0);

	useEffect(() => {
		async function getAnalytics() {
			// const analytics = await GetAnalytics();
			// console.log(analytics);
		}

		getAnalytics();
	}, []);

	return (
		<div className="grid grid-cols-4 gap-8">
			<Card
				title="Total omsättning"
				value={formatCurrencyString({
					value: orderTotal.total,
					currency: orderTotal.currency,
				})}
				icon={<TbBrandCashapp />}
				className="!bg-primary text-white"
			/>
			<Card
				title="Antal produkter sålda"
				value={productsSold}
				icon={<FaShoppingCart />}
			/>
			<Card
				title="Totalt antal besök"
				value={totalVisits.toString()}
				icon={<FaUsers />}
			/>
		</div>
	);
}

export function Card({
	title,
	value,
	icon,
	className,
}: {
	title: string;
	value: string;
	icon: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-col justify-between gap-8 rounded-lg bg-slate-300 p-8 ${className}`}
		>
			<div className="text-6xl">{icon}</div>
			<div className="flex flex-col gap-2">
				<span className="text-lg">{title}</span>
				<span className="text-4xl font-bold">{value}</span>
			</div>
		</div>
	);
}

function Orders({ orders }: { orders: any[] }) {
	return (
		<div className="pt-16">
			<table className="w-full divide-y">
				<thead>
					<tr>
						<th className="pb-4 text-left">Nr</th>
						<th className="pb-4 text-left">Kund</th>
						<th className="pb-4 text-left">Produkter</th>
						<th className="pb-4 text-left">Datum</th>
						<th className="pb-4 text-left">Status</th>
						<th className="pb-4 text-left">Pris</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{orders.map((order: any, i: number) => (
						<OrderRow
							order={order}
							key={i}
							nr={orders.length - i}
						/>
					))}
					{orders.length == 0 &&
						Array(5)
							.fill(null)
							.map((_, i) => <SkeletonOrderRow key={i} />)}
				</tbody>
			</table>
		</div>
	);
}

function OrderRow({ order, nr }: { order: any; nr: number }) {
	const router = useRouter();

	return (
		<tr
			onClick={() => router.push(`/admin/orders/${order.id}`)}
			className="cursor-pointer"
		>
			<td className="py-2">
				<span className="font-semibold">{nr}</span>
			</td>
			<td className="py-2">
				<span className="font-semibold">{order.customer.name}</span>
				<br />
				<span className="text-muted">{order.customer.email}</span>
			</td>
			<td className="space-x-2 space-y-2">
				{order.products.map((product: any, i: number) => (
					<span
						key={i}
						className="rounded-full bg-slate-300 px-2 py-1"
					>
						{product.metadata.width}x{product.metadata.height}
					</span>
				))}
			</td>
			<td>{new Date(order.created * 1000).toLocaleDateString()}</td>
			<td>
				{order.status === "complete" ? (
					<div className="flex items-center gap-1">
						<span className="size-2 rounded-full bg-green-500"></span>
						<span className="text-sm">Betald</span>
					</div>
				) : (
					<span className="text-red-500">Ej betald</span>
				)}
			</td>
			<td className="font-semibold text-muted">
				{formatCurrencyString({
					value: order.total,
					currency: order.currency,
				})}
			</td>
		</tr>
	);
}

function SkeletonOrderRow() {
	return (
		<tr className="animate-pulse">
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
			<td>
				<div className="my-4 block h-6 w-full bg-slate-300"></div>
			</td>
		</tr>
	);
}
