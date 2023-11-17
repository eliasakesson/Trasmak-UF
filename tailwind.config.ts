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
				background: colors.gray[50],
				border: colors.gray[200],
				border_dark: colors.gray[300],
				primary: colors.blue[800],
				primary_light: colors.blue[700],
				primary_dark: colors.blue[900],
			},
		},
	},
	plugins: [],
};
export default config;
