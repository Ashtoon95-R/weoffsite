import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n';
import kayzen1 from '../assets/retiro_empresa_kayzen/image1.webp';
import kayzen2 from '../assets/retiro_empresa_kayzen/image2.webp';
import kayzen3 from '../assets/retiro_empresa_kayzen/image3.webp';
import kayzen4 from '../assets/retiro_empresa_kayzen/image4.webp';
import kayzen5 from '../assets/retiro_empresa_kayzen/image5.webp';
import kayzen6 from '../assets/retiro_empresa_kayzen/image6.webp';
import kayzen7 from '../assets/retiro_empresa_kayzen/image7.webp';
import paperlike1 from '../assets/reuniones_teambuilding_paperlike/image1.webp';
import paperlike2 from '../assets/reuniones_teambuilding_paperlike/image2.webp';
import paperlike3 from '../assets/reuniones_teambuilding_paperlike/image3.webp';
import paperlike4 from '../assets/reuniones_teambuilding_paperlike/image4.webp';

export type GalleryImage = {
	src: ImageMetadata;
	alt: Record<Locale, string>;
};

const galleries: Record<string, GalleryImage[]> = {
	'kayzen-phuket': [
		{
			src: kayzen1,
			alt: {
				es: 'Vista aérea del equipo Kayzen nadando en aguas turquesas durante el retiro en Phuket',
				en: 'Aerial view of the Kayzen team swimming in turquoise waters during the Phuket retreat',
			},
		},
		{
			src: kayzen2,
			alt: {
				es: 'Dos lanchas rápidas navegando por un río tropical durante una excursión del retiro Kayzen',
				en: 'Two speedboats cruising a tropical river during a Kayzen retreat excursion',
			},
		},
		{
			src: kayzen3,
			alt: {
				es: 'Cartel de bienvenida a Kayzen en el muelle de la marina de Phuket',
				en: 'Welcome sign for Kayzen at the Phuket marina pier',
			},
		},
		{
			src: kayzen4,
			alt: {
				es: 'Vista aérea del resort de playa con piscinas y palmeras en Phuket',
				en: 'Aerial view of the beach resort with pools and palm trees in Phuket',
			},
		},
		{
			src: kayzen5,
			alt: {
				es: 'Autobús de traslado en la entrada del resort tropical para el retiro Kayzen',
				en: 'Transfer coach at the tropical resort entrance for the Kayzen retreat',
			},
		},
		{
			src: kayzen6,
			alt: {
				es: 'Vista aérea de la playa con el grupo Kayzen y lanchas en la orilla',
				en: 'Aerial view of the beach with the Kayzen group and boats on the shore',
			},
		},
		{
			src: kayzen7,
			alt: {
				es: 'Foto grupal del equipo Kayzen en la playa con lanchas y el mar de fondo',
				en: 'Group photo of the Kayzen team on the beach with boats and the sea behind',
			},
		},
	],
	'paperlike-barcelona': [
		{
			src: paperlike1,
			alt: {
				es: 'Momento del retiro corporativo de Paperlike en Barcelona',
				en: 'Moment from the Paperlike corporate retreat in Barcelona',
			},
		},
		{
			src: paperlike2,
			alt: {
				es: 'Actividad de team building durante el retiro de Paperlike en Barcelona',
				en: 'Team-building activity during the Paperlike retreat in Barcelona',
			},
		},
		{
			src: paperlike3,
			alt: {
				es: 'El equipo de Paperlike disfrutando del retiro en Barcelona',
				en: 'The Paperlike team enjoying the retreat in Barcelona',
			},
		},
		{
			src: paperlike4,
			alt: {
				es: 'Escena del offsite de Paperlike con el equipo reunido en Barcelona',
				en: 'Scene from the Paperlike offsite with the team gathered in Barcelona',
			},
		},
	],
};

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

export function getCaseStudyGallery(slug: string, locale: Locale): { src: ImageMetadata; alt: string }[] {
	const images = galleries[slug];
	if (!images) return [];

	return images.map(({ src, alt }) => ({
		src,
		alt: alt[locale],
	}));
}
