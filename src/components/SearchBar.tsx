"use client";

import { useSearchParams } from "next/navigation";

type SearchBarProps = {
  defaultValue?: string;
};

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";
  const resolvedDefaultValue = defaultValue || queryFromUrl;

  return (
    <form
      key={resolvedDefaultValue}
      action="/search"
      method="get"
      role="search"
      aria-label="Buscar peliculas"
      className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row"
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
        className="focus-ring w-full rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-500"
      />
      <button
        type="submit"
        className="focus-ring rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
      >
        Buscar
      </button>
    </form>
  );
}
