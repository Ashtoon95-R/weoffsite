import typography from '@tailwindcss/typography';

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
				canvas: 'var(--color-canvas)',
				surface: 'var(--color-surface)',
				espresso: 'var(--color-espresso)',
				muted: 'var(--color-muted)',
				rust: 'var(--color-rust)',
				gold: 'var(--color-gold)',
				sage: 'var(--color-sage)',
				border: 'var(--color-border)',
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)',
				cta: 'var(--color-cta)',
				background: 'var(--color-background)',
				text: 'var(--color-text)',
			},
			fontFamily: {
				heading: ['"Playfair Display"', 'Georgia', 'serif'],
				body: ['"DM Sans"', 'system-ui', 'sans-serif'],
				mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				editorial: '0 20px 40px -15px rgba(15, 16, 25, 0.06)',
			},
			transitionTimingFunction: {
				editorial: 'cubic-bezier(0.32, 0.72, 0, 1)',
			},
		},
	},
	plugins: [typography],
};
