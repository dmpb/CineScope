"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
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
  const ui = useUiMessages();
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
  const queryLabel = normalizedQuery || ui.searchQueryFallback;

  const emptyCopy =
    mediaKind === "tv"
      ? ui.searchEmptyTv(query)
      : mediaKind === "movie"
        ? ui.searchEmptyMovie(query)
        : ui.searchEmptyAll(query);

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
        throw new Error(data.error || ui.searchNextPageError);
      }

      setResults((prev) => [...prev, ...data.results]);
      if (!filtersActive) {
        setTotalResults(data.totalResults);
      }
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.searchLoadMoreError);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, filtersActive, hasMore, isLoadingMore, mediaKind, minVote, query, ui, year]);

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

  const pageLine =
    totalPages > 0 ? ui.searchPageOf(currentPage, totalPages) : ui.searchPageCurrent(currentPage);

  return (
    <section className="w-full max-w-none space-y-4 sm:space-y-5" aria-labelledby="search-results-title">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="search-results-title" className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          {ui.searchResultsFor(query)}
        </h2>
        <div className="text-sm text-zinc-400">
          <p>
            {displayedResultCount}{" "}
            {displayedResultCount === 1 ? ui.searchResultCount : ui.searchResultCountPlural}
            {filtersActive ? ui.searchShownWithFilters : ""}
          </p>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {filtersActive ? ui.searchLocalFilter : ""}
            {ui.searchGridView}
            {pageLine}
          </p>
        </div>
      </header>

      <MovieSection title={ui.searchMatchesSection} movies={results} emptyMessage={emptyCopy} layout="grid" ui={ui} />

      {results.length === 0 && normalizedQuery.length > 0 && (
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-sm text-zinc-300">
          <p className="font-medium text-zinc-200">{ui.searchSuggestionsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>{ui.searchSuggestion1}</li>
            <li>{ui.searchSuggestion2}</li>
            <li>{ui.searchSuggestion3}</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <Link href="/movies" className="focus-ring rounded border border-zinc-700 px-2.5 py-1.5 hover:border-zinc-500">
              {ui.searchGoMovies}
            </Link>
            <Link href="/series" className="focus-ring rounded border border-zinc-700 px-2.5 py-1.5 hover:border-zinc-500">
              {ui.searchGoSeries}
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
            {ui.searchRetryLoad}
          </button>
        </div>
      )}
      {isLoadingMore && (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">{ui.searchLoadingMore}</p>
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
          {ui.searchLoadMore}
        </button>
      )}
      <p aria-live="polite" className="sr-only">
        {errorMessage
          ? ui.searchAnnounceError(errorMessage)
          : filtersActive
            ? ui.searchAnnounceFiltered(results.length, queryLabel)
            : ui.searchAnnounceDefault(results.length, totalResults, queryLabel)}
      </p>
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </section>
  );
}
