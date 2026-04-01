export default function LoadingSearch() {
  return (
    <main className="page-shell">
      <div className="skeleton-shimmer h-5 w-28 rounded" />
      <div className="skeleton-shimmer h-10 w-44 rounded-xl" />
      <div className="skeleton-shimmer h-5 w-72 rounded-lg" />
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="skeleton-shimmer h-7 w-64 rounded-lg" />
          <div className="skeleton-shimmer h-5 w-24 rounded" />
        </div>
        <div className="skeleton-shimmer h-8 w-72 rounded-lg" />
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
