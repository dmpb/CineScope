function DaySkeleton() {
  return (
    <section className="relative grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
      <div className="relative flex sm:flex-col sm:items-start">
        <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
          <div className="skeleton-shimmer relative z-10 h-12 w-12 shrink-0 rounded-2xl ring-4 ring-zinc-950 sm:h-14 sm:w-14" />
          <div className="min-w-0 space-y-2">
            <div className="skeleton-shimmer h-4 w-20 rounded-md" />
            <div className="skeleton-shimmer h-3 w-16 rounded-md" />
            <div className="skeleton-shimmer h-3 w-14 rounded-md" />
          </div>
        </div>
      </div>

      <div className="glass-surface-soft space-y-5 rounded-2xl border border-zinc-800/70 p-4 sm:p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
            <div className="skeleton-shimmer h-3 w-6 rounded" />
          </div>
          <div className="horizontal-scroll-row">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="skeleton-shimmer w-[42%] min-w-[42%] max-w-[42%] overflow-hidden rounded-xl sm:w-[28%] sm:min-w-[28%] sm:max-w-[28%] md:w-[22%] md:min-w-[22%] md:max-w-[22%] lg:w-[18%] lg:min-w-[18%] lg:max-w-[18%] xl:w-[15%] xl:min-w-[15%] xl:max-w-[15%]"
              >
                <div className="aspect-[2/3] w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EstrenosLoading() {
  return (
    <main className="home-cinematic-shell" aria-busy="true">
      <div className="home-content-container home-content-stack">
        <header className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-red-950/25 px-5 py-6 shadow-lg shadow-black/20 sm:px-8 sm:py-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <div className="skeleton-shimmer mt-0.5 h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0 space-y-2">
                  <div className="skeleton-shimmer h-8 w-40 rounded-lg sm:h-9 sm:w-48" />
                  <div className="skeleton-shimmer h-4 w-full max-w-md rounded-md" />
                </div>
              </div>
              <div className="space-y-2 sm:text-right">
                <div className="skeleton-shimmer ml-auto h-5 w-24 rounded-md" />
                <div className="skeleton-shimmer ml-auto h-3 w-40 rounded-md" />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/70 bg-black/25 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-3.5">
              <div className="skeleton-shimmer h-11 w-full rounded-xl sm:w-36" />
              <div className="flex flex-col items-center gap-2">
                <div className="skeleton-shimmer h-6 w-40 rounded-lg sm:h-7 sm:w-48" />
                <div className="skeleton-shimmer h-3 w-16 rounded" />
              </div>
              <div className="skeleton-shimmer h-11 w-full rounded-xl sm:w-36" />
            </div>
          </div>
        </header>

        <div className="relative space-y-6 sm:space-y-8">
          <div
            className="pointer-events-none absolute bottom-0 left-[1.35rem] top-2 hidden w-px bg-gradient-to-b from-red-500/50 via-zinc-700/60 to-transparent sm:block"
            aria-hidden="true"
          />
          <DaySkeleton />
          <DaySkeleton />
          <DaySkeleton />
        </div>
      </div>
    </main>
  );
}
