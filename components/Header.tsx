"use client";

import { NewsItem } from "@/app/api/news/route";
import { useEffect, useState } from "react";

interface Props {
  items: NewsItem[];
}

export default function Header({ items }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const tickerItems = items.slice(0, 20);
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <header className="sticky top-0 z-50 shadow-lg shadow-black/40">
      {/* Top bar */}
      <div className="bg-[#001f6e] px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Cruzeiro crest SVG placeholder */}
          <div className="w-10 h-10 rounded-full bg-[#003DA5] border-2 border-[#C9A84C] flex items-center justify-center text-white font-black text-sm">
            CEC
          </div>
          <div>
            <h1 className="text-white font-black text-xl leading-none tracking-wide">
              CRUZEIRO
            </h1>
            <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase">
              Notícias
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-1 text-xs text-blue-300">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Atualizado agora
        </div>
      </div>

      {/* News ticker */}
      {tickerItems.length > 0 && (
        <div className="bg-[#003DA5] flex items-center text-white text-xs">
          <div className="bg-[#C9A84C] text-[#001f6e] font-black px-3 py-2 whitespace-nowrap flex-shrink-0 uppercase tracking-wide">
            Últimas
          </div>
          <div className="ticker-wrap flex-1 py-2 overflow-hidden" key={tick}>
            <div className="ticker-move">
              {doubled.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mr-12 hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  <span className="text-[#C9A84C] mr-2">►</span>
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
