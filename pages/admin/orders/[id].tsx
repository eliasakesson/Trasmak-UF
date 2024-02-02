import AdminWrapper from "@/components/admin/AdminWrapper";
import GetOrders, { GetOrder } from "@/utils/admin/getOrders";
import Image from "next/image";
import Link from "next/link";
import { formatCurrencyString } from "use-shopping-cart";

export default function AdminOrder({ order }: { order: any }) {
	return (
		<AdminWrapper>
			<AdminPage order={order} />
		</AdminWrapper>
	);
}

function AdminPage({ order }: { order: any }) {
	console.log(order);

	return (
		<div className="mx-auto max-w-7xl space-y-8 px-8 py-16">
			<Link href="/admin">{"<- Admin"}</Link>
			<h1 className="text-5xl font-bold">Order</h1>
			<div className="flex flex-wrap gap-16">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<h2 className="text-2xl font-bold">
							{order.customer.name}
						</h2>
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
				<div className="flex flex-col gap-4">
					<h2 className="text-2xl font-bold">Leverans</h2>
					<div className="space-y-2">
						<p>{order.shipping.name}</p>
						<p>{order.shipping.address.line1}</p>
						<p>{order.shipping.address.postal_code}</p>
						<p>
							{order.shipping.address.city},{" "}
							{order.shipping.address.country}
						</p>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Produkter</h2>
					<div className="space-y-4">
						{order.products.map((product: any, i: number) => (
							<Product product={product} key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function Product({ product }: { product: any }) {
	return (
		<div className="flex flex-col gap-8 border-2 p-4">
			<div className="flex items-center gap-4">
				<Image
					src={product.product.images[0]}
					alt=""
					width={64}
					height={64}
				/>
				<div>
					<h3 className="font-semibold">{product.product.name}</h3>
					<span>{product.quantity} st</span>
				</div>
			</div>
			<div>
				{product.designs.map((design: any, i: number) => (
					<a
						key={i}
						href={GetImagePath(design.image)}
						target="_blank"
						rel="noreferrer"
					>
						<div className="flex items-center gap-4">
							<div className="">
								<Image
									className="aspect-square object-contain mix-blend-multiply"
									src={GetImagePath(design.image)}
									alt=""
									width={48}
									height={48}
								/>
							</div>
							<div className="flex-1">
								<h2 className="text-xl font-semibold">
									Design {i + 1}
								</h2>
							</div>
							<span>{design.count} st</span>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}

function GetImagePath(image: string) {
	return (
		"https://firebasestorage.googleapis.com/v0/b/uf-ecom.appspot.com/o/images%2F" +
		image +
		"?alt=media"
	);
}

export async function getStaticProps({ params }: { params: { id: string } }) {
	const order = await GetOrder(params.id);

	return {
		props: {
			order,
		},
		revalidate: 3600,
	};
}

export async function getStaticPaths() {
	const orders = await GetOrders();

	const paths = orders.map((order: any) => ({
		params: {
			id: order.id,
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
}
