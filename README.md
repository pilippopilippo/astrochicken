# 🍗 Astrochicken

A fast, accessible blog template for [Astro](https://astro.build), ready to deploy on Cloudflare, with a writing panel that works from your phone.

## Features

- Readable by design: Atkinson Hyperlegible font, comfortable line length, WCAG AAA contrast
- Light and dark themes (follows the device, with a switch)
- Full-text search with [Pagefind](https://pagefind.app), no external service
- Tags, reading time, previous/next links, RSS feed
- Images optimized at build time, full-screen view on click
- Code highlighting with a Copy button
- Page transitions that respect reduced motion
- Writing panel at `/admin/` ([Sveltia CMS](https://github.com/sveltia/sveltia-cms))
- Sitemap, social previews and structured data

## Quick start

```sh
npm create astro@latest -- --template pilippopilippo/astrochicken
```

Or click **Use this template** on GitHub. Then:

1. Edit `site.config.mjs`: name, description, address and GitHub repository.
2. Delete the sample posts in `src/content/blog/` and edit `src/pages/about.astro`.
3. Deploy (see below).

Requires Node.js 22.12 or later.

| Command           | Action                                                     |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`                   |
| `npm run build`   | Build the site and the search index                        |
| `npm run preview` | Build and preview the site as it will be served            |
| `npm run check`   | Type checks, build and a deploy dry run                    |

## Writing posts

Each post is a folder in `src/content/blog/` with an `index.md` and its images. The folder name becomes the address (`/blog/my-post/`).

```md
---
title: My post
description: A short summary for search engines and link previews.
pubDate: 2026-10-04
author: Jane            # optional
heroImage: ./cover.jpg  # optional
tags: [travel, food]    # optional
lang: en                # optional, default "en"
draft: true             # optional, hides the post
---

The text, in Markdown. Images: ![Description](./photo.jpg)
```

Name the file `index.mdx` to use components. The sample posts show everything in action.

## Writing panel

Open `/admin/` on your site to write and edit posts from any browser, phone included. Photos are resized, converted to WebP and stripped of location data before upload. Each save is a commit to your repository, which triggers a new deploy.

Sign in with a GitHub fine-grained token:

1. On GitHub: **Settings → Developer settings → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → your blog.
3. Permissions: **Contents → Read and write**.
4. Paste the token in the panel.

The panel's fields are set in `public/admin/config.yml`; keep them in sync with `src/content.config.ts`.

## Deploy

On Cloudflare (already configured): **Workers & Pages → Create → Import a repository**, or use the button. Every push to `main` is published.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/pilippopilippo/astrochicken)

The site is fully static. For another host, remove the Cloudflare adapter from `astro.config.mjs` and change `dist/client` to `dist` in the `build` script.

## Customize

- Colors and fonts: variables at the top of `src/styles/global.css`
- Favicon and icons: `public/`
- Stock photo hosts allowed for covers: `src/utils/remote-images.mjs`

## License

[MIT](LICENSE) © pilippopilippo

- Based on the [Astro blog template](https://github.com/withastro/astro/tree/main/examples/blog) (MIT)
- 🍗 emoji from [Twemoji](https://github.com/jdecked/twemoji) (CC-BY 4.0)
- [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) font by the Braille Institute ([SIL OFL 1.1](public/fonts/OFL.txt))
