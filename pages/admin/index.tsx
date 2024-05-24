import AdminWrapper from "@/components/admin/AdminWrapper";
import { ReactNode, useEffect, useMemo, useState } from "react";
import GetOrders from "@/utils/stripe/getOrders";
import { formatCurrencyString } from "use-shopping-cart";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";
import { TbBrandCashapp } from "react-icons/tb";
import { FaShoppingCart, FaUsers } from "react-icons/fa";
import useOrderInfo, {
	setOrderNr,
	setOrderStatus,
} from "@/utils/firebase/getOrderInfo";
import {
	statusOptions,
	useGetVisits,
	useOrderStatus,
	useOrderTotal,
	useProductSizes,
	useProductCount,
	useProductsSoldPeriod,
	useTotalProfit,
} from "@/utils/admin";

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
			<TopCards orders={orders} />
			<Orders orders={orders} />
		</div>
	);
}

function TopCards({ orders }: { orders: any }) {
	const orderTotal = useOrderTotal(orders);
	const totalProfit = useTotalProfit(orders);
	const productsSold = useProductCount(orders);
	const productsSoldMonth = useProductsSoldPeriod(orders, "month");
	const visits = useGetVisits();

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
			<Card
				title="Total omsättning"
				value={formatCurrencyString({
					value: orderTotal.total,
					currency: orderTotal.currency,
				})}
				title2="Total vinst"
				value2={formatCurrencyString({
					value: totalProfit.total,
					currency: totalProfit.currency,
				})}
				icon={<TbBrandCashapp />}
				className="!bg-primary text-white"
			/>
			<Card
				title="Antal produkter sålda"
				value={productsSold.toString()}
				title2="Senaste månaden"
				value2={productsSoldMonth.toString()}
				icon={<FaShoppingCart />}
			/>
			<Card
				title="Besökare senaste månaden"
				value={visits.month.toString()}
				title2="Besökare senaste veckan"
				value2={visits.week.toString()}
				icon={<FaUsers />}
			/>
		</div>
	);
}

export function Card({
	title,
	value,
	title2,
	value2,
	icon,
	className,
}: {
	title: string;
	value: string;
	title2?: string;
	value2?: string;
	icon: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-col justify-between rounded-lg bg-slate-300 p-4 lg:gap-8 lg:p-8 ${className}`}
		>
			<div className="text-6xl">{icon}</div>
			<div className="flex flex-col">
				<span className="text-lg">{title}</span>
				<span className="text-2xl font-bold lg:text-4xl">{value}</span>
				{title2 && value2 && (
					<>
						<span className="mt-4 text-sm">{title2}</span>
						<span className="text-lg font-bold lg:text-2xl">
							{value2}
						</span>
					</>
				)}
			</div>
		</div>
	);
}

function Orders({ orders }: { orders: any[] }) {
	return (
		<div className="overflow-x-auto pt-16">
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

	const orderInfo = useOrderInfo(order.id);
	const status = useOrderStatus(order, orderInfo);
	const productSizes = useProductSizes(order);

	function handleStatusChange(e: any) {
		setOrderStatus(order.id, e.target.value);
	}

	function handleNrChange(e: any) {
		setOrderNr(order.id, e.target.value);
	}

	return (
		<tr
			onClick={() => router.push(`/admin/orders/${order.id}`)}
			className="cursor-pointer"
		>
			<td className="py-2">
				<input
					value={orderInfo?.orderNr || nr + 1000}
					onChange={handleNrChange}
					onClick={(e) => e.stopPropagation()}
					className="w-[6ch] bg-transparent font-semibold outline-none"
				/>
			</td>
			<td className="py-2">
				<span className="font-semibold">{order.customer.name}</span>
				<br />
				<span className="text-muted">{order.customer.email}</span>
			</td>
			<td className="space-x-2 space-y-2">
				{productSizes.map((product: any, i: number) => (
					<span key={i} className="rounded-lg bg-slate-200 px-2 py-1">
						{product.size}
						{product.count > 1 && (
							<span className="ml-2 rounded-full bg-slate-100 px-2 text-sm font-semibold">
								{product.count}
							</span>
						)}
					</span>
				))}
			</td>
			<td>{new Date(order.created * 1000).toLocaleDateString()}</td>
			<td>
				<select
					value={Object.keys(statusOptions).find(
						(key) =>
							(statusOptions as any)[key].text === status?.text,
					)}
					onChange={handleStatusChange}
					onClick={(e) => e.stopPropagation()}
					style={{
						backgroundColor: `${status?.color}22`,
						color: status?.color,
					}}
					className="appearance-none rounded-lg bg-transparent p-2 font-semibold outline-none drop-shadow-md transition-all hover:brightness-110"
				>
					{Object.entries(statusOptions).map(([key, value]) => {
						if (key === "incomplete" && order.status === "complete")
							return null;

						return (
							<option
								key={key}
								value={key}
								className="appearance-none bg-slate-200 text-black"
							>
								{value.text}
							</option>
						);
					})}
				</select>
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
