function initContactForms() {
	document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach((form) => {
		const endpoint = form.dataset.endpoint?.trim();
		const statusEl = form.querySelector<HTMLElement>('.contact-form-status');
		const submitBtn = form.querySelector<HTMLButtonElement>('.contact-form-submit');

		form.addEventListener('submit', async (event) => {
			if (!form.checkValidity()) {
				form.reportValidity();
				return;
			}

			event.preventDefault();

			const successMessage = form.dataset.successMessage ?? 'Thank you!';
			const errorMessage = form.dataset.errorMessage ?? 'Something went wrong.';

			if (!endpoint) {
				showStatus(statusEl, errorMessage, 'error');
				return;
			}

			const honeypot = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
			if (honeypot?.value) return;

			submitBtn?.setAttribute('disabled', 'true');
			showStatus(statusEl, '', 'neutral');

			const payload = Object.fromEntries(new FormData(form).entries());

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) throw new Error('Request failed');

				form.reset();
				showStatus(statusEl, successMessage, 'success');
			} catch {
				showStatus(statusEl, errorMessage, 'error');
			} finally {
				submitBtn?.removeAttribute('disabled');
			}
		});
	});
}

function showStatus(el: HTMLElement | null, message: string, tone: 'success' | 'error' | 'neutral') {
	if (!el) return;

	if (!message) {
		el.classList.add('hidden');
		el.textContent = '';
		return;
	}

	el.textContent = message;
	el.classList.remove('hidden', 'text-sage', 'text-rust');
	el.classList.add(tone === 'success' ? 'text-sage' : 'text-rust');
}

initContactForms();
