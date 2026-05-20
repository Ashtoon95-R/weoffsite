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
				ink:           '#0D0D0B',
				parchment:     '#F5F0E8',
				sand:          '#E8DCC8',
				gold:          '#C9A84C',
				forest:        '#2C3E2D',
				'forest-light':'#3A5C3B',
				rust:          '#C4522A',
				mist:          '#8B9E8B',
				// Legacy aliases → new palette
				primary:    '#0D0D0B',
				secondary:  '#2C3E2D',
				accent:     '#C9A84C',
				cta:        '#C4522A',
				background: '#F5F0E8',
				text:       '#0D0D0B',
			},
			fontFamily: {
				display: ['"Playfair Display"', 'Georgia', 'serif'],
				body:    ['"DM Sans"', 'sans-serif'],
				mono:    ['"Space Mono"', 'monospace'],
			},
			letterSpacing: {
				tighter: '-0.03em',
			},
			fontSize: {
				'10': '0.625rem',
				'11': '0.6875rem',
			},
		},
	},
	plugins: [],
};
