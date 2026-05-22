function animateValue(el: HTMLElement, target: number, suffix: string, duration: number) {
	const start = performance.now();
	const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReduced) {
		el.textContent = `${target}${suffix}`;
		return;
	}

	function frame(now: number) {
		const progress = Math.min((now - start) / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 3);
		const current = target % 1 !== 0 ? (eased * target).toFixed(1) : Math.round(eased * target).toString();
		el.textContent = `${current}${suffix}`;
		if (progress < 1) requestAnimationFrame(frame);
	}

	requestAnimationFrame(frame);
}

export function initCountUp() {
	const elements = document.querySelectorAll<HTMLElement>('[data-count-up]');
	if (!elements.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const el = entry.target as HTMLElement;
				const target = parseFloat(el.dataset.countUp ?? '0');
				const suffix = el.dataset.countSuffix ?? '';
				const duration = parseInt(el.dataset.countDuration ?? '1200', 10);
				animateValue(el, target, suffix, duration);
				observer.unobserve(el);
			});
		},
		{ threshold: 0.3 },
	);

	elements.forEach((el) => observer.observe(el));
}

initCountUp();
