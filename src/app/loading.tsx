export default function Loading() {
  return (
    <main className="page-shell">
      <div className="space-y-3">
        <div className="skeleton-shimmer h-10 w-52 rounded-xl" />
        <div className="skeleton-shimmer h-5 w-80 rounded-lg" />
      </div>

      <div className="skeleton-shimmer h-[280px] w-full rounded-2xl sm:h-[340px] lg:h-[380px]" />

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, rowIdx) => (
          <div key={rowIdx} className="space-y-3">
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
          </div>
        ))}
      </div>
    </main>
  );
}
