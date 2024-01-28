import type { Config } from "tailwindcss";

const colors = require("tailwindcss/colors");

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				muted: colors.gray[600],
				muted_light: colors.gray[400],
				background: colors.zinc[50],
				border: colors.gray[200],
				border_dark: colors.gray[300],
				primary: colors.green[800],
				primary_light: colors.green[700],
				primary_dark: colors.green[950],
				secondary: "#FFDE59",
			},
			screens: {
				"h-sm": { raw: "(min-height: 640px)" },
				"h-md": { raw: "(min-height: 768px)" },
				"h-lg": { raw: "(min-height: 1024px)" },
				"h-xl": { raw: "(min-height: 1280px)" },
			},
		},
	},
	plugins: [],
};
export default config;
