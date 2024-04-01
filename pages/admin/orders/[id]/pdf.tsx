import AdminWrapper from "@/components/admin/AdminWrapper";
import { GetOrder } from "@/utils/stripe/getOrders";
import Link from "next/link";
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFViewer,
	Image as PDFImage,
} from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import axios from "axios";

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
	const [orderNr, setOrderNr] = useState(1000);

	useEffect(() => {
		if (!user) return;

		async function getOrders() {
			const order = await GetOrder(router.query.id as string);
			setOrder(order);
		}

		getOrders();
	}, [router, user]);

	if (!order) return null;

	return (
		<div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-8 py-16">
			<Link href="/admin">{"<- Admin"}</Link>
			<input
				type="number"
				value={orderNr}
				onChange={(e) => setOrderNr(parseInt(e.target.value))}
			/>
			<PDFViewer className="h-screen w-full">
				<Document>
					<Page
						size="A4"
						orientation="portrait"
						wrap={true}
						style={styles.page}
					>
						<Top orderNr={orderNr} />
						<Info order={order} />
						<Products products={order.products} />
						<Summary order={order} />
						<Footer />
					</Page>
				</Document>
			</PDFViewer>
		</div>
	);
}

function Top({ orderNr }: { orderNr: number }) {
	return (
		<View style={styles.between}>
			<View style={{ flex: 1, gap: 2 }}>
				<PDFImage
					src="/images/logo-big.png"
					style={{ flex: 1, aspectRatio: 1 }}
				></PDFImage>
				<Text>Träsmak UF</Text>
			</View>
			<View
				style={{
					border: 2,
					padding: 16,
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontWeight: "bold",
						marginBottom: 12,
					}}
				>
					Beställning
				</Text>
				<View style={styles.between}>
					<Text style={styles.p}>Nr</Text>
					<Text style={styles.p}>{orderNr}</Text>
				</View>
				<View style={styles.between}>
					<Text style={styles.p}>Datum</Text>
					<Text style={styles.p}>
						{new Date(Date.now()).toLocaleDateString()}
					</Text>
				</View>
				<View style={styles.between}>
					<Text style={styles.p}>Leverantör</Text>
					<Text style={styles.p}>Åry Trays</Text>
				</View>
			</View>
		</View>
	);
}

function Info({ order }: { order: any }) {
	return (
		<View
			style={{
				borderTop: 1,
				marginTop: 32,
				paddingTop: 8,
				flexDirection: "row",
			}}
		>
			<View style={{ flex: 1 }}>
				<Text style={styles.h2}>Leveransadress</Text>
				<Text style={styles.p}>{order.customer.name}</Text>
				<Text style={styles.p}>{order.shipping.address.line1}</Text>
				<Text style={styles.p}>
					{order.shipping.address.postal_code}
				</Text>
				<Text style={styles.p}>
					{order.shipping.address.city},{" "}
					{order.shipping.address.country}
				</Text>
				<Text style={styles.h2}>Kontaktuppgifter</Text>
				<Text style={styles.p}>{order.customer.email}</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.h2}>Leveranssätt</Text>
				<Text style={styles.p}>Direkt till kund, enligt avtal</Text>
				<Text style={styles.h2}>Märkning på adresslapp</Text>
				<Text style={styles.p}>Träsmak UF</Text>
				<Text style={styles.h2}>Betalningsvillkor</Text>
				<Text style={styles.p}>30 dagar netto</Text>
			</View>
		</View>
	);
}

