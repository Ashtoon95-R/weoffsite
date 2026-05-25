import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const dirs = ['src/content/case-studies/es', 'src/content/case-studies/en'];

for (const dir of dirs) {
	const files = (await readdir(dir)).filter((file) => file.endsWith('.mdx'));
	for (const file of files) {
		const path = join(dir, file);
		const slug = basename(file, '.mdx');
		let content = await readFile(path, 'utf8');

		if (/^slug:\s/m.test(content)) continue;

		content = content.replace(/^---\n/, `---\nslug: "${slug}"\n`);
		await writeFile(path, content);
		console.log(`Added slug to ${path}`);
	}
}

console.log('Done.');
