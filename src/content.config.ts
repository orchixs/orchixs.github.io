import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const series = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/novel' }),
  schema: z.object({
    title: z.string(),
    author: z.string().default('Unknown'),
    cover: z.string().default(''),
    synopsis: z.string().default(''),
    status: z.enum(['Ongoing', 'Completed', 'Hiatus', 'Dropped']).default('Ongoing'),
    genres: z.array(Slug).default([]),
    year: z.number().int().min(1900).max(2100).optional(),
    draft: z.boolean().default(false),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '*/[0-9]*.md', base: './src/content/novel' }),
  schema: z.object({
    chapter: z.number().int().positive(),
    chapterTitle: z.string().optional(),
    publishedAt: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(200),
    cover: z.string().optional(),
    date: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Admin'),
    category: z.enum(['News', 'Review', 'List', 'Guide', 'Update']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { series, chapters, blog };