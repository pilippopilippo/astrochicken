import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedPosts, isRemoteImage } from '../utils/posts';

// Small cover thumbnails for search results, keyed by post URL. Kept out of the search index
// on purpose: Pagefind makes metadata searchable, and cover file names (e.g. "cover")
// would otherwise match every post.
export const GET: APIRoute = async () => {
	const thumbnails: Record<string, string> = {};
	for (const post of await getPublishedPosts()) {
		if (!post.data.heroImage) continue;
		// A remote image (e.g. a stock photo) is used as it is
		if (isRemoteImage(post.data.heroImage)) {
			thumbnails[`/blog/${post.id}/`] = post.data.heroImage;
			continue;
		}
		const image = await getImage({
			src: post.data.heroImage,
			width: 192,
			height: 96,
			fit: 'cover',
			format: 'webp',
		});
		thumbnails[`/blog/${post.id}/`] = image.src;
	}
	return new Response(JSON.stringify(thumbnails), { headers: { 'Content-Type': 'application/json' } });
};
