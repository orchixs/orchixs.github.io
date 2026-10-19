import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const NovelStatus = z.enum(['Ongoing', 'Completed', 'Hiatus', 'Dropped']);

const novel = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!**/_*.md', '**/_index.md'],
    base: './src/content/novel',
  }),
  schema: z.object({
    type: z.enum(['series', 'chapter']),

    // Series-only
    title: z.string().optional(),
    author: z.string().optional(),
    cover: z.string().url().optional(),
    synopsis: z.string().optional(),
    status: NovelStatus.optional(),
    genres: z.array(Slug).default([]),
    year: z.number().int().min(1900).max(2100).optional(),

    // Chapter-only
    chapter: z.number().int().positive().optional(),
    chapterTitle: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
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

export const collections = { novel, blog };