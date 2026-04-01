export default function LoadingMovieDetail() {
  return (
    <main className="-mt-20 home-cinematic-shell">
      <div className="home-content-container space-y-8 pb-10 pt-24">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="skeleton-shimmer aspect-[2/3] w-full max-w-[280px] rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton-shimmer h-10 w-2/3 rounded" />
            <div className="skeleton-shimmer h-5 w-1/2 rounded" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
            <div className="skeleton-shimmer h-10 w-36 rounded-lg" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-5 w-40 rounded" />
              <div className="horizontal-scroll-row">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="space-y-2 min-w-[120px]">
                    <div className="skeleton-shimmer mx-auto h-20 w-20 rounded-full" />
                    <div className="skeleton-shimmer h-3 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="skeleton-shimmer h-8 w-72 rounded-lg" />
          <div className="horizontal-scroll-row">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton-shimmer min-w-[45%] rounded-xl sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19%] xl:min-w-[16%]">
                <div className="aspect-[2/3] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
