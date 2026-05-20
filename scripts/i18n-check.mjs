import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function flattenKeys(obj, prefix = '') {
	const keys = [];
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
			keys.push(...flattenKeys(value, path));
		} else {
			keys.push(path);
		}
	}
	return keys.sort();
}

const en = JSON.parse(readFileSync(join(root, 'src/i18n/en.json'), 'utf8'));
const es = JSON.parse(readFileSync(join(root, 'src/i18n/es.json'), 'utf8'));

const enKeys = new Set(flattenKeys(en));
const esKeys = new Set(flattenKeys(es));

const missingInEs = [...enKeys].filter((k) => !esKeys.has(k));
const missingInEn = [...esKeys].filter((k) => !enKeys.has(k));

let failed = false;

if (missingInEs.length > 0) {
	failed = true;
	console.error('Keys missing in es.json:');
	missingInEs.forEach((k) => console.error(`  - ${k}`));
}

if (missingInEn.length > 0) {
	failed = true;
	console.error('Keys missing in en.json:');
	missingInEn.forEach((k) => console.error(`  - ${k}`));
}

if (failed) {
	process.exit(1);
}

console.log(`i18n OK: ${enKeys.size} keys matched in en.json and es.json`);
