import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/index.md",
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ""), // id = folder name
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.md",
    generateId: ({ entry }) => entry.replace(/(\/index)?\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { posts, pages };