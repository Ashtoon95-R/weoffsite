import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		company: z.string(),
		location: z.string(),
		quote: z.string(),
		author: z.string(),
		authorRole: z.string(),
		lang: z.enum(['es', 'en']),
		date: z.date(),
		order: z.number().default(99),
	}),
});

export const collections = { 'case-studies': caseStudies };
