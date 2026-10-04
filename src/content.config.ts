import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Path relative to the post file, e.g. "./cover.jpg" (optimized at build time)
			heroImage: image().optional(),
			// Name of whoever wrote the post (optional, no default)
			author: z.string().trim().min(1).optional(),
			// Language of the post, e.g. "it" (default: English) — read aloud correctly by screen readers
			lang: z.string().trim().min(2).default("en"),
			// Topics, e.g. ["travel", "food"]; case and accents are normalized in URLs
			tags: z.array(z.string().trim().toLowerCase().min(1)).default([]),
			// Draft posts are excluded from the home page, post routes and RSS feed
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
