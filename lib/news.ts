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

export interface NewsData {
  items: NewsItem[];
  updatedAt: string;
}

export async function fetchAllNews(): Promise<NewsData> {
  const basePath = process.env.NODE_ENV === "production" ? "/cruzeiro" : "";
  const res = await fetch(`${basePath}/news.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Falha ao carregar notícias (${res.status})`);
  return res.json();
}
