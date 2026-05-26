import { mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const FOLD_DIR = join(process.cwd(), 'src/assets/fold');
const OUT_DIR = join(process.cwd(), 'src/assets/hero-carousel');
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 1500;
const WEBP_QUALITY = 90;

const slides = [
	{ src: 'DUBAI - Capslock.webp', out: 'dubai-capslock.webp', cropRight: false },
	{ src: 'PARK CITY - Graphite.webp', out: 'park-city-graphite.webp', cropRight: false },
	{ src: 'PHUKET - Kayzen (2).webp', out: 'phuket-kayzen.webp', cropRight: true },
	{ src: 'WASHINGTON - Incident.webp', out: 'washington-incident.webp', cropRight: false },
	{ src: 'ATHENS - Incident.webp', out: 'athens-incident.webp', cropRight: true },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { src, out, cropRight } of slides) {
	const inputPath = join(FOLD_DIR, src);
	let pipeline = sharp(inputPath);
	const metadata = await pipeline.metadata();
	const width = metadata.width ?? TARGET_WIDTH;
	const height = metadata.height ?? TARGET_HEIGHT;

	if (cropRight && width > height) {
		const left = Math.floor(width / 2);
		pipeline = pipeline.extract({
			left,
			top: 0,
			width: width - left,
			height,
		});
	}

	await pipeline
		.resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover', position: 'centre' })
		.webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
		.toFile(join(OUT_DIR, out));

	console.log(`${basename(src)} → hero-carousel/${out}${cropRight ? ' (right half)' : ''}`);
}

console.log(`\nPrepared ${slides.length} hero carousel image(s) at ${TARGET_WIDTH}x${TARGET_HEIGHT}.`);
