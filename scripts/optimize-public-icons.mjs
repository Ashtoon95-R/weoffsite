import { stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const ICONS_DIR = join(process.cwd(), 'public', 'icon');
const WEBP_QUALITY = 92;
const SOURCES = ['Logo-Completo.png', 'Logo-Icon.png'];

for (const file of SOURCES) {
	const inputPath = join(ICONS_DIR, file);
	const outputName = `${basename(file, extname(file))}.webp`;
	const outputPath = join(ICONS_DIR, outputName);

	const inputStats = await stat(inputPath);
	const metadata = await sharp(inputPath).metadata();

	await sharp(inputPath)
		.webp({ quality: WEBP_QUALITY, effort: 6, lossless: false, alphaQuality: 100 })
		.toFile(outputPath);

	const outputStats = await stat(outputPath);
	const saved = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

	console.log(
		`public/icon/${file} → public/icon/${outputName} (${metadata.width}x${metadata.height}, ${Math.round(inputStats.size / 1024)}KB → ${Math.round(outputStats.size / 1024)}KB, -${saved}%)`,
	);
}

console.log(`\nOptimized ${SOURCES.length} logo(s) to WebP (quality ${WEBP_QUALITY}).`);
