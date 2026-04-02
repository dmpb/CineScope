export default function LoadingSearch() {
  return (
    <main className="w-full max-w-none px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-24 xl:px-10 2xl:px-12">
      <div className="flex w-full flex-col gap-14 sm:gap-16 lg:gap-20">
        <div className="flex w-full flex-wrap items-end gap-3 sm:gap-4">
          <div className="skeleton-shimmer h-10 w-24 rounded-full" />
          <div className="skeleton-shimmer h-10 w-28 rounded-full" />
          <div className="skeleton-shimmer h-10 w-20 rounded-full" />
          <div className="hidden h-8 w-px bg-zinc-800 sm:block" aria-hidden="true" />
          <div className="skeleton-shimmer h-10 w-32 rounded-lg" />
          <div className="skeleton-shimmer h-10 w-36 rounded-lg" />
          <div className="skeleton-shimmer h-10 w-24 rounded-lg" />
        </div>
        <div className="min-w-0 space-y-4 pt-2 sm:pt-4">
          <div className="skeleton-shimmer h-8 w-64 rounded-lg" />
          <div className="skeleton-shimmer h-6 w-48 rounded-lg" />
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
