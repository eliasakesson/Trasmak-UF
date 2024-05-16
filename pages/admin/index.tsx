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
	const productsSold = useMemo(() => {
		return orders.reduce((acc: number, order: any) => {
			return (
				acc +
				order.products.reduce((acc: number, product: any) => {
					return acc + product.quantity;
				}, 0)
			);
		}, 0);
	}, [orders]);

	const orderTotal = useMemo(() => {
		return orders.reduce(
			(acc: any, order: any) => {
				acc.total += order.total;
				return acc;
			},
			{ total: 0, currency: "SEK" },
		);
	}, [orders]);

	const totalProfit = useMemo(() => {
		return orders.reduce(
			(acc: any, order: any) => {
				acc.total += order.total;
				acc.total -= order.products.reduce(
					(acc: number, product: any) => {
						return (
							acc +
							product.metadata.gross * 100 * product.quantity
						);
					},
					0,
				);
				if (order.shipping_cost.amount_total == 0) {
					acc.total -= 8900;
				}
				return acc;
			},
			{ total: 0, currency: "SEK" },
		);
	}, [orders]);

	useEffect(() => {
		let startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 1);
		let endDate = new Date();

		fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`)
			.then((res) => res.json())
			.then((data) => {
				if (!data) return;

				setTotalVisits(data.devices);
			});
	}, []);

	const [totalVisits, setTotalVisits] = useState(0);

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
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
				title="Total vinst"
				value={formatCurrencyString({
					value: totalProfit.total,
					currency: totalProfit.currency,
				})}
				icon={<TbBrandCashapp />}
			/>
			<Card
				title="Antal produkter sålda"
				value={productsSold}
				icon={<FaShoppingCart />}
			/>
			<Card
				title="Besökare senaste månaden"
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
			className={`flex flex-col justify-between rounded-lg bg-slate-300 p-4 lg:gap-8 lg:p-8 ${className}`}
		>
			<div className="text-6xl">{icon}</div>
			<div className="flex flex-col gap-2">
				<span className="text-lg">{title}</span>
				<span className="text-2xl font-bold lg:text-4xl">{value}</span>
			</div>
		</div>
	);
}

function Orders({ orders }: { orders: any[] }) {
	return (
		<div className="overflow-x-scroll pt-16">
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

const statusOptions = {
	delivered: { text: "Levererad", color: "#4CAF50" },
	sent: { text: "Skickad", color: "#FFA000" },
	complete: { text: "Betald", color: "#9C27B0" },
	incomplete: { text: "Ej betald", color: "#F44336" },
	refunded: { text: "Återbetald", color: "#F44336" },
};

function OrderRow({ order, nr }: { order: any; nr: number }) {
	const router = useRouter();

	const orderInfo = useOrderInfo(order.id);

	const status = useMemo(() => {
		if (orderInfo?.status) {
			if (orderInfo.status === "sent") return statusOptions.sent;
			if (orderInfo.status === "delivered")
				return statusOptions.delivered;
			if (orderInfo.status === "refunded") return statusOptions.refunded;
		}

		if (order.status === "complete") return statusOptions.complete;

		return statusOptions.incomplete;
	}, [order, orderInfo]);

	// Array of unique product sizes with count
	const productSizes = useMemo(() => {
		const sizes: { size: string; count: number }[] = order.products.map(
			(product: any) => {
				return {
					size: `${product.metadata.width}x${product.metadata.height}`,
					count: product.quantity,
				};
			},
		);

		const uniqueSizes = sizes.reduce((acc: any, size: any) => {
			const existingSize = acc.find((s: any) => s.size === size.size);

			if (existingSize) {
				existingSize.count += size.count;
			} else {
				acc.push(size);
			}

			return acc;
		}, []);

		return uniqueSizes;
	}, [order.products]);

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
