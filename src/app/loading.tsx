export default function Loading() {
  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      <div className="skeleton-shimmer h-[72vh] min-h-[460px] w-full" />

      <div className="home-content-container home-content-stack">
        {Array.from({ length: 4 }).map((_, rowIdx) => (
          <div key={rowIdx} className="space-y-4">
            <div className="skeleton-shimmer h-8 w-52 rounded-lg" />
            <div className="horizontal-scroll-row">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`${rowIdx}-${idx}`}
                  className="skeleton-shimmer min-w-[45%] rounded-xl sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19%] xl:min-w-[16%]"
                >
                  <div className="aspect-[2/3] w-full rounded-xl" />
                </div>
              ))}
            </div>
            {rowIdx % 2 === 1 && <div className="skeleton-shimmer h-[220px] w-full rounded-2xl sm:h-[260px] lg:h-[300px]" />}
          </div>
        ))}
      </div>
    </main>
  );
}
