import type { Metadata } from "next";
import { SearchFiltersBar } from "@/components/SearchFiltersBar";
import { SearchResultsInfinite } from "@/components/SearchResultsInfinite";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { searchMedia } from "@/lib/tmdb";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import {
  normalizeSearchParam,
  parseMinVoteParam,
  parseSearchMediaKind,
  parseYearParam
} from "@/lib/search-params";
import { getUiMessages } from "@/lib/ui-i18n";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    type?: string | string[];
    year?: string | string[];
    minVote?: string | string[];
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const sp = await searchParams;
  const q = (normalizeSearchParam(sp.q) ?? "").trim();
  const typeParam = normalizeSearchParam(sp.type);
  const query = q;
  const mediaKind = parseSearchMediaKind(typeParam);

  const typeNote =
    mediaKind === "movie" ? ui.searchTypeNoteMovie : mediaKind === "tv" ? ui.searchTypeNoteTv : ui.searchTypeNoteAll;

  if (!query) {
    return {
      title: ui.metaSearchTitle,
      description: ui.metaSearchDescription,
      openGraph: {
        url: "/search"
      },
      alternates: {
        canonical: "/search"
      }
    };
  }

  const safeTitle = query.length > 42 ? `${query.slice(0, 42)}…` : query;

  return {
    title: ui.metaSearchTitleWithQuery(safeTitle),
    description: ui.metaSearchDescriptionWithQuery(query, typeNote),
    openGraph: {
      url: `/search?q=${encodeURIComponent(query)}`
    },
    alternates: {
      canonical: `/search?q=${encodeURIComponent(query)}`
    }
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = (normalizeSearchParam(sp.q) ?? "").trim();
  const typeParam = normalizeSearchParam(sp.type);
  const yearParam = normalizeSearchParam(sp.year);
  const minVoteParam = normalizeSearchParam(sp.minVote);
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const mediaKind = parseSearchMediaKind(typeParam);
  const year = parseYearParam(yearParam);
  const minVote = parseMinVoteParam(minVoteParam);
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());

  let hasError = false;
  let totalResults = 0;
  let currentPage = 1;
  let totalPages = 0;
  let results = [] as Awaited<ReturnType<typeof searchMedia>>["results"];

  if (query) {
    try {
      const searchResult = await searchMedia(query, 1, { kind: mediaKind, year, minVote });
      totalResults = searchResult.totalResults;
      currentPage = searchResult.currentPage;
      totalPages = searchResult.totalPages;
      results = searchResult.results;
    } catch {
      hasError = true;
    }
  }

  const searchErrorKind =
    mediaKind === "tv" ? ui.searchErrorTv : mediaKind === "movie" ? ui.searchErrorMovie : ui.searchErrorAll;

  return (
    <main className="w-full max-w-none px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-24 xl:px-10 2xl:px-12">
      {!hasToken && (
        <StateMessage variant="warning">
          {ui.tokenWarningBefore}
          <code>TMDB_BEARER_TOKEN</code>
          {ui.tokenWarningAfter}
        </StateMessage>
      )}

      {query.length === 0 && (
        <div className="mx-auto max-w-2xl">
          <StateMessage variant="empty">{ui.searchEmptyPrompt}</StateMessage>
        </div>
      )}

      {hasError && (
        <div className="mx-auto max-w-2xl">
          <StateMessage variant="error">{ui.searchFetchError(searchErrorKind)}</StateMessage>
        </div>
      )}

      {query.length > 0 && !hasError && (
        <div className="flex w-full flex-col gap-8 sm:gap-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{ui.searchHeading}</h1>
          <SearchFiltersBar query={query} mediaKind={mediaKind} year={year} minVote={minVote} />
          <div className="min-w-0 pt-2 sm:pt-4">
            <SearchResultsInfinite
              query={query}
              mediaKind={mediaKind}
              year={year}
              minVote={minVote}
              initialResults={results}
              initialTotalResults={totalResults}
              initialPage={currentPage}
              initialTotalPages={totalPages}
            />
          </div>
        </div>
      )}
    </main>
  );
}
