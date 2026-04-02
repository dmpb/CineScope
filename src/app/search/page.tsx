import type { Metadata } from "next";
import { SearchFiltersBar } from "@/components/SearchFiltersBar";
import { SearchResultsInfinite } from "@/components/SearchResultsInfinite";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { searchMedia } from "@/lib/tmdb";
import {
  normalizeSearchParam,
  parseMinVoteParam,
  parseSearchMediaKind,
  parseYearParam
} from "@/lib/search-params";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    type?: string | string[];
    year?: string | string[];
    minVote?: string | string[];
  }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = (normalizeSearchParam(sp.q) ?? "").trim();
  const typeParam = normalizeSearchParam(sp.type);
  const query = q;
  const site = "CineScope";
  const mediaKind = parseSearchMediaKind(typeParam);

  const typeSuffix =
    mediaKind === "movie" ? " · Solo peliculas" : mediaKind === "tv" ? " · Solo series" : "";

  if (!query) {
    return {
      title: `Busqueda | ${site}`,
      description: "Busca peliculas y series con filtros por tipo, ano y valoracion."
    };
  }

  return {
    title: `"${query}"${typeSuffix} | Busqueda | ${site}`,
    description: `Resultados para "${query}" en CineScope con filtros opcionales.`
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

  const emptyCopy =
    mediaKind === "tv"
      ? "series"
      : mediaKind === "movie"
        ? "peliculas"
        : "peliculas o series";

  return (
    <main className="w-full max-w-none px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-24 xl:px-10 2xl:px-12">
      {!hasToken && (
        <StateMessage variant="warning">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </StateMessage>
      )}

      {query.length === 0 && (
        <div className="mx-auto max-w-2xl">
          <StateMessage variant="empty">Ingresa un termino para comenzar la busqueda.</StateMessage>
        </div>
      )}

      {hasError && (
        <div className="mx-auto max-w-2xl">
          <StateMessage variant="error">
            Ocurrio un error al buscar {emptyCopy}. Intenta nuevamente.
          </StateMessage>
        </div>
      )}

      {query.length > 0 && !hasError && (
        <div className="flex w-full flex-col gap-14 sm:gap-10">
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
