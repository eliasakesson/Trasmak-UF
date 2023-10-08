/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["files.stripe.com", "secure.webtoolhub.com"],
	},
};

module.exports = nextConfig;