function Products({ products }: { products: any }) {
	const [productImages, setProductImages] = useState<any[]>([]);

	async function GetImages() {
		const images = products.map((product: any) =>
			GetImagePath(product.image),
		);

		axios
			.post("/api/compressImages", { images })
			.then((res) => {
				const convertedImages = res.data.compressedImages.map(
					(image: string) => {
						const binaryString = atob(image);
						const byteArray = new Uint8Array(binaryString.length);
						for (let i = 0; i < binaryString.length; i++) {
							byteArray[i] = binaryString.charCodeAt(i);
						}
						return byteArray;
					},
				);
				setProductImages(convertedImages);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	// useEffect(() => {
	// 	GetImages();
	// }, [products]);

	return (
		<View
			style={{
				borderTop: 1,
				marginTop: 16,
				paddingTop: 8,
				rowGap: 16,
			}}
		>
			<View style={styles.tableRow}>
				<Text style={[styles.tableCellHeader, styles.tableSmall]}>
					Radnr.
				</Text>
				<Text style={styles.tableCellHeader}>Artikelnr.</Text>
				<Text style={[styles.tableCellHeader, styles.tableXLarge]}>
					Beskrivning.
				</Text>
				<Text style={[styles.tableCellHeader, styles.tableLarge]}>
					Transport
				</Text>
				<Text style={[styles.tableCellHeader, styles.tableSmall]}>
					Antal
				</Text>
				<Text style={styles.tableCellHeader}>Á pris</Text>
				<Text style={styles.tableCellHeader}>Belopp</Text>
			</View>
			{products.map((product: any, i: number) => (
				<View key={i} wrap={false}>
					<View style={styles.tableRow} key={i}>
						<Text style={[styles.tableCell, styles.tableSmall]}>
							{i + 1}
						</Text>
						<Text style={styles.tableCell}>
							{product.metadata.artnr2}
						</Text>
						<View style={[styles.tableCell, styles.tableXLarge]}>
							<Text>{product.name}</Text>
							<Text>Bifogade mallar nr.{i + 1}</Text>
							<Text>{product.metadata.artnr}</Text>
						</View>
						<Text
							style={[styles.tableCellHeader, styles.tableLarge]}
						>
							Enligt avtal
						</Text>
						<Text style={[styles.tableCell, styles.tableSmall]}>
							{product.quantity}
						</Text>
						<Text style={styles.tableCell}>
							{Number(product.metadata.gross).toFixed(2)}
						</Text>
						<Text style={styles.tableCell}>
							{(
								product.metadata.gross * product.quantity
							).toFixed(2)}
						</Text>
					</View>
					<PDFImage
						src={GetImagePath(product.image)}
						style={{
							width: "20%",
							border: 1,
							padding: 8,
							marginTop: 8,
							marginLeft: "9%",
						}}
					/>
				</View>
			))}
			<View style={styles.tableRow}>
				<Text style={[styles.tableCell, styles.tableSmall]}>1</Text>
				<Text style={styles.tableCell}>Frakt</Text>
				<View style={[styles.tableCell, styles.tableXLarge]}>
					<Text>Frakt</Text>
				</View>
				<Text
					style={[styles.tableCellHeader, styles.tableLarge]}
				></Text>
				<Text style={[styles.tableCell, styles.tableSmall]}>1</Text>
				<Text style={styles.tableCell}>71.20</Text>
				<Text style={styles.tableCell}>71.20</Text>
			</View>
		</View>
	);
}

function Summary({ order }: { order: any }) {
	const totalGross = useMemo(
		() =>
			order.products.reduce(
				(acc: number, product: any) =>
					acc + product.metadata.gross * product.quantity,
				0,
			) + 71.2,
		[order.products],
	);

	return (
		<View
			style={{
				borderTop: 1,
				marginTop: 32,
				paddingTop: 8,
				flexDirection: "row",
				justifyContent: "flex-end",
				gap: 64,
			}}
		>
			<View>
				<Text style={styles.p}>Totalt exkl. moms</Text>
				<Text style={styles.p}>Moms</Text>
				<Text style={styles.p}>Totalt inkl. moms</Text>
			</View>
			<View>
				<Text style={styles.p}>{totalGross.toFixed(2)}</Text>
				<Text style={styles.p}>{(totalGross * 0.25).toFixed(2)}</Text>
				<Text style={[styles.p, { fontSize: 14 }]}>
					{(totalGross * 1.25).toFixed(2)}
				</Text>
			</View>
		</View>
	);
}

function Footer() {
	return (
		<View
			style={{
				borderTop: 1,
				marginTop: 32,
				paddingTop: 8,
				flexDirection: "row",
			}}
		>
			<View style={{ flex: 1 }}>
				<Text style={styles.h2}>Adress</Text>
				<Text style={styles.p}>Hjälshammar Cedernäs 1</Text>
				<Text style={styles.p}>331 44Värnamo</Text>
				<Text style={styles.p}>Sverige</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.h2}>Telefon</Text>
				<Text style={styles.p}>+46 (0)70-344 23 65</Text>
				<Text style={styles.h2}>Mail</Text>
				<Text style={styles.p}>trasmakuf@gmail.com</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Text style={styles.h2}>Org. nr.</Text>
				<Text style={styles.p}>1127765</Text>
				<Text style={styles.h2}>Hemsida</Text>
				<Text style={styles.p}>www.trasmakuf.se</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		padding: 50,
	},
	between: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 48,
	},
	h2: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 8,
		marginTop: 16,
	},
	h3: {
		fontSize: 12,
		fontWeight: "bold",
	},
	p: {
		fontSize: 12,
		marginVertical: 4,
	},
	tableRow: {
		flexDirection: "row",
		columnGap: 16,
	},
	tableCellHeader: {
		flex: 1,
		fontSize: 12,
		fontWeight: "bold",
	},
	tableCell: {
		flex: 1,
		fontSize: 12,
		rowGap: 2,
	},
	tableSmall: {
		flex: 0.75,
	},
	tableLarge: {
		flex: 2,
	},
	tableXLarge: {
		flex: 3,
	},
});

export function GetImagePath(image: string) {
	return (
		"https://firebasestorage.googleapis.com/v0/b/uf-ecom.appspot.com/o/images%2F" +
		image +
		"?alt=media"
	);
}
