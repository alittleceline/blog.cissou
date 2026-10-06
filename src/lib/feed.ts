import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { postUrl } from "./urls";

function excerpt(markdown = "", length = 300) {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // links → text
    .replace(/<[^>]+>/g, "")                     // HTML tags
    .replace(/[#*_>`~]/g, "")                    // markdown symbols
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? text.slice(0, length).trimEnd() + "…" : text;
}

export async function buildFeed(site: URL | undefined) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: "Cissou",
    description: "Le blog de Cissou",
    site: site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      link: postUrl(p),
      description: excerpt(p.body),
    })),
    customData: "<language>fr-fr</language>",
  });
}