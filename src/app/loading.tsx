export default function Loading() {
  return (
    <main className="page-shell">
      <div className="h-10 w-52 animate-pulse rounded-xl bg-zinc-800" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-800" />
        ))}
      </div>
    </main>
  );
}
