"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SearchMediaKind } from "@/lib/search-params";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: number[] = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, index) => CURRENT_YEAR - index);

const TYPE_OPTIONS: { value: SearchMediaKind; label: string; title: string }[] = [
  { value: "all", label: "Todo", title: "Peliculas y series" },
  { value: "movie", label: "Peliculas", title: "Solo peliculas" },
  { value: "tv", label: "Series", title: "Solo series" }
];

const selectClassName =
  "focus-ring premium-transition h-10 min-w-[7.5rem] cursor-pointer appearance-none rounded-lg border border-zinc-700/80 bg-zinc-950/50 px-3 pr-9 text-sm text-zinc-100 hover:border-zinc-600 sm:min-w-[8.5rem]";

type SearchFiltersBarProps = {
  query: string;
  mediaKind: SearchMediaKind;
  year?: number;
  minVote?: number;
};

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchFiltersBar({ query, mediaKind, year, minVote }: SearchFiltersBarProps) {
  const trimmed = query.trim();
  const [kind, setKind] = useState<SearchMediaKind>(mediaKind);
  const [yearValue, setYearValue] = useState(() => (year !== undefined ? String(year) : ""));
  const [minVoteValue, setMinVoteValue] = useState(() => (minVote !== undefined ? String(minVote) : ""));

  useEffect(() => {
    setKind(mediaKind);
    setYearValue(year !== undefined ? String(year) : "");
    setMinVoteValue(minVote !== undefined ? String(minVote) : "");
  }, [query, mediaKind, year, minVote]);

  if (!trimmed) {
    return null;
  }

  return (
    <form
      method="get"
      action="/search"
      role="search"
      aria-label="Filtros de resultados de busqueda"
      className="flex w-full min-w-0 flex-wrap items-end gap-x-4 gap-y-3"
    >
      <input type="hidden" name="q" value={trimmed} />

      <div role="group" aria-label="Tipo de contenido" className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Tipo</span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {TYPE_OPTIONS.map(({ value, label, title }) => {
            const selected = kind === value;
            return (
              <label
                key={value}
                title={title}
                className={`premium-transition cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500/60 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 ${
                  selected
                    ? "border-red-500/50 bg-red-600/25 text-red-100"
                    : "border-zinc-700/80 bg-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  checked={selected}
                  onChange={() => setKind(value)}
                  className="sr-only"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="hidden h-8 w-px shrink-0 self-center bg-zinc-800 sm:block" aria-hidden="true" />

      <div className="flex min-w-[9rem] flex-col gap-1">
        <label htmlFor="search-filter-year" className="text-[11px] font-medium text-zinc-500">
          Año
        </label>
        <div className="relative">
          <select
            id="search-filter-year"
            name="year"
            value={yearValue}
            onChange={(event) => setYearValue(event.target.value)}
            className={`${selectClassName} w-full sm:w-auto`}
          >
            <option value="">Cualquiera</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      <div className="flex min-w-[9rem] flex-col gap-1">
        <label htmlFor="search-filter-min-vote" className="text-[11px] font-medium text-zinc-500">
          Valoracion min.
        </label>
        <div className="relative">
          <select
            id="search-filter-min-vote"
            name="minVote"
            value={minVoteValue}
            onChange={(event) => setMinVoteValue(event.target.value)}
            className={`${selectClassName} w-full sm:w-auto`}
          >
            <option value="">Cualquiera</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
            <option value="8.5">8.5+</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <button
          type="submit"
          className="focus-ring premium-transition rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Aplicar
        </button>
        <Link
          href={`/search?q=${encodeURIComponent(trimmed)}`}
          className="focus-ring rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}
