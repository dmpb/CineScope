export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-800" />
        ))}
      </div>
    </main>
  );
}
