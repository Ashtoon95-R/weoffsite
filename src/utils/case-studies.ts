export function getCaseStudySlug(id: string): string {
	const basename = id.split('/').pop() ?? id;
	return basename.replace(/\.mdx?$/, '');
}
