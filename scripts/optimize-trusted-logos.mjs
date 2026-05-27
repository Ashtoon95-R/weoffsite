import { rename, stat, unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const LOGOS_DIR = join(process.cwd(), 'public', 'logos');
const SLOT_WIDTH = 240;
const SLOT_HEIGHT = 72;
const WEBP_QUALITY = 92;

/** Source file → canonical WebP for LogoBar */
const LOGO_SOURCES = [
	{ src: 'kayzen-logo-square400x400.png', out: 'kayzen.webp' },
	{ src: 'paperlike.jpg', out: 'paperlike.webp' },
	{ src: 'wordmark-colour-dark.png', out: 'incident-io.webp' },
	{ src: 'Opti-Digital-Logo-Feb-2023.png', out: 'opti-digital.webp' },
	{ src: 'balena-io-logo-vector.png', out: 'balena.webp' },
	{ src: 'definely.png', out: 'definely.webp' },
	{ src: 'capslock.png', out: 'capslock.webp' },
	{ src: 'graphite.png', out: 'graphite.webp' },
	{ src: 'glassnode.webp', out: 'glassnode.webp' },
	{ src: 'infinit.jpg', out: 'infinit.webp' },
	{ src: 'FloVision-Solutions-Logo-Full-Color-Small.png', out: 'flovision.webp' },
];

async function normalizeLogo(inputPath) {
	let buffer;
	try {
		buffer = await sharp(inputPath).trim({ threshold: 24 }).toBuffer();
	} catch {
		buffer = await sharp(inputPath).toBuffer();
	}

	return sharp(buffer).resize(SLOT_WIDTH, SLOT_HEIGHT, {
		fit: 'contain',
		position: 'centre',
		background: { r: 0, g: 0, b: 0, alpha: 0 },
		withoutEnlargement: false,
	});
}

let processed = 0;

for (const { src, out } of LOGO_SOURCES) {
	const inputPath = join(LOGOS_DIR, src);
	const outputPath = join(LOGOS_DIR, out);

	try {
		await stat(inputPath);
	} catch {
		console.warn(`Skip (missing): ${src}`);
		continue;
	}

	const inputStats = await stat(inputPath);
	const tempPath = join(LOGOS_DIR, `.tmp-${out}`);

	const pipeline = await normalizeLogo(inputPath);
	await pipeline
		.webp({ quality: WEBP_QUALITY, effort: 6, alphaQuality: 100 })
		.toFile(tempPath);

	if (src !== out) {
		await rename(tempPath, outputPath);
	} else {
		try {
			await unlink(outputPath);
			await rename(tempPath, outputPath);
		} catch {
			const fallback = join(LOGOS_DIR, out.replace('.webp', '-optimized.webp'));
			await rename(tempPath, fallback);
			console.warn(`  → wrote ${basename(fallback)} (close ${out} in editor and re-run)`);
		}
	}

	const outMeta = await sharp(outputPath).metadata();
	const outputStats = await stat(outputPath);
	console.log(
		`${src} → ${out} (${outMeta.width}x${outMeta.height}, ${Math.round(inputStats.size / 1024)}KB → ${Math.round(outputStats.size / 1024)}KB)`,
	);
	processed++;
}

console.log(
	`\nOptimized ${processed} logo(s) to ${SLOT_WIDTH}x${SLOT_HEIGHT}px slots (quality ${WEBP_QUALITY}).`,
);
