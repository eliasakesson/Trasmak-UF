import { useEffect, useMemo, useState } from "react";

export const useGetVisits = () => {
	const [totalVisits, setTotalVisits] = useState({ month: 0, week: 0 });

	useEffect(() => {
		let startDateMonth = new Date();
		startDateMonth.setMonth(startDateMonth.getMonth() - 1);
		let startDateWeek = new Date();
		startDateWeek.setDate(startDateWeek.getDate() - 7);
		let endDate = new Date();

		const visits = Promise.all([
			getVisitsFromTo(startDateMonth, endDate),
			getVisitsFromTo(startDateWeek, endDate),
		]);

		visits.then(([month, week]) => {
			setTotalVisits({
				month,
				week,
			});
		});
	}, []);

	async function getVisitsFromTo(startDate: Date, endDate: Date) {
		const visits = await fetch(
			`/api/analytics?startDate=${startDate}&endDate=${endDate}`,
		);
		const data = await visits.json();
		return data.devices;
	}

	return totalVisits;
};

export const useOrderTotal = (orders: any) => {
	const orderTotal: { total: number; currency: string } = useMemo(() => {
		return orders.reduce(
			(acc: any, order: any) => {
				acc.total += order.total;
				return acc;
			},
			{ total: 0, currency: "SEK" },
		);
	}, [orders]);

	return orderTotal;
};

export const useTotalProfit = (orders: any) => {
	const totalProfit: { total: number; currency: string } = useMemo(() => {
		return orders.reduce(
			(acc: any, order: any) => {
				acc.total += order.total;
				acc.total -= order.products.reduce(
					(acc: number, product: any) => {
						return (
							acc +
							product.metadata.gross * 125 * product.quantity
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

	return totalProfit;
};

export const useProductProfit = (order: any) => {
	const productProfit: { total: number; currency: string } = useMemo(() => {
		if (!order) return { total: 0, currency: "SEK" };

		let total = order.total;
		total -= order.products.reduce((acc: number, product: any) => {
			return acc + product.metadata.gross * 125 * product.quantity;
		}, 0);
		if (order.shipping_cost.amount_total == 0) {
			total -= 8900;
		}
		return { total, currency: order.currency };
	}, [order]);

	return productProfit;
};

export const useProductCount = (orders: any) => {
	const productsSold: number = useMemo(() => {
		return orders.reduce((acc: number, order: any) => {
			return (
				acc +
				order.products.reduce((acc: number, product: any) => {
					return acc + product.quantity;
				}, 0)
			);
		}, 0);
	}, [orders]);

	return productsSold;
};

export const useOrderProductCount = (order?: any) => {
	const productCount = useMemo(() => {
		return order?.products.reduce((acc: any, product: any) => {
			acc += product.quantity;

			return acc;
		}, 0);
	}, [order]);

	return productCount;
};

export const useProductsSoldPeriod = (
	orders: any,
	period: "week" | "month",
) => {
	const startDate = useMemo(() => {
		const date = new Date();
		if (period === "week") {
			date.setDate(date.getDate() - 7);
		} else if (period === "month") {
			date.setMonth(date.getMonth() - 1);
		}
		return date;
	}, [period]);

	const productsSold: number = useMemo(() => {
		return orders.reduce((acc: number, order: any) => {
			if (new Date(order.created * 1000) > startDate) {
				return (
					acc +
					order.products.reduce((acc: number, product: any) => {
						return acc + product.quantity;
					}, 0)
				);
			}
			return acc;
		}, 0);
	}, [orders, startDate]);

	return productsSold;
};

export const statusOptions = {
	delivered: { text: "Levererad", color: "#4CAF50" },
	sent: { text: "Skickad", color: "#FFA000" },
	complete: { text: "Betald", color: "#9C27B0" },
	incomplete: { text: "Ej betald", color: "#F44336" },
	refunded: { text: "Återbetald", color: "#F44336" },
};

export const useOrderStatus = (order: any, orderInfo?: any) => {
	const status: { text: string; color: string } = useMemo(() => {
		if (orderInfo?.status) {
			if (orderInfo.status === "sent") return statusOptions.sent;
			if (orderInfo.status === "delivered")
				return statusOptions.delivered;
			if (orderInfo.status === "refunded") return statusOptions.refunded;
		}

		if (order.status === "complete") return statusOptions.complete;

		return statusOptions.incomplete;
	}, [order, orderInfo]);

	return status;
};

export const useProductSizes = (order: any) => {
	const productSizes: { size: string; count: number }[] = useMemo(() => {
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

	return productSizes;
};
