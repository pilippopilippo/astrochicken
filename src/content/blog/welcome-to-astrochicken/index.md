---
title: Welcome to Astrochicken
description: A fast, accessible blog template for Astro, with dark mode, search and a writing panel that works from your phone.
pubDate: 2026-10-04
author: Astrochicken
heroImage: ./cover.jpg
tags:
  - astrochicken
  - guide
lang: en
---

Astrochicken is a blog template for [Astro](https://astro.build). It's built to be read comfortably, found easily and written from anywhere, and it stays out of the way so your posts come first.

## What's inside

- **Readable by design**: [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) font, a comfortable line length and contrast that meets WCAG AAA.
- **Light and dark themes** that follow the device, with a switch in the header.
- **Search** across every post, with `Ctrl+K`, `⌘K` or `/`. No external service: the index is built with the site.
- **Tags**, reading time, previous and next post links, and an RSS feed.
- **Images** optimized at build time, opening full screen on click.
- **Code blocks** with highlighting and a Copy button.
- **Smooth page transitions** that respect the reduced motion setting.
- **A writing panel** at `/admin/`, which also works on a phone (see below).
- **SEO**: sitemap, social previews and structured data for search engines.

## Writing a post

Every post is a folder in `src/content/blog/`, with an `index.md` file and its images next to it:

```
src/content/blog/
└── my-first-trip/
    ├── index.md
    ├── cover.jpg
    └── harbour.jpg
```

The folder name becomes the address, `/blog/my-first-trip/`. The file starts with a few details between `---` lines:

```yaml
---
title: My first trip
description: Three days by the sea.
pubDate: 2026-10-04
heroImage: ./cover.jpg
tags: [travel]
---
```

Add `draft: true` to keep a post hidden while you work on it.

## Writing from your phone

Open `/admin/` on your site and sign in with a GitHub token: you get a form for the post details, a text editor and a button to add photos. Photos are resized and converted to WebP before upload, and their location data is removed. Saving commits the post to your repository, and the site is published again a few minutes later.

## Make it yours

Set your blog's name, address and GitHub repository in `site.config.mjs`, then delete these sample posts. Everything else is optional.
