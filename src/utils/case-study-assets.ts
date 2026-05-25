import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n';

export type GalleryItem = {
	src: ImageMetadata;
	alt: string;
};

const allImages = import.meta.glob<{ default: ImageMetadata }>('../assets/case-studies/*/*.{webp,jpg,jpeg,png}', {
	eager: true,
	import: 'default',
});

type ParsedImage = {
	slug: string;
	filename: string;
	src: ImageMetadata;
};

function parseImagePath(path: string, src: ImageMetadata): ParsedImage | null {
	const match = path.match(/\/case-studies\/([^/]+)\/([^/]+)$/);
	if (!match) return null;
	return { slug: match[1], filename: match[2], src };
}

const imagesBySlug = new Map<string, ParsedImage[]>();

for (const [path, src] of Object.entries(allImages)) {
	const parsed = parseImagePath(path, src);
	if (!parsed) continue;
	const list = imagesBySlug.get(parsed.slug) ?? [];
	list.push(parsed);
	imagesBySlug.set(parsed.slug, list);
}

function gallerySortKey(filename: string): string {
	return filename.replace(/\.(webp|jpe?g|png)$/i, '');
}

export function getCaseStudyCoverImage(slug: string): ImageMetadata | undefined {
	const images = imagesBySlug.get(slug);
	if (!images?.length) return undefined;

	const cover = images.find(({ filename }) => filename.startsWith('cover.'));
	return cover?.src ?? images.toSorted((a, b) => gallerySortKey(a.filename).localeCompare(gallerySortKey(b.filename)))[0]?.src;
}

export function getCaseStudyGallery(
	slug: string,
	locale: Locale,
	meta?: { company?: string; location?: string },
): GalleryItem[] {
	const images = imagesBySlug.get(slug);
	if (!images?.length) return [];

	const company = meta?.company ?? 'Case study';
	const location = meta?.location ?? '';

	const galleryImages = images
		.filter(({ filename }) => !filename.startsWith('cover.'))
		.toSorted((a, b) => gallerySortKey(a.filename).localeCompare(gallerySortKey(b.filename)));

	return galleryImages.map(({ src, filename }, index) => {
		const label = location ? `${company} — ${location}` : company;
		const suffix = galleryImages.length > 1 ? ` (${index + 1})` : '';
		return {
			src,
			alt: `${label}${suffix}`,
		};
	});
}

/** Bento-style column spans for a 6-column editorial grid. */
export function getGallerySpans(count: number): string[] {
	if (count >= 7) {
		return [
			'col-span-2 row-span-2 md:col-span-4 md:row-span-2',
			'md:col-span-2',
			'md:col-span-2',
			'md:col-span-2',
			'col-span-2 md:col-span-3',
			'col-span-2 md:col-span-3',
			'col-span-2 md:col-span-6',
		];
	}

	if (count >= 6) {
		return [
			'col-span-2 row-span-2 md:col-span-4 md:row-span-2',
			'md:col-span-2',
			'md:col-span-2',
			'md:col-span-2',
			'col-span-2 md:col-span-3',
			'col-span-2 md:col-span-3',
		];
	}

	if (count >= 4) {
		return [
			'col-span-2 row-span-2 md:col-span-4 md:row-span-2',
			'md:col-span-2',
			'md:col-span-3',
			'md:col-span-3',
		];
	}

	return Array.from({ length: count }, () => 'col-span-2 md:col-span-3');
}
