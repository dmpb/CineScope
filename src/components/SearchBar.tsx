"use client";

import { useSearchParams } from "next/navigation";

type SearchBarProps = {
  defaultValue?: string;
  compact?: boolean;
};

export function SearchBar({ defaultValue = "", compact = false }: SearchBarProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";
  const resolvedDefaultValue = defaultValue || queryFromUrl;
  const formClassName = compact
    ? "group flex w-full items-center justify-end gap-2"
    : "flex w-full max-w-2xl flex-col gap-2 sm:flex-row";
  const inputClassName = compact
    ? "focus-ring premium-transition h-9 w-full rounded-full border border-zinc-700/80 bg-zinc-900/75 px-3 text-sm text-zinc-100 placeholder:text-zinc-400 sm:w-44 sm:group-focus-within:w-60 lg:w-52 lg:group-focus-within:w-64"
    : "focus-ring premium-transition w-full rounded-xl border border-zinc-700 bg-zinc-900/85 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-500";
  const buttonClassName = compact
    ? "focus-ring premium-transition h-9 rounded-full border border-red-500/40 bg-red-600 px-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-red-500"
    : "focus-ring premium-transition rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500";

  return (
    <form
      key={resolvedDefaultValue}
      action="/search"
      method="get"
      role="search"
      aria-label="Buscar peliculas"
      className={formClassName}
    >
      <label htmlFor="search-query" className="sr-only">
        Buscar pelicula por titulo
      </label>
      <input
        id="search-query"
        type="search"
        name="q"
        defaultValue={resolvedDefaultValue}
        placeholder="Busca una pelicula..."
        className={inputClassName}
      />
      <button
        type="submit"
        className={buttonClassName}
      >
        {compact ? "Ir" : "Buscar"}
      </button>
    </form>
  );
}
