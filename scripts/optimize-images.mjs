import { readFile, readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, basename, relative } from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';

const ASSETS_DIR = join(process.cwd(), 'src/assets');
const SKIP_DIRS = new Set(['fold', 'hero-carousel']);
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 90;
const KEEP_SOURCES = process.argv.includes('--keep-sources');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.heic', '.heif']);

async function collectSources(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const sources = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (SKIP_DIRS.has(entry.name)) {
				continue;
			}
			sources.push(...(await collectSources(fullPath)));
			continue;
		}
		if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
			sources.push(fullPath);
		}
	}

	return sources;
}

async function openPipeline(inputPath) {
	const ext = extname(inputPath).toLowerCase();
	if (ext === '.heic' || ext === '.heif') {
		const inputBuffer = await readFile(inputPath);
		const jpegBuffer = await convert({
			buffer: inputBuffer,
			format: 'JPEG',
			quality: 1,
		});
		return sharp(Buffer.from(jpegBuffer), { failOn: 'warning' });
	}
	return sharp(inputPath, { failOn: 'warning' });
}

const sources = await collectSources(ASSETS_DIR);

if (sources.length === 0) {
	console.log('No PNG/JPG/HEIC sources found under src/assets');
	process.exit(0);
}

for (const inputPath of sources) {
	const dir = join(inputPath, '..');
	const file = basename(inputPath);
	const outputName = `${basename(file, extname(file))}.webp`;
	const outputPath = join(dir, outputName);
	const relPath = relative(process.cwd(), inputPath);

	const inputStats = await stat(inputPath);
	const image = await openPipeline(inputPath);
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
		`${relPath} → ${relative(process.cwd(), outputPath)} (${outMeta.width}x${outMeta.height}, ${Math.round(inputStats.size / 1024)}KB → ${Math.round(outputStats.size / 1024)}KB, -${saved}%)`,
	);

	if (!KEEP_SOURCES) {
		await unlink(inputPath);
	}
}

console.log(`\nOptimized ${sources.length} image(s) to WebP (quality ${WEBP_QUALITY}, max ${MAX_WIDTH}px).`);
