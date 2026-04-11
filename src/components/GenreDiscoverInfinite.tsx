"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { StateMessage } from "@/components/StateMessage";
import { useUiMessages } from "@/components/LocaleProvider";
import type { Movie } from "@/types/movie";

function movieDedupeKey(movie: Movie): string {
  return `${movie.mediaType ?? "movie"}-${movie.id}`;
}

function appendMoviesDeduped(prev: Movie[], batch: Movie[]): Movie[] {
  if (batch.length === 0) {
    return prev;
  }
  const seen = new Set(prev.map(movieDedupeKey));
  const next = [...prev];
  for (const m of batch) {
    const key = movieDedupeKey(m);
    if (!seen.has(key)) {
      seen.add(key);
      next.push(m);
    }
  }
  return next;
}

type DiscoverGenreApiResponse = {
  results: Movie[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error?: string;
};

type GenreDiscoverInfiniteProps = {
  kind: "movie" | "tv";
  genreId: number;
  genreName: string;
  sectionTitle: string;
  emptyMessage: string;
  initialResults: Movie[];
  initialTotalResults: number;
  initialPage: number;
  initialTotalPages: number;
};

export function GenreDiscoverInfinite({
  kind,
  genreId,
  genreName,
  sectionTitle,
  emptyMessage,
  initialResults,
  initialTotalResults,
  initialPage,
  initialTotalPages
}: GenreDiscoverInfiniteProps) {
  const ui = useUiMessages();
  const [results, setResults] = useState<Movie[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadNextPageRef = useRef<() => Promise<void>>(async () => {});
  const loadingLockRef = useRef(false);
  const hasMoreRef = useRef(false);

  const headingId = `genre-discover-${kind}-${genreId}`;

  useEffect(() => {
    setResults(initialResults);
    setTotalResults(initialTotalResults);
    setCurrentPage(initialPage);
    setTotalPages(initialTotalPages);
    setErrorMessage(null);
    loadingLockRef.current = false;
  }, [genreId, kind, initialResults, initialTotalResults, initialPage, initialTotalPages]);

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
      const aggregated: Movie[] = [];
      let last: DiscoverGenreApiResponse | null = null;
      const maxSkips = 24;

      for (let attempt = 0; attempt < maxSkips; attempt += 1) {
        const qs = new URLSearchParams({
          kind,
          genreId: String(genreId),
          page: String(pageToFetch)
        });
        const response = await fetch(`/api/discover/by-genre?${qs.toString()}`);
        const data = (await response.json()) as DiscoverGenreApiResponse;
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

      setResults((prev) => appendMoviesDeduped(prev, aggregated));
      setTotalResults(last.totalResults);
      setCurrentPage(last.currentPage);
      setTotalPages(last.totalPages);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.searchLoadMoreError);
    } finally {
      loadingLockRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currentPage, genreId, kind, ui]);

  loadNextPageRef.current = loadNextPage;

  useEffect(() => {
    const element = sentinelRef.current;
    if (element == null || !hasMore || errorMessage != null) {
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
  }, [errorMessage, hasMore, genreId, kind]);

  const pageLine =
    totalPages > 0 ? ui.searchPageOf(currentPage, totalPages) : ui.searchPageCurrent(currentPage);

  const listClassName =
    "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <section className="space-y-4 sm:space-y-5" aria-labelledby={headingId}>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id={headingId} className="text-xl font-semibold text-zinc-100 sm:text-2xl">
          {sectionTitle}
        </h2>
        <div className="text-sm text-zinc-400">
          <p>
            {totalResults}{" "}
            {totalResults === 1 ? ui.searchResultCount : ui.searchResultCountPlural}
          </p>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {ui.searchGridView}
            {pageLine}
          </p>
        </div>
      </header>

      {results.length > 0 ? (
        <ul className={listClassName} role="list" aria-label={ui.sectionAriaGrid(sectionTitle)}>
          {results.map((movie, index) => (
            <li key={`${movieDedupeKey(movie)}-${index}`} className="min-w-0">
              <MovieCard movie={movie} ui={ui} />
            </li>
          ))}
        </ul>
      ) : (
        <StateMessage variant="empty">{emptyMessage}</StateMessage>
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
          : ui.searchAnnounceDefault(results.length, totalResults, genreName)}
      </p>
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />
    </section>
  );
}
