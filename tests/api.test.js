const testJSON = {
	price_1O3iMPBwTscfW232wipYDmfH: {
		id: "price_1O3iMPBwTscfW232wipYDmfH",
		price: 31900,
		currency: "sek",
		name: "Egen Design",
		description: "Skapa din egen bricka från en bild",
		image: "https://files.stripe.com/links/MDB8YWNjdF8xTnlNTjdCd1RzY2ZXMjMyfGZsX3Rlc3RfYTB5SzJnVjlDbVIwOUlyZWQwYmVXdlBa005dEvrRUA",
		metadata: { best_seller: "true", type: "template" },
		quantity: 1,
		value: 31900,
		price_data: {},
		product_data: {
			images: [
				"https://files.stripe.com/links/MDB8YWNjdF8xTnlNTjdCd1RzY2ZXMjMyfGZsX3Rlc3RfYTB5SzJnVjlDbVIwOUlyZWQwYmVXdlBa005dEvrRUA",
			],
		},
		formattedValue: "319,00 kr",
		formattedPrice: "319,00 kr",
	},
};

const correctJSON = {
	images: [
		"https://files.stripe.com/links/MDB8YWNjdF8xTnlNTjdCd1RzY2ZXMjMyfGZsX3Rlc3RfYTB5SzJnVjlDbVIwOUlyZWQwYmVXdlBa005dEvrRUA",
	],
};

it("should return a metadata object", () => {
	const metadata = {
		data: [
			Object.values(cartDetails)?.map((item) => {
				return {
					name: item.name,
					data: item.product_data,
				};
			}),
		],
	};
});
