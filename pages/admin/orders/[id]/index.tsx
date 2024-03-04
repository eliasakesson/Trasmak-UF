import AdminWrapper from "@/components/admin/AdminWrapper";
import { auth } from "@/firebase";
import { GetOrder } from "@/utils/admin/getOrders";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { formatCurrencyString } from "use-shopping-cart";
import { Card } from "../..";
import { TbBrandCashapp } from "react-icons/tb";
import { FaShoppingCart } from "react-icons/fa";

export default function AdminOrder() {
	return (
		<AdminWrapper>
			<AdminPage />
		</AdminWrapper>
	);
}

function AdminPage() {
	const router = useRouter();
	const [user] = useAuthState(auth);

	const [order, setOrder] = useState<any>(null);
	const productCount = useMemo(() => {
		return order?.products.reduce((acc: any, product: any) => {
			acc += product.quantity;

			return acc;
		}, 0);
	}, [order]);

	useEffect(() => {
		if (!user) return;

		async function getOrders() {
			const order = await GetOrder(router.query.id as string);
			console.log(order);
			setOrder(order);
		}

		getOrders();
	}, [router, user]);

	return (
		<div className="mx-auto max-w-7xl space-y-8 px-8 py-16">
			<Link href="/admin">{"<- Admin"}</Link>
			<div className="grid grid-cols-4 gap-8">
				<Card
					title="Totalt"
					value={
						order
							? formatCurrencyString({
									value: order.total,
									currency: order.currency,
								})
							: "0"
					}
					icon={<TbBrandCashapp />}
					className="!bg-primary text-white"
				/>
				<Card
					title="Antal produkter"
					value={productCount}
					icon={<FaShoppingCart />}
				/>
			</div>
			<div className="flex flex-col divide-y border-slate-300">
				<div className="flex flex-col py-4">
					<Link
						className="text-primary underline"
						href={`/admin/orders/${order?.id}/pdf`}
					>
						Visa Order PDF
					</Link>
					<span className="text-muted">
						{order &&
							new Date(order.created * 1000).toLocaleDateString()}
					</span>
					<br />
					<h3 className="text-xl font-semibold">
						{order?.customer.name}
					</h3>
					<span className="text-muted">{order?.customer.email}</span>
				</div>
				<div className="flex flex-col py-4">
					<p>{order?.shipping.address.line1}</p>
					<p>{order?.shipping.address.postal_code}</p>
					<p>
						{order?.shipping.address.city},{" "}
						{order?.shipping.address.country}
					</p>
				</div>
			</div>
			<Products products={order?.products || []} />
		</div>
	);
}

function Products({ products }: { products: any[] }) {
	return (
		<div className="pt-16">
			<table className="w-full divide-y">
				<thead>
					<tr>
						<th className="pb-4 text-left">Nr</th>
						<th className="pb-4 text-left">Bild</th>
						<th className="pb-4 text-left">Namn</th>
						<th className="pb-4 text-left">Art nr</th>
						<th className="pb-4 text-left">Pris</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{products.map((product: any, i: number) => (
						<ProductRow product={product} key={i} nr={i + 1} />
					))}
				</tbody>
			</table>
		</div>
	);
}

function ProductRow({ product, nr }: { product: any; nr: number }) {
	return (
		<tr
			onClick={() => window.open(GetImagePath(product.image), "_blank")}
			className="cursor-pointer"
		>
			<td className="py-2">
				<span className="font-semibold">{nr}</span>
			</td>
			<td className="py-2">
				<Image
					src={GetImagePath(product.image)}
					alt=""
					width={128}
					height={96}
				/>
			</td>
			<td className="space-y-2">
				<span className="font-semibold">{product.name}</span>
				<br />
				<span className="text-muted">Design {nr}</span>
			</td>
			<td className="space-y-2">
				<span className="font-semibold">{product.metadata.artnr}</span>
				<br />
				<span className="text-muted">{product.metadata.artnr2}</span>
			</td>
			<td className="font-semibold text-muted">
				{formatCurrencyString({
					value: product.price,
					currency: product.currency,
				})}
			</td>
		</tr>
	);
}

function GetImagePath(image: string) {
	return (
		"https://firebasestorage.googleapis.com/v0/b/uf-ecom.appspot.com/o/images%2F" +
		image +
		"?alt=media"
	);
}
