import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tag: z.enum(['Guides', 'Opinion', 'Explainers', 'Product']),
    readingTime: z.string(),
    cover: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
