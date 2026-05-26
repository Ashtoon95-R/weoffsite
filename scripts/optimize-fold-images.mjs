import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, basename, relative } from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';

const FOLD_DIR = join(process.cwd(), 'src/assets/fold');
const WEBP_QUALITY = 95;
const KEEP_SOURCES = process.argv.includes('--keep-sources');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.heic', '.heif']);

const entries = await readdir(FOLD_DIR, { withFileTypes: true });
const sources = entries
	.filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(extname(e.name).toLowerCase()))
	.map((e) => join(FOLD_DIR, e.name));

if (sources.length === 0) {
	console.log('No source images found in src/assets/fold');
	process.exit(0);
}

for (const inputPath of sources) {
	const file = basename(inputPath);
	const outputName = `${basename(file, extname(file))}.webp`;
	const outputPath = join(FOLD_DIR, outputName);
	const relPath = relative(process.cwd(), inputPath);

	const inputStats = await stat(inputPath);
	const ext = extname(file).toLowerCase();
	let pipeline;

	if (ext === '.heic' || ext === '.heif') {
		const inputBuffer = await readFile(inputPath);
		const jpegBuffer = await convert({
			buffer: inputBuffer,
			format: 'JPEG',
			quality: 1,
		});
		pipeline = sharp(Buffer.from(jpegBuffer), { failOn: 'warning' });
	} else {
		pipeline = sharp(inputPath, { failOn: 'warning' });
	}

	const metadata = await pipeline.metadata();
	const isJpeg = ['.jpg', '.jpeg'].includes(ext);

	let quality = WEBP_QUALITY;
	if (isJpeg) {
		for (const candidate of [95, 90, 85]) {
			const probe = await pipeline.clone().webp({ quality: candidate, effort: 6, smartSubsample: true }).toBuffer();
			if (probe.length <= inputStats.size * 1.05) {
				quality = candidate;
				break;
			}
			quality = candidate;
		}
	}

	await pipeline
		.webp({ quality, effort: 6, smartSubsample: true, nearLossless: false })
		.toFile(outputPath);

	const outputStats = await stat(outputPath);
	const saved = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
	const outMeta = await sharp(outputPath).metadata();

	console.log(
		`${relPath} → ${relative(process.cwd(), outputPath)} (q${quality}, ${metadata.width}x${metadata.height} → ${outMeta.width}x${outMeta.height}, ${Math.round(inputStats.size / 1024)}KB → ${Math.round(outputStats.size / 1024)}KB, ${saved}% smaller)`,
	);

	if (!KEEP_SOURCES) {
		const { unlink } = await import('node:fs/promises');
		await unlink(inputPath);
	}
}

console.log(
	`\nConverted ${sources.length} image(s) to WebP (quality ${WEBP_QUALITY}, full resolution).` +
		(KEEP_SOURCES ? ' Sources kept (--keep-sources).' : ' Sources removed.'),
);
