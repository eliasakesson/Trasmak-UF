import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "use-shopping-cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createContext, useState } from "react";
import { DesignProps } from "@/utils/designer/Interfaces";
import CookieConsent from "@/components/CookieConsent";

export const SiteContext = createContext<{
	design: DesignProps | null;
	setDesign: (design: DesignProps | null) => void;
}>({ design: null, setDesign: () => {} });

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_API_KEY as string;

export default function App({ Component, pageProps }: AppProps) {
	const [design, setDesign] = useState<DesignProps | null>(null);

	return (
		<CartProvider
			cartMode="checkout-session"
			stripe={stripeKey}
			currency="SEK"
			shouldPersist
		>
			<Toaster />
			<Header />
			<CookieConsent />
			<SiteContext.Provider value={{ design, setDesign }}>
				<Component {...pageProps} />
			</SiteContext.Provider>
			<Footer />
		</CartProvider>
	);
}
