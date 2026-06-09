#!/usr/bin/env node
/**
 * Roda durante o build (GitHub Actions) para buscar RSS feeds
 * e salvar em public/news.json — sem CORS, sem proxy.
 */

import Parser from "rss-parser";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; CruzeiroNewsBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

const FEEDS = [
  { url: "https://ge.globo.com/rss/times/cruzeiro.xml",          source: "ge",            label: "Globo Esporte",    color: "#0066CC" },
  { url: "https://www.centraldatoca.com.br/feed/",               source: "centraldatoca", label: "Central da Toca",  color: "#003DA5" },
  { url: "https://noataque.com.br/feed/",                        source: "noataque",      label: "No Ataque",        color: "#E8000D" },
  { url: "https://superesportes.com.br/feed/",                   source: "superesportes", label: "Super Esportes",   color: "#FFA500" },
  { url: "https://www.cruzeiro.com.br/feed",                     source: "oficial",       label: "Site Oficial",     color: "#C9A84C" },
  { url: "https://news.google.com/rss/search?q=Cruzeiro+futebol&hl=pt-BR&gl=BR&ceid=BR:pt-419", source: "googlenews", label: "Google Notícias", color: "#4285F4" },
];

function extractImage(item) {
  const content = item["content:encoded"] ?? item["content"] ?? item.content;
  if (content) {
    const m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) return m[1];
  }
  const media = item["media:content"];
  if (media?.url) return media.url;
  const thumb = item["media:thumbnail"];
  if (thumb?.url) return thumb.url;
  if (item.enclosure?.url && item.enclosure?.type?.startsWith("image/")) return item.enclosure.url;
  return undefined;
}

function clean(text) {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim().slice(0, 220);
}

async function fetchFeed(feed) {
  const parsed = await parser.parseURL(feed.url);
  return parsed.items.slice(0, 15).map((item, idx) => ({
    id: `${feed.source}-${idx}-${(item.link ?? item.title ?? "").slice(0, 40)}`,
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

const results = await Promise.allSettled(FEEDS.map(fetchFeed));

const items = [];
for (const [i, r] of results.entries()) {
  if (r.status === "fulfilled") {
    items.push(...r.value);
    console.log(`✓ ${FEEDS[i].label}: ${r.value.length} itens`);
  } else {
    console.warn(`✗ ${FEEDS[i].label}: ${r.reason?.message ?? r.reason}`);
  }
}

items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

const seen = new Set();
const unique = items.filter((item) => {
  const key = item.title.toLowerCase().slice(0, 60);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const out = { items: unique, updatedAt: new Date().toISOString() };
const dest = join(__dirname, "..", "public", "news.json");
writeFileSync(dest, JSON.stringify(out));
console.log(`\n✓ ${unique.length} notícias salvas em public/news.json`);
