// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import { remoteImageHosts } from "./src/utils/remote-images.mjs";
import config from "./site.config.mjs";

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
	],
	markdown: {
		// GitHub's high-contrast dark theme: every syntax color is at least 7:1 on the code background (WCAG AAA)
		shikiConfig: { theme: "github-dark-high-contrast" },
	},
	// Generate several sizes of each image so phones download smaller files
	image: {
		layout: "constrained",
		// Stock photos chosen in the writing panel (/admin/) are saved as links: their hosts are
		// downloaded at build time and optimized like local images
		remotePatterns: remoteImageHosts.map((hostname) => ({ protocol: "https", hostname })),
	},
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
