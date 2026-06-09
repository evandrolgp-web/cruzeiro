"use client";

import { NewsItem, fetchAllNews } from "@/lib/news";
import FilterBar from "@/components/FilterBar";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { FeaturedSkeleton, CardSkeleton } from "@/components/NewsSkeleton";
import TwitterFeed from "@/components/TwitterFeed";
import { useCallback, useEffect, useState } from "react";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      const news = await fetchAllNews();
      setItems(news);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((i) => i.source === activeFilter);

  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.source] = (acc[item.source] ?? 0) + 1;
    return acc;
  }, {});

  const featured = filtered.slice(0, 4);
  const rest = filtered.slice(4);

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Header items={items} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-2xl">
              Últimas Notícias
            </h2>
            {lastUpdated && (
              <p className="text-blue-400 text-xs mt-0.5">
                Atualizado às {lastUpdated.toLocaleTimeString("pt-BR")} •{" "}
                {items.length} notícias
              </p>
            )}
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003DA5] hover:bg-[#1a52b5] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar
            active={activeFilter}
            onChange={setActiveFilter}
            counts={counts}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
            {error} —{" "}
            <button onClick={fetchNews} className="underline">
              tentar novamente
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main news column */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <FeaturedSkeleton key={i} />
                  ))}
                </div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-blue-300/60">
                Nenhuma notícia encontrada para este filtro.
              </div>
            ) : (
              <>
                {/* Featured grid */}
                {featured.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {featured.map((item) => (
                      <NewsCard key={item.id} item={item} featured />
                    ))}
                  </div>
                )}

                {/* List */}
                {rest.length > 0 && (
                  <div className="space-y-2">
                    {rest.map((item) => (
                      <NewsCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Twitter sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <TwitterFeed />

            {/* Sources info */}
            <div className="mt-6 p-4 rounded-xl bg-[#0d1a3a]/60 border border-blue-900/30">
              <h3 className="text-white text-sm font-semibold mb-3">
                Fontes de notícias
              </h3>
              <ul className="space-y-2 text-xs text-blue-300/70">
                {[
                  { label: "Globo Esporte", url: "https://ge.globo.com/futebol/times/cruzeiro/" },
                  { label: "Central da Toca", url: "https://www.centraldatoca.com.br/" },
                  { label: "No Ataque", url: "https://noataque.com.br/" },
                  { label: "Super Esportes", url: "https://superesportes.com.br/" },
                  { label: "Site Oficial Cruzeiro", url: "https://www.cruzeiro.com.br/" },
                  { label: "Google Notícias", url: "https://news.google.com/search?q=Cruzeiro&hl=pt-BR" },
                ].map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-300 transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#003DA5] flex-shrink-0" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-blue-900/30 text-center text-xs text-blue-400/50">
        Cruzeiro Notícias — Agregador não oficial • Atualizado automaticamente a cada 5 minutos
      </footer>
    </div>
  );
}
