---
title: Images and covers
description: How to add a cover and images to a post, keeping each post's files in its own folder.
pubDate: 2026-10-03
author: Astrochicken
heroImage: ./cover.jpg
tags:
  - guide
  - images
lang: en
draft: false
---

Each post lives in its own folder, together with its images:

```
src/content/blog/
└── images-and-covers/
    ├── index.md        ← this text
    ├── cover.jpg       ← the cover (heroImage)
    ├── landscape.jpg
    └── portrait.jpg
```

## The cover

Set it at the top of the file, with a path relative to the post:

```yaml
heroImage: ./cover.jpg
```

It's shown on the home page, at the top of the post and in link previews on social networks.

## Images in the text

Use the usual Markdown syntax, with `./` before the file name. The text in square brackets describes the image for people who can't see it:

```md
![A landscape photo](./landscape.jpg)
```

This is the result:

![An abstract landscape image with soft circles on a blue and orange gradient](./landscape.jpg)

Portrait images work the same way:

![An abstract portrait image with circles on a light to dark orange gradient](./portrait.jpg)

Click an image to see it full screen.

## Good to know

- Upload photos as they are: at build time they're resized and converted to a light format (WebP), in several sizes for different screens.
- If a file name is wrong, the build stops and names the missing image, so a broken image never goes online.
- Keep file names simple: lowercase, no spaces (e.g. `sunset-at-sea.jpg`).
