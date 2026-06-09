"use client";

import { NewsItem } from "@/lib/news";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";

interface Props {
  item: NewsItem;
  featured?: boolean;
}

export default function NewsCard({ item, featured = false }: Props) {
  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(item.pubDate), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "";
    }
  })();

  if (featured) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card group block rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d1a3a] to-[#0a1228] border border-blue-900/40 hover:border-blue-500/60"
      >
        {item.image && (
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1228] via-transparent to-transparent" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="source-badge text-white"
              style={{ backgroundColor: item.sourceColor }}
            >
              {item.sourceLabel}
            </span>
            {timeAgo && (
              <span className="text-xs text-blue-300/70">{timeAgo}</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-3">
            {item.title}
          </h2>
          {item.description && (
            <p className="mt-2 text-sm text-blue-200/60 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="news-card group flex gap-3 p-3 rounded-xl bg-[#0d1a3a]/60 border border-blue-900/30 hover:border-blue-500/50 hover:bg-[#0d1a3a]"
    >
      {item.image && (
        <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="source-badge text-white"
            style={{ backgroundColor: item.sourceColor }}
          >
            {item.sourceLabel}
          </span>
          {timeAgo && (
            <span className="text-xs text-blue-300/60">{timeAgo}</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
          {item.title}
        </h3>
      </div>
    </a>
  );
}
