import type { Movie } from "@/types/movie";

export type SearchMediaKind = "all" | "movie" | "tv";

/** Next.js puede entregar string o string[] si el parametro se repite en la URL. */
export function normalizeSearchParam(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

export type SearchMediaOptions = {
  kind?: SearchMediaKind;
  year?: number;
  minVote?: number;
};

export function parseSearchMediaKind(value: string | null | undefined): SearchMediaKind {
  if (value === "movie" || value === "tv" || value === "all") {
    return value;
  }
  return "all";
}

export function parseYearParam(value: string | null | undefined): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const n = Number(value);
  if (Number.isInteger(n) && n >= 1900 && n <= 2100) {
    return n;
  }
  return undefined;
}

export function parseMinVoteParam(value: string | null | undefined): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const n = Number(value);
  if (Number.isFinite(n) && n >= 0 && n <= 10) {
    return n;
  }
  return undefined;
}

/** Refina resultados por pagina (TMDb no filtra ano/valoracion en /search). */
export function filterSearchResults(
  results: Movie[],
  opts: { year?: number; minVote?: number }
): Movie[] {
  const { year, minVote } = opts;
  if (year === undefined && minVote === undefined) {
    return results;
  }

  return results.filter((m) => {
    if (minVote !== undefined && m.rating < minVote) {
      return false;
    }
    if (year !== undefined) {
      const y = Number.parseInt(m.releaseDate.slice(0, 4), 10);
      if (!Number.isFinite(y) || y !== year) {
        return false;
      }
    }
    return true;
  });
}
