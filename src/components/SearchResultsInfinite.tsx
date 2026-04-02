"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MovieSection } from "@/components/MovieSection";
import type { SearchMediaKind } from "@/lib/search-params";
import type { Movie } from "@/types/movie";

function buildSearchApiQuery(
  query: string,
  page: number,
  opts: { mediaKind: SearchMediaKind; year?: number; minVote?: number }
): string {
  const params = new URLSearchParams({ q: query, page: String(page) });
  if (opts.mediaKind !== "all") {
    params.set("type", opts.mediaKind);
  }
  if (opts.year !== undefined) {
    params.set("year", String(opts.year));
  }
  if (opts.minVote !== undefined) {
    params.set("minVote", String(opts.minVote));
  }
  return params.toString();
}

type SearchResultsInfiniteProps = {
  query: string;
  mediaKind: SearchMediaKind;
  year?: number;
  minVote?: number;
  initialResults: Movie[];
  initialTotalResults: number;
  initialPage: number;
  initialTotalPages: number;
};

type SearchResponse = {
  results: Movie[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error?: string;
};

function getMediaKey(movie: Movie): string {
  return `${movie.mediaType ?? "movie"}-${movie.id}`;
}

function mergeUniqueMovies(previous: Movie[], next: Movie[]): Movie[] {
  const merged = [...previous];
  const seen = new Set(previous.map(getMediaKey));
  for (const movie of next) {
    const key = getMediaKey(movie);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    merged.push(movie);
  }
  return merged;
}

export function SearchResultsInfinite({
  query,
  mediaKind,
  year,
  minVote,
  initialResults,
  initialTotalResults,
  initialPage,
  initialTotalPages
}: SearchResultsInfiniteProps) {
  const [results, setResults] = useState<Movie[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const normalizedQuery = query.trim();
  const filtersActive = year !== undefined || minVote !== undefined;
  const displayedResultCount = filtersActive ? results.length : totalResults;

  useEffect(() => {
    setResults(initialResults);
    setTotalResults(initialTotalResults);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
    setErrorMessage(null);
  }, [query, mediaKind, year, minVote, initialResults, initialTotalResults, initialPage, initialTotalPages]);

  const hasMore = useMemo(() => {
    if (totalPages > 0) {
      return currentPage < totalPages;
    }
    return results.length < totalResults;
  }, [currentPage, results.length, totalPages, totalResults]);

  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      const nextPage = currentPage + 1;
      const qs = buildSearchApiQuery(query, nextPage, { mediaKind, year, minVote });
      const response = await fetch(`/api/search?${qs}`);
      const data = (await response.json()) as SearchResponse;
      if (!response.ok) {
        throw new Error(data.error || "No se pudo cargar la siguiente pagina.");
      }

      setResults((prev) => mergeUniqueMovies(prev, data.results));
      if (!filtersActive) {
        setTotalResults(data.totalResults);
      }
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo cargar mas resultados.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, filtersActive, hasMore, isLoadingMore, mediaKind, minVote, query, year]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasMore || Boolean(errorMessage)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNextPage();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [errorMessage, hasMore, loadNextPage]);

  const emptyCopy =
    mediaKind === "tv"
      ? `No se encontraron series para "${query}". Prueba el titulo original o un termino mas corto.`
      : mediaKind === "movie"
        ? `No se encontraron peliculas para "${query}". Intenta con menos palabras, el titulo original o un termino mas general.`
        : `No se encontraron peliculas ni series para "${query}". Intenta con menos palabras, el titulo original o un termino mas general.`;

  return (
    <section className="w-full max-w-none space-y-4 sm:space-y-5" aria-labelledby="search-results-title">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="search-results-title" className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          Resultados para "{query}"
        </h2>
        <div className="text-sm text-zinc-400">
          <p>
            {displayedResultCount}{" "}
            {displayedResultCount === 1 ? "resultado" : "resultados"}
            {filtersActive ? " mostrados" : ""}
          </p>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {filtersActive ? "Filtro local · " : ""}
            Vista en grid · Pagina {currentPage}
            {totalPages > 0 ? ` de ${totalPages}` : ""}
          </p>
        </div>
      </header>

      <MovieSection title="Coincidencias" movies={results} emptyMessage={emptyCopy} layout="grid" />

      {results.length === 0 && normalizedQuery.length > 0 && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-sm text-zinc-300">
          <p className="font-medium text-zinc-200">Sugerencias de busqueda</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>Prueba sin acentos o con el titulo original.</li>
            <li>Usa menos palabras y evita signos especiales.</li>
            <li>Ajusta los filtros o explora peliculas y series desde el menu.</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <Link href="/movies" className="focus-ring rounded border border-zinc-700 px-2.5 py-1.5 hover:border-zinc-500">
              Ver peliculas
            </Link>
            <Link href="/series" className="focus-ring rounded border border-zinc-700 px-2.5 py-1.5 hover:border-zinc-500">
              Ver series
            </Link>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-sm text-amber-200">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadNextPage()}
            className="focus-ring mt-2 rounded border border-amber-400/40 px-3 py-1.5 text-xs font-medium hover:border-amber-300"
          >
            Reintentar carga
          </button>
        </div>
      )}
      {isLoadingMore && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">Cargando mas resultados...</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton-shimmer overflow-hidden rounded-xl">
                <div className="aspect-[2/3] w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}
      {hasMore && !isLoadingMore && (
        <button
          type="button"
          onClick={() => void loadNextPage()}
          className="focus-ring premium-transition rounded-lg border border-zinc-600 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-400 hover:text-zinc-100"
        >
          Cargar mas resultados
        </button>
      )}
      <p aria-live="polite" className="sr-only">
        {errorMessage
          ? `Error: ${errorMessage}`
          : filtersActive
            ? `${results.length} resultados visibles con filtros para ${normalizedQuery || "busqueda"}.`
            : `Mostrando ${results.length} de ${totalResults} resultados para ${normalizedQuery || "busqueda"}.`}
      </p>
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </section>
  );
}
