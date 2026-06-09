"use client";

import { useEffect } from "react";

interface TwitterTimelineProps {
  username: string;
  label: string;
}

function TwitterTimeline({ username, label }: TwitterTimelineProps) {
  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-blue-900/40 bg-[#0d1a3a]/60">
      <div className="px-4 py-3 bg-[#0a1228] border-b border-blue-900/40 flex items-center gap-2">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.246l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="text-white text-sm font-semibold">@{username}</span>
        <span className="text-blue-400 text-xs">— {label}</span>
      </div>
      <a
        className="twitter-timeline"
        data-theme="dark"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="5"
        data-height="400"
        href={`https://twitter.com/${username}`}
      >
        Tweets por @{username}
      </a>
    </div>
  );
}

export default function TwitterFeed() {
  return (
    <section>
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.246l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter / X
      </h2>
      <div className="space-y-4">
        <TwitterTimeline username="Cruzeiro" label="Cruzeiro Oficial" />
        <TwitterTimeline username="samuelvenancio" label="Samuel Venâncio" />
        <TwitterTimeline username="CentroDaToca" label="Central da Toca" />
      </div>
    </section>
  );
}
