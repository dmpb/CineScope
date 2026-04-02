export default function LoadingSearch() {
  return (
    <main className="page-shell">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
        </div>
        <div className="skeleton-shimmer h-8 w-72 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="skeleton-shimmer overflow-hidden rounded-xl">
              <div className="aspect-[2/3] w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
