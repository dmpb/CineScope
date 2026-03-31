export default function LoadingMovieDetail() {
  return (
    <main className="page-shell">
      <div className="skeleton-shimmer h-5 w-28 rounded" />
      <div className="skeleton-shimmer aspect-[16/9] w-full rounded-2xl sm:aspect-[21/9]" />
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="skeleton-shimmer aspect-[2/3] w-full max-w-[220px] rounded-xl" />
        <div className="space-y-3">
          <div className="skeleton-shimmer h-8 w-2/3 rounded" />
          <div className="skeleton-shimmer h-4 w-1/3 rounded" />
          <div className="skeleton-shimmer h-24 w-full rounded" />
          <div className="skeleton-shimmer h-40 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
        <div className="horizontal-scroll-row">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="skeleton-shimmer min-w-[45%] rounded-xl sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19%] xl:min-w-[16%]">
              <div className="aspect-[2/3] w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
