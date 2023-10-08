import Link from "next/link";

export default function Breadcrumbs({ productName }: { productName: string }) {
	return (
		<nav>
			<ol role="list" className="flex gap-4 text-muted">
				<li className="flex gap-4">
					<Link href="/">Hem</Link>
					<span>/</span>
				</li>
				<li className="flex gap-4">
					<Link href="/products">Produkter</Link>
					<span>/</span>
				</li>
				<li>{productName}</li>
			</ol>
		</nav>
	);
}
