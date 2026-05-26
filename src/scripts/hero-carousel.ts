const INTERVAL_MS = 5500;
const FADE_MS = 900;

function initHeroCarousel(root: HTMLElement) {
	const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-slide]'));
	const captions = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-caption]'));
	if (slides.length < 2) return;

	let index = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const setActive = (next: number) => {
		slides.forEach((slide, i) => {
			slide.classList.toggle('is-active', i === next);
		});
		captions.forEach((caption, i) => {
			caption.classList.toggle('is-active', i === next);
		});
		index = next;
	};

	const advance = () => setActive((index + 1) % slides.length);

	if (prefersReducedMotion) return;

	timer = window.setInterval(advance, INTERVAL_MS);

	root.addEventListener('mouseenter', () => {
		if (timer) window.clearInterval(timer);
	});
	root.addEventListener('mouseleave', () => {
		timer = window.setInterval(advance, INTERVAL_MS);
	});

	document.addEventListener('visibilitychange', () => {
		if (document.hidden && timer) {
			window.clearInterval(timer);
			timer = undefined;
		} else if (!document.hidden && !timer) {
			timer = window.setInterval(advance, INTERVAL_MS);
		}
	});
}

document.querySelectorAll<HTMLElement>('[data-hero-carousel]').forEach(initHeroCarousel);

export { FADE_MS };
