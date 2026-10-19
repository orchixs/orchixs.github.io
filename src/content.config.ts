// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

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

export const collections = { blog };