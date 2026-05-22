import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const IMAGES_DIR = join(process.cwd(), 'src/assets/images');
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 90;
const KEEP_SOURCES = process.argv.includes('--keep-sources');

const files = await readdir(IMAGES_DIR);
const sources = files.filter((file) => ['.png', '.jpg', '.jpeg'].includes(extname(file).toLowerCase()));

if (sources.length === 0) {
	console.log('No PNG/JPG sources found in src/assets/images');
	process.exit(0);
}

for (const file of sources) {
	const inputPath = join(IMAGES_DIR, file);
	const outputName = `${basename(file, extname(file))}.webp`;
	const outputPath = join(IMAGES_DIR, outputName);

	const inputStats = await stat(inputPath);
	const image = sharp(inputPath);
	const metadata = await image.metadata();
	const width = metadata.width ?? MAX_WIDTH;
	const targetWidth = Math.min(width, MAX_WIDTH);

	await image
		.resize({ width: targetWidth, withoutEnlargement: true })
		.webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: false })
		.toFile(outputPath);

	const outputStats = await stat(outputPath);
	const saved = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
	const outMeta = await sharp(outputPath).metadata();

	console.log(
		`${file} → ${outputName} (${outMeta.width}x${outMeta.height}, ${Math.round(inputStats.size / 1024)}KB → ${Math.round(outputStats.size / 1024)}KB, -${saved}%)`,
	);

	if (!KEEP_SOURCES) {
		await unlink(inputPath);
	}
}

console.log(`\nOptimized ${sources.length} image(s) to WebP (quality ${WEBP_QUALITY}, max ${MAX_WIDTH}px).`);
