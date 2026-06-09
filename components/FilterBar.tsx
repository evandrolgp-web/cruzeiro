"use client";

interface Source {
  key: string;
  label: string;
  color: string;
}

const SOURCES: Source[] = [
  { key: "all", label: "Todas", color: "#003DA5" },
  { key: "ge", label: "Globo Esporte", color: "#0066CC" },
  { key: "centraldatoca", label: "Central da Toca", color: "#003DA5" },
  { key: "noataque", label: "No Ataque", color: "#E8000D" },
  { key: "googlenews", label: "Google Notícias", color: "#4285F4" },
  { key: "oficial", label: "Site Oficial", color: "#003DA5" },
  { key: "superesportes", label: "Super Esportes", color: "#FFA500" },
];

interface Props {
  active: string;
  onChange: (key: string) => void;
  counts: Record<string, number>;
}

export default function FilterBar({ active, onChange, counts }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {SOURCES.map((s) => {
        const count = s.key === "all"
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[s.key] ?? 0;
        const isActive = active === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isActive
                ? "text-white shadow-lg scale-105"
                : "bg-[#0d1a3a] text-blue-300 border border-blue-900/40 hover:border-blue-500/50"
            }`}
            style={isActive ? { backgroundColor: s.color } : undefined}
          >
            {s.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20" : "bg-blue-900/60"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
