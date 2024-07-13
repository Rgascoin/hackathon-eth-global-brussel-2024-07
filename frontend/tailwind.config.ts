import type { Config } from 'tailwindcss';

export default {
	theme: {
		extend: {
			colors: {
				White: '#FCFCFC',
				Black: '#080705',
				grey: '#1c1c1c',
				secondGrey: '#666a6c',
				customOrange: '#ef7219',
				customPurple: '#773e8a',
			},
			backgroundImage: {
				'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
			},
			fontFamily: {
				sans: ['BerkeleyMono', 'sans-serif'],
			},
		},
	},
	content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
	plugins: [],
} satisfies Config;
