export function FeaturedSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0d1a3a] border border-blue-900/40">
      <div className="shimmer w-full h-56" />
      <div className="p-5 space-y-3">
        <div className="shimmer h-4 w-24 rounded-full" />
        <div className="shimmer h-5 w-full rounded" />
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="shimmer h-3 w-full rounded mt-2" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-[#0d1a3a]/60 border border-blue-900/30">
      <div className="shimmer w-20 h-16 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-3 w-20 rounded-full" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}
