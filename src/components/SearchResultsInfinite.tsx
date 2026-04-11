"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import { SearchResultsGrid } from "@/components/SearchResultsGrid";
import type { SearchMediaKind } from "@/lib/search-params";
import type { Movie, SearchListItem } from "@/types/movie";

function searchHitDedupeKey(item: SearchListItem): string {
  if (item.mediaType === "person") {
    return `person-${item.id}`;
  }
  const m = item as Movie;
  return `${m.mediaType ?? "movie"}-${m.id}`;
}

function appendResultsDeduped(prev: SearchListItem[], batch: SearchListItem[]): SearchListItem[] {
  if (batch.length === 0) {
    return prev;
  }
  const seen = new Set(prev.map(searchHitDedupeKey));
  const next = [...prev];
  for (const m of batch) {
    const key = searchHitDedupeKey(m);
    if (!seen.has(key)) {
      seen.add(key);
      next.push(m);
    }
  }
  return next;
}

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
  initialResults: SearchListItem[];
  initialTotalResults: number;
  initialPage: number;
  initialTotalPages: number;
};

type SearchResponse = {
  results: SearchListItem[];
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
  const [results, setResults] = useState<SearchListItem[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadNextPageRef = useRef<() => Promise<void>>(async () => {});
  const loadingLockRef = useRef(false);
  const hasMoreRef = useRef(false);
  const normalizedQuery = query.trim();
  const filtersActive = year !== undefined || minVote !== undefined;
  const displayedResultCount = filtersActive ? results.length : totalResults;
  const queryLabel = normalizedQuery || ui.searchQueryFallback;

  const emptyCopy =
    mediaKind === "tv"
      ? ui.searchEmptyTv(query)
      : mediaKind === "movie"
        ? ui.searchEmptyMovie(query)
        : mediaKind === "person"
          ? ui.searchEmptyPerson(query)
          : ui.searchEmptyAll(query);

  useEffect(() => {
    setResults(initialResults);
    setTotalResults(initialTotalResults);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
    setErrorMessage(null);
    loadingLockRef.current = false;
  }, [query, mediaKind, year, minVote, initialResults, initialTotalResults, initialPage, initialTotalPages]);

  const hasMore = useMemo(() => {
    if (totalPages > 0) {
      return currentPage < totalPages;
    }
    return results.length < totalResults;
  }, [currentPage, results.length, totalPages, totalResults]);

  hasMoreRef.current = hasMore;

  const loadNextPage = useCallback(async () => {
    if (loadingLockRef.current || !hasMoreRef.current) {
      return;
    }

    loadingLockRef.current = true;
    setIsLoadingMore(true);
    setErrorMessage(null);

    try {
      let pageToFetch = currentPage + 1;
      const aggregated: SearchListItem[] = [];
      let last: SearchResponse | null = null;
      const maxSkips = 24;

      for (let attempt = 0; attempt < maxSkips; attempt += 1) {
        const qs = buildSearchApiQuery(query, pageToFetch, { mediaKind, year, minVote });
        const response = await fetch(`/api/search?${qs}`);
        const data = (await response.json()) as SearchResponse;
        if (!response.ok) {
          throw new Error(data.error || ui.searchNextPageError);
        }

        last = data;
        aggregated.push(...data.results);

        const exhausted = data.totalPages <= 0 || data.currentPage >= data.totalPages;
        if (data.results.length > 0 || exhausted) {
          break;
        }

        pageToFetch = data.currentPage + 1;
      }

      if (!last) {
        return;
      }

      setResults((prev) => appendResultsDeduped(prev, aggregated));
      if (!filtersActive) {
        setTotalResults(last.totalResults);
      }
      setCurrentPage(last.currentPage);
      setTotalPages(last.totalPages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.searchLoadMoreError);
    } finally {
      loadingLockRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currentPage, filtersActive, mediaKind, minVote, query, ui, year]);

  loadNextPageRef.current = loadNextPage;

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasMore || Boolean(errorMessage)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNextPageRef.current();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [errorMessage, hasMore, mediaKind, minVote, normalizedQuery, year]);

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

      <SearchResultsGrid title={ui.searchMatchesSection} items={results} emptyMessage={emptyCopy} ui={ui} />

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
