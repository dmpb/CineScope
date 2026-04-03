export default function LoadingMovieDetail() {
  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      <div className="home-content-container space-y-8 pb-10 pt-28 lg:pt-24">
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:gap-8">
          <div className="skeleton-shimmer mx-auto aspect-[2/3] w-full max-w-[min(100%,280px)] rounded-xl border border-zinc-800/50 md:mx-0" />

          <div className="min-w-0 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="skeleton-shimmer h-7 w-[4.5rem] rounded-full sm:w-20" />
              ))}
            </div>

            <div className="skeleton-shimmer h-9 w-full max-w-md rounded-lg sm:h-10" />
            <div className="skeleton-shimmer h-4 w-full max-w-[12rem] rounded sm:h-5" />
            <div className="skeleton-shimmer h-[4.5rem] w-full rounded-xl sm:h-24" />
            <div className="skeleton-shimmer h-10 w-full max-w-[9rem] rounded-lg" />

            <div className="space-y-2">
              <div className="skeleton-shimmer h-4 w-28 rounded sm:w-40" />
              <div className="-mx-1 overflow-x-auto pb-1">
                <div className="flex w-max gap-3 px-1">
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <div key={idx} className="w-[100px] shrink-0 space-y-2 sm:w-[120px]">
                      <div className="skeleton-shimmer mx-auto h-[4.5rem] w-[4.5rem] rounded-full sm:h-20 sm:w-20" />
                      <div className="skeleton-shimmer mx-auto h-3 w-full max-w-[5.5rem] rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="skeleton-shimmer h-7 w-full max-w-xs rounded-lg sm:h-8 sm:max-w-sm" />
          <div className="-mx-1 overflow-x-auto pb-1">
            <div className="flex w-max gap-3 px-1 sm:gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="skeleton-shimmer w-[42vw] max-w-[160px] shrink-0 rounded-xl sm:w-[31vw] sm:max-w-none md:w-[23vw] lg:w-[19vw] xl:w-[16vw]"
                >
                  <div className="aspect-[2/3] w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
