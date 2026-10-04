import rss from "@astrojs/rss";
import { getPublishedPosts, postTags } from "../utils/posts";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";

export async function GET(context) {
	const posts = await getPublishedPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			categories: postTags(post).map((tag) => tag.label),
			// <author> must be an email address in RSS, so the name goes in dc:creator
			customData: post.data.author
				? `<dc:creator><![CDATA[${post.data.author.replaceAll("]]>", "]]]]><![CDATA[>")}]]></dc:creator>`
				: undefined,
		})),
	});
}
