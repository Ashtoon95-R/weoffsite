import type { ImageMetadata } from 'astro';
import balenaCover from '../assets/images/congreso_anual_balena.webp';
import definelyCover from '../assets/images/offsite_anual_definely.webp';
import incidentCover from '../assets/images/incident_io.webp';
import kayzenCover from '../assets/images/retiro_empresa_kayzen.webp';
import optiCover from '../assets/images/retiro_de_empresa_OPTI.webp';
import paperlikeCover from '../assets/images/reuniones_y_teambuilding_paperlike.webp';

const coverImages: Record<string, ImageMetadata> = {
	'balena-gran-canaria': balenaCover,
	'definely-algarve': definelyCover,
	'incident-grecia': incidentCover,
	'kayzen-phuket': kayzenCover,
	'opti-digital-pirineos': optiCover,
	'paperlike-barcelona': paperlikeCover,
};

export function getCaseStudyCoverImage(slug: string): ImageMetadata | undefined {
	return coverImages[slug];
}
