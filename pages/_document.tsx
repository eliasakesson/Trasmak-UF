import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Gourgette:wght@400&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Sono&family=Whisper&display=swap"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Sono&family=Whisper&display=swap"
					rel="stylesheet"
				></link>
				<meta
					name="keywords"
					content="bricka, träbricka, trä, design, specialdesign, mat, fika, personlig, motiv, snygg, bilder"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
