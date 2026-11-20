import { defineCollection, z } from 'astro:content';

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    author: z.string().trim().min(1),
    published: z.coerce.date(),
    cover: z.string().regex(/^\/assets\/images\/[\w./-]+$/),
    coverAlt: z.string(),
    draft: z.boolean().default(true),
    excerpt: z.string().optional(),
    seoTitle: z.string().optional()
  })
});

export const collections = { insights };
