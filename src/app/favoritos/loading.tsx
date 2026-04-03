export default function FavoritosLoading() {
  return (
    <main className="home-cinematic-shell">
      <div className="home-content-container home-content-stack">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-red-950/25 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div className="skeleton-shimmer h-11 w-11 shrink-0 rounded-xl" />
              <div className="space-y-2">
                <div className="skeleton-shimmer h-8 w-48 rounded-lg sm:h-9 sm:w-56" />
                <div className="skeleton-shimmer h-4 w-full max-w-xl rounded-md" />
                <div className="skeleton-shimmer h-4 w-full max-w-lg rounded-md" />
              </div>
            </div>
            <div className="skeleton-shimmer ml-auto h-6 w-28 rounded-md" />
          </div>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="skeleton-shimmer h-7 w-48 rounded-lg" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="skeleton-shimmer overflow-hidden rounded-xl">
                <div className="aspect-[2/3] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
