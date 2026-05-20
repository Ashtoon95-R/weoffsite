/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		screens: {
			sm: '375px',
			md: '768px',
			lg: '1024px',
			xl: '1440px',
		},
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)',
				cta: 'var(--color-cta)',
				background: 'var(--color-background)',
				text: 'var(--color-text)',
			},
			fontFamily: {
				heading: ['Lexend', 'sans-serif'],
				body: ['"Source Sans 3"', 'sans-serif'],
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
			},
		},
	},
	plugins: [],
};
