"use client";

type SearchBarProps = {
  defaultValue?: string;
  compact?: boolean;
};

export function SearchBar({ defaultValue = "", compact = false }: SearchBarProps) {
  const initialValue = defaultValue.trim();
  const formClassName = compact ? "w-full" : "w-full max-w-2xl";
  const inputClassName = compact
    ? "focus-ring premium-transition h-9 w-full rounded-full border border-zinc-700/80 bg-zinc-900/75 py-2 pl-3 pr-10 text-sm text-zinc-100 placeholder:text-zinc-400"
    : "focus-ring premium-transition w-full rounded-xl border border-zinc-700 bg-zinc-900/85 py-2.5 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-500";

  return (
    <form
      action="/search"
      method="get"
      role="search"
      aria-label="Buscar peliculas"
      className={formClassName}
    >
      <label htmlFor="search-query" className="sr-only">
        Buscar pelicula por titulo
      </label>
      <div className="relative">
        <input
          id="search-query"
          type="search"
          name="q"
          defaultValue={initialValue}
          placeholder="Busca una pelicula..."
          className={inputClassName}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.currentTarget.value = "";
              event.currentTarget.blur();
            }
          }}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
    </form>
  );
}
