export default function LoadingSearch() {
  return (
    <main className="page-shell">
      <div className="h-5 w-32 animate-pulse rounded bg-zinc-800" />
      <div className="h-10 w-48 animate-pulse rounded-xl bg-zinc-800" />
      <div className="h-11 w-full max-w-2xl animate-pulse rounded-xl bg-zinc-800" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-800" />
        ))}
      </div>
    </main>
  );
}
