export default function LoadingMovieDetail() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-12">
      <div className="h-5 w-28 animate-pulse rounded bg-zinc-800" />
      <div className="aspect-[21/9] w-full animate-pulse rounded-xl bg-zinc-800" />
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="aspect-[2/3] w-full max-w-[220px] animate-pulse rounded-lg bg-zinc-800" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-800" />
          <div className="h-24 w-full animate-pulse rounded bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
