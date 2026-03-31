export default function LoadingMovieDetail() {
  return (
    <main className="page-shell">
      <div className="h-5 w-28 animate-pulse rounded bg-zinc-800" />
      <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-zinc-800 sm:aspect-[21/9]" />
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="aspect-[2/3] w-full max-w-[220px] animate-pulse rounded-xl bg-zinc-800" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
          <div className="h-24 w-full animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
