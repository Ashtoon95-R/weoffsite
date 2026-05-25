import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export function initGalleryLightbox() {
	const galleries = document.querySelectorAll<HTMLElement>('[data-gallery-lightbox]');
	if (!galleries.length) return;

	galleries.forEach((gallery) => {
		const lightbox = new PhotoSwipeLightbox({
			gallery,
			children: 'a',
			pswpModule: () => import('photoswipe'),
			wheelToZoom: true,
			initialZoomLevel: 'fit',
			secondaryZoomLevel: 2,
			maxZoomLevel: 4,
		});

		lightbox.init();
	});
}

initGalleryLightbox();
