import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { posts, RSS_DESCRIPTION, RSS_TITLE, SITE_URL } from "../data/posts";

export function GET(context: APIContext) {
  return rss({
    title: RSS_TITLE,
    description: RSS_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      link: post.url,
      pubDate: new Date(post.date),
      content: post.contentEncoded,
      categories: [post.tag],
    })),
    customData: "<language>en-us</language>",
    xmlns: {
      content: "http://purl.org/rss/1.0/modules/content/",
    },
  });
}