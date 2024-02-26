import AdminWrapper from "@/components/admin/AdminWrapper";
import GetOrders, { GetOrder } from "@/utils/admin/getOrders";
import Link from "next/link";
import { formatCurrencyString } from "use-shopping-cart";

import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFViewer,
	Image,
} from "@react-pdf/renderer";

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
			<h1 className="text-5xl font-bold">Order PDF</h1>
			<PDFViewer className="h-screen w-full">
				<Document>
					<Page size="A4" style={styles.page}>
						<View style={styles.between}>
							<View style={{ flex: 1, gap: 2 }}>
								<Image
									src="/images/logo-big.png"
									style={{ flex: 1, aspectRatio: 1 }}
								></Image>
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
									<Text style={styles.p}>1002</Text>
								</View>
								<View style={styles.between}>
									<Text style={styles.p}>Datum</Text>
									<Text style={styles.p}>
										{new Date(
											Date.now(),
										).toLocaleDateString()}
									</Text>
								</View>
								<View style={styles.between}>
									<Text style={styles.p}>Leverantör</Text>
									<Text style={styles.p}>Åry Trays</Text>
								</View>
							</View>
						</View>
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
								<Text style={styles.p}>
									{order.customer.name}
								</Text>
								<Text style={styles.p}>
									{order.shipping.address.line1}
								</Text>
								<Text style={styles.p}>
									{order.shipping.address.postal_code}
								</Text>
								<Text style={styles.p}>
									{order.shipping.address.city},{" "}
									{order.shipping.address.country}
								</Text>
							</View>
							<View style={{ flex: 1 }}>
								<Text style={styles.h2}>Leveranssätt</Text>
								<Text style={styles.p}>
									Direkt till kund, enligt avtal
								</Text>
								<Text style={styles.h2}>
									Märkning på adresslapp
								</Text>
								<Text style={styles.p}>Träsmak UF</Text>
								<Text style={styles.h2}>Betalningsvillkor</Text>
								<Text style={styles.p}>30 dagar netto</Text>
							</View>
						</View>
						<View
							style={{
								borderTop: 1,
								marginTop: 16,
								paddingTop: 8,
								rowGap: 16,
							}}
						>
							<View style={styles.tableRow}>
								<Text
									style={[
										styles.tableCellHeader,
										styles.tableSmall,
									]}
								>
									Radnr.
								</Text>
								<Text style={styles.tableCellHeader}>
									Artikelnr.
								</Text>
								<Text
									style={[
										styles.tableCellHeader,
										styles.tableLarge,
									]}
								>
									Beskrivning.
								</Text>
								<Text style={styles.tableCellHeader}>
									Transport
								</Text>
								<Text
									style={[
										styles.tableCellHeader,
										styles.tableSmall,
									]}
								>
									Antal
								</Text>
								<Text style={styles.tableCellHeader}>
									Á pris
								</Text>
								<Text style={styles.tableCellHeader}>
									Belopp
								</Text>
							</View>
							{order.products.map((product: any, i: number) => (
								<View key={i}>
									<View style={styles.tableRow} key={i}>
										<Text
											style={[
												styles.tableCell,
												styles.tableSmall,
											]}
										>
											{i + 1}
										</Text>
										<Text style={styles.tableCell}>
											{product.metadata.artnr}
										</Text>
										<View
											style={[
												styles.tableCell,
												styles.tableLarge,
											]}
										>
											<Text style={{}}>
												{product.name}
											</Text>
										</View>
										<Text style={styles.tableCell}>
											{formatCurrencyString({
												value: product.price,
												currency: product.currency,
											})}
										</Text>
										<Text
											style={[
												styles.tableCell,
												styles.tableSmall,
											]}
										>
											{product.quantity}
										</Text>
										<Text style={styles.tableCell}>
											{formatCurrencyString({
												value: product.price,
												currency: product.currency,
											})}
										</Text>
										<Text style={styles.tableCell}>
											{formatCurrencyString({
												value:
													product.price *
													product.quantity,
												currency: product.currency,
											})}
										</Text>
									</View>
									<Image
										src={GetImagePath(product.image)}
										style={{
											width: "35%",
											border: 1,
											padding: 8,
											marginTop: 8,
											marginLeft: "9%",
										}}
									/>
								</View>
							))}
						</View>
					</Page>
				</Document>
			</PDFViewer>
		</div>
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
		marginVertical: 2,
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
	},
	tableSmall: {
		flex: 0.5,
	},
	tableLarge: {
		flex: 2,
	},
});

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
