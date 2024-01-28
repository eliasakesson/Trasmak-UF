/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"files.stripe.com",
			"secure.webtoolhub.com",
			"firebasestorage.googleapis.com",
			"lh3.googleusercontent.com",
			"images.asos-media.com",
		],
	},
};

module.exports = nextConfig;
