import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; CruzeiroNewsBot/1.0; +https://cruzeiro.app)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceLabel: string;
  sourceColor: string;
  description?: string;
  image?: string;
}

const FEEDS = [
  {
    url: "https://ge.globo.com/rss/times/cruzeiro.xml",
    source: "ge",
    label: "Globo Esporte",
    color: "#0066CC",
  },
  {
    url: "https://www.centraldatoca.com.br/feed/",
    source: "centraldatoca",
    label: "Central da Toca",
    color: "#003DA5",
  },
  {
    url: "https://noataque.com.br/feed/",
    source: "noataque",
    label: "No Ataque",
    color: "#E8000D",
  },
  {
    url: "https://news.google.com/rss/search?q=Cruzeiro+futebol&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    source: "googlenews",
    label: "Google Notícias",
    color: "#4285F4",
  },
  {
    url: "https://www.cruzeiro.com.br/feed",
    source: "oficial",
    label: "Site Oficial",
    color: "#003DA5",
  },
  {
    url: "https://superesportes.com.br/feed/",
    source: "superesportes",
    label: "Super Esportes",
    color: "#FFA500",
  },
];

function extractImage(item: Parser.Item): string | undefined {
  const content = (item as Record<string, unknown>)["content:encoded"] as string | undefined ||
    (item as Record<string, unknown>)["content"] as string | undefined ||
    item.content;
  if (content) {
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];
  }
  const media = (item as Record<string, unknown>)["media:content"] as Record<string, unknown> | undefined;
  if (media?.url) return media.url as string;
  const mediaThumbnail = (item as Record<string, unknown>)["media:thumbnail"] as Record<string, unknown> | undefined;
  if (mediaThumbnail?.url) return mediaThumbnail.url as string;
  const enclosure = item.enclosure;
  if (enclosure?.url && enclosure?.type?.startsWith("image/")) return enclosure.url;
  return undefined;
}

function cleanDescription(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 200);
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.slice(0, 15).map((item, idx): NewsItem => ({
        id: `${feed.source}-${idx}-${item.link ?? item.title}`,
        title: item.title ?? "Sem título",
        link: item.link ?? "#",
        pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        source: feed.source,
        sourceLabel: feed.label,
        sourceColor: feed.color,
        description: cleanDescription(item.contentSnippet ?? item.summary ?? item.content),
        image: extractImage(item),
      }));
    })
  );

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  items.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = items.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ items: unique, updatedAt: new Date().toISOString() });
}
