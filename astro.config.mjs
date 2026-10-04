// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import config from "./site.config.mjs";
import ogImages from "./src/og/og-images.mjs";

// Remind whoever starts from the template to fill in site.config.mjs
if (config.url === "https://example.com") {
	console.warn("[astrochicken] Set your blog's address (url) in site.config.mjs");
}
if (config.github.repo === "your-name/your-blog") {
	console.warn("[astrochicken] Set your GitHub repository (github.repo) in site.config.mjs for the writing panel");
}

// https://astro.build/config
export default defineConfig({
	site: config.url,
	redirects: {
		"/blog": "/",
		// Browsers and crawlers request /favicon.ico when a page doesn't declare an icon (e.g. the RSS feed)
		"/favicon.ico": "/favicon.svg",
	},
	// Keep Astro 5 whitespace handling (Astro 7 defaults to "jsx", which removes spaces between inline elements)
	compressHTML: true,
	// The site's CSS is small: inline it in each page instead of separate render-blocking files
	build: { inlineStylesheets: "always" },
	integrations: [
		mdx(),
		// The writing panel (/admin/) isn't a page for readers
		sitemap({ filter: (page) => !new URL(page).pathname.startsWith("/admin/") }),
		// Social preview images for the pages without a cover
		ogImages(),
	],
	markdown: {
		// GitHub's high-contrast dark theme: every syntax color is at least 7:1 on the code background (WCAG AAA)
		shikiConfig: { theme: "github-dark-high-contrast" },
	},
	// Generate several sizes of each image so phones download smaller files
	// (images given as a link, like stock photos chosen in the writing panel, are shown as they are:
	// nothing is downloaded at build time, so a photo removed by its provider can't break the build)
	image: { layout: "constrained" },
	vite: {
		// Keep CSS readable by older browsers (e.g. iOS < 16.4 doesn't support media query range syntax)
		build: { cssTarget: ["safari14", "chrome90", "firefox90"] },
	},
	// No sessions are used, so don't provision the KV binding
	session: false,
	adapter: cloudflare({
		// Optimize post images at build time (no Cloudflare Images binding needed at runtime)
		imageService: "compile",
	}),
});
