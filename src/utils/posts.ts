import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export interface Tag {
	/** URL-safe identifier, e.g. "street-food" */
	slug: string;
	/** Name as written in the posts (lowercase), e.g. "street food" */
	label: string;
	count: number;
}

/** Published (non-draft) posts, newest first */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Estimated reading time in minutes (about 220 words per minute, at least 1) */
export function readingMinutes(post: Post): number {
	const text = (post.body ?? '')
		.replace(/```[\s\S]*?```/g, ' ') // code blocks are skimmed, not read word by word
		.replace(/^(import|export) .*$/gm, ' ') // MDX imports
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
		.replace(/[#>*_`~\[\]()|-]/g, ' ');
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 220));
}

/** "Café Society" / "cafe-society" / "café society" → "cafe-society" */
export function tagSlug(tag: string): string {
	return tag
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Whether an image is given as a URL instead of a file next to the post, e.g. a stock photo chosen
 * in the writing panel. It's shown as it is, like remote images in the text of a post: nothing is
 * downloaded at build time, so a photo removed by its provider can't break the build.
 */
export function isRemoteImage(image: unknown): image is string {
	return typeof image === 'string' && /^https?:\/\//.test(image);
}

/** view-transition-name shared by a post's cover on the home page and in the article */
export function coverTransitionName(postId: string): string {
	return `cover-${tagSlug(postId)}`;
}

/** A post's tags, deduplicated by slug */
export function postTags(post: Post): Omit<Tag, 'count'>[] {
	const tags = new Map<string, string>();
	for (const label of post.data.tags) {
		const slug = tagSlug(label);
		if (slug && !tags.has(slug)) tags.set(slug, label);
	}
	return [...tags].map(([slug, label]) => ({ slug, label }));
}

/** All tags used by the given posts, most used first */
export function getTags(posts: Post[]): Tag[] {
	const tags = new Map<string, Tag>();
	for (const post of posts) {
		for (const { slug, label } of postTags(post)) {
			const tag = tags.get(slug) ?? { slug, label, count: 0 };
			tag.count++;
			tags.set(slug, tag);
		}
	}
	return [...tags.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * Up to `limit` posts that share tags with `post`, the most tags in common first, then the newest.
 * Posts listed in `exclude` (e.g. the previous and next ones, already linked) are left out.
 */
export function relatedPosts(post: Post, posts: Post[], exclude: Post[] = [], limit = 3): Post[] {
	const tags = new Set(postTags(post).map(({ slug }) => slug));
	if (!tags.size) return [];
	const skip = new Set([post.id, ...exclude.map(({ id }) => id)]);
	return posts
		.filter(({ id }) => !skip.has(id))
		.map((other) => ({ other, shared: postTags(other).filter(({ slug }) => tags.has(slug)).length }))
		.filter(({ shared }) => shared > 0)
		.sort((a, b) => b.shared - a.shared || b.other.data.pubDate.valueOf() - a.other.data.pubDate.valueOf())
		.slice(0, limit)
		.map(({ other }) => other);
}
