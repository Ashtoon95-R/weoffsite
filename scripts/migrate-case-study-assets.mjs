import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'src/assets');
const outRoot = join(root, 'case-studies');

const migrations = [
	{
		slug: 'kayzen-phuket',
		cover: join(root, 'images/retiro_empresa_kayzen.webp'),
		galleryDir: join(root, 'retiro_empresa_kayzen'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
	{
		slug: 'paperlike-barcelona',
		cover: join(root, 'images/reuniones_y_teambuilding_paperlike.webp'),
		galleryDir: join(root, 'reuniones_teambuilding_paperlike'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
	{
		slug: 'balena-gran-canaria',
		cover: join(root, 'images/congreso_anual_balena.webp'),
		galleryDir: join(root, 'congreso_anual_balena_gran_canaria'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
	{
		slug: 'definely-algarve',
		cover: join(root, 'images/offsite_anual_definely.webp'),
		galleryDir: join(root, 'offsite_anual_definely_algarve'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
	{
		slug: 'incident-grecia',
		cover: join(root, 'images/incident_io.webp'),
		galleryDir: join(root, 'evento_incident_grecia'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
	{
		slug: 'opti-digital-pirineos',
		cover: join(root, 'images/retiro_de_empresa_OPTI.webp'),
		galleryDir: join(root, 'retiro_empresa_OPTI_Digital'),
		galleryPattern: /^image(\d+)\.webp$/,
	},
];

for (const { slug, cover, galleryDir, galleryPattern } of migrations) {
	const destDir = join(outRoot, slug);
	await mkdir(destDir, { recursive: true });
	await copyFile(cover, join(destDir, 'cover.webp'));

	const files = (await readdir(galleryDir)).filter((file) => galleryPattern.test(file));
	files.sort((a, b) => {
		const ai = Number(a.match(galleryPattern)?.[1] ?? 0);
		const bi = Number(b.match(galleryPattern)?.[1] ?? 0);
		return ai - bi;
	});

	for (const file of files) {
		const index = file.match(galleryPattern)?.[1]?.padStart(2, '0') ?? '00';
		await copyFile(join(galleryDir, file), join(destDir, `${index}.webp`));
	}

	console.log(`Migrated ${slug}: cover + ${files.length} gallery image(s)`);
}

const legacyDirs = [
	'retiro_empresa_kayzen',
	'reuniones_teambuilding_paperlike',
	'congreso_anual_balena_gran_canaria',
	'offsite_anual_definely_algarve',
	'evento_incident_grecia',
	'retiro_empresa_OPTI_Digital',
];

for (const dir of legacyDirs) {
	await rm(join(root, dir), { recursive: true, force: true });
}

const legacyCovers = [
	'congreso_anual_balena.webp',
	'incident_io.webp',
	'offsite_anual_definely.webp',
	'retiro_de_empresa_OPTI.webp',
	'retiro_empresa_kayzen.webp',
	'reuniones_y_teambuilding_paperlike.webp',
];

for (const file of legacyCovers) {
	await rm(join(root, 'images', file), { force: true });
}

console.log('\nMigration complete.');
