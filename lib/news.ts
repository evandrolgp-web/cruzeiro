import Parser from "rss-parser";

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

export const SOURCES = [
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
    url: "https://superesportes.com.br/feed/",
    source: "superesportes",
    label: "Super Esportes",
    color: "#FFA500",
  },
  {
    url: "https://www.cruzeiro.com.br/feed",
    source: "oficial",
    label: "Site Oficial",
    color: "#C9A84C",
  },
  {
    url: "https://news.google.com/rss/search?q=Cruzeiro+futebol&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    source: "googlenews",
    label: "Google Notícias",
    color: "#4285F4",
  },
];

const parser = new Parser({ timeout: 10000 });

function extractImage(item: Parser.Item): string | undefined {
  const rec = item as Record<string, unknown>;
  const content = (rec["content:encoded"] ?? rec["content"] ?? item.content) as string | undefined;
  if (content) {
    const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) return m[1];
  }
  const media = rec["media:content"] as Record<string, unknown> | undefined;
  if (media?.url) return media.url as string;
  const thumb = rec["media:thumbnail"] as Record<string, unknown> | undefined;
  if (thumb?.url) return thumb.url as string;
  if (item.enclosure?.url && item.enclosure?.type?.startsWith("image/"))
    return item.enclosure.url;
  return undefined;
}

function clean(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 220);
}

async function fetchFeed(feed: (typeof SOURCES)[0]): Promise<NewsItem[]> {
  // allorigins proxies any URL, bypassing CORS
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
  const res = await fetch(proxy, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { contents } = await res.json();
  const parsed = await parser.parseString(contents);
  return parsed.items.slice(0, 15).map((item, idx): NewsItem => ({
    id: `${feed.source}-${idx}-${item.link ?? item.title ?? ""}`,
    title: item.title ?? "Sem título",
    link: item.link ?? "#",
    pubDate: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
    source: feed.source,
    sourceLabel: feed.label,
    sourceColor: feed.color,
    description: clean(item.contentSnippet ?? item.summary),
    image: extractImage(item),
  }));
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(SOURCES.map(fetchFeed));

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
