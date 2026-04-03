export default function LoadingPersonDetail() {
  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      <div className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="relative z-10 flex min-h-[70vh] flex-col px-4 pb-12 pt-28 sm:px-6 lg:px-10 lg:pt-24">
          <div className="mb-6 flex gap-2" aria-hidden="true">
            <div className="skeleton-shimmer h-3 w-14 rounded" />
            <span className="text-zinc-700">/</span>
            <div className="skeleton-shimmer h-3 w-40 max-w-full rounded" />
          </div>
          <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
            <div className="skeleton-shimmer mx-auto aspect-[2/3] w-full max-w-[260px] rounded-2xl border border-zinc-800/50 lg:mx-0" />
            <div className="min-w-0 space-y-4">
              <div className="skeleton-shimmer h-10 w-3/4 max-w-md rounded-lg sm:h-12" />
              <div className="skeleton-shimmer h-4 w-40 rounded" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-shimmer h-7 w-24 rounded-full" />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="skeleton-shimmer h-3 w-24 rounded" />
                    <div className="skeleton-shimmer h-4 w-full max-w-[12rem] rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <div className="skeleton-shimmer h-6 w-40 rounded" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
          </div>
          <div className="space-y-3">
            <div className="skeleton-shimmer h-6 w-56 rounded" />
            <div className="skeleton-shimmer h-24 w-full rounded-xl" />
            <div className="skeleton-shimmer h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
