export function initGlareCards() {
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

	document.querySelectorAll<HTMLElement>('.glare-card').forEach((card) => {
		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			card.style.setProperty('--glare-x', String(x - rect.width * 0.5));
			card.style.setProperty('--glare-y', String(y - rect.height * 0.5));
		});

		card.addEventListener('mouseleave', () => {
			card.style.removeProperty('--glare-x');
			card.style.removeProperty('--glare-y');
		});
	});
}

initGlareCards();
