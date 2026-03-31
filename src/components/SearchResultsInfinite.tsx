"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MovieSection } from "@/components/MovieSection";
import type { Movie } from "@/types/movie";

type SearchResultsInfiniteProps = {
  query: string;
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
};

export function SearchResultsInfinite({
  query,
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
  const [hasError, setHasError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    setHasError(false);

    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`);
      if (!response.ok) {
        throw new Error("Failed to load next search page");
      }

      const data = (await response.json()) as SearchResponse;
      setResults((prev) => [...prev, ...data.results]);
      setTotalResults(data.totalResults);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setHasError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, query]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasMore) {
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
  }, [hasMore, loadNextPage]);

  return (
    <section className="space-y-4 sm:space-y-5" aria-labelledby="search-results-title">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="search-results-title" className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          Resultados para "{query}"
        </h2>
        <p className="text-sm text-zinc-400">
          {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
        </p>
      </header>

      <MovieSection
        title="Coincidencias"
        movies={results}
        emptyMessage={`No se encontraron peliculas para "${query}". Prueba con otro titulo o palabras clave.`}
      />

      {hasError && (
        <p className="text-sm text-amber-300">
          No se pudieron cargar mas resultados. Desplaza nuevamente para reintentar.
        </p>
      )}
      {isLoadingMore && <p className="text-sm text-zinc-400">Cargando mas resultados...</p>}
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </section>
  );
}
