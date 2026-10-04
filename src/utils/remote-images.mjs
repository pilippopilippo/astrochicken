// Hosts of the stock photos that can be chosen in the writing panel (/admin/), which saves them as
// links. Images from these hosts are downloaded at build time and optimized like local files (see
// `image.remotePatterns` in astro.config.mjs); images from any other host are shown as they are.
export const remoteImageHosts = ["images.unsplash.com", "images.pexels.com"];
