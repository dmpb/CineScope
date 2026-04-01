"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";

type SearchBarProps = {
  defaultValue?: string;
  compact?: boolean;
};

export function SearchBar({ defaultValue = "", compact = false }: SearchBarProps) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
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
  const clearButtonClassName = compact
    ? "focus-ring premium-transition h-9 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-200 hover:border-zinc-400 hover:text-zinc-100"
    : "focus-ring premium-transition rounded-xl border border-zinc-600 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-400 hover:text-zinc-100";

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
        ref={inputRef}
        id="search-query"
        type="search"
        name="q"
        defaultValue={resolvedDefaultValue}
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
      {resolvedDefaultValue.length > 0 && (
        <button
          type="button"
          aria-label="Limpiar busqueda"
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
              inputRef.current.focus();
            }
          }}
          className={clearButtonClassName}
        >
          {compact ? "Limpiar" : "Borrar"}
        </button>
      )}
      <button
        type="submit"
        aria-label="Buscar"
        className={buttonClassName}
      >
        {compact ? (
          <>
            <span className="sr-only">Buscar</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </>
        ) : (
          "Buscar"
        )}
      </button>
    </form>
  );
}
