import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "use-shopping-cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_API_KEY as string;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<CartProvider
			cartMode="checkout-session"
			stripe={stripeKey}
			currency="SEK"
			shouldPersist>
			<Toaster />
			<Header />
			<Component {...pageProps} />
			<Footer />
		</CartProvider>
	);
}
