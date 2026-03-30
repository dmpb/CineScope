import { getOptionalTmdbBearerToken } from "@/lib/env";
import type { Movie, SearchResult } from "@/types/movie";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

type TmdbMovieDto = {
  id: number;
  title?: string;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
};

type TmdbMovieListResponse = {
  results?: TmdbMovieDto[];
};

type TmdbSearchResponse = {
  results?: TmdbMovieDto[];
  total_results?: number;
};

function buildImageUrl(path: string | null | undefined): string {
  if (!path) {
    return "";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${IMAGE_BASE}${normalized}`;
}

function mapMovieDto(dto: TmdbMovieDto): Movie {
  return {
    id: dto.id,
    title: dto.title ?? "",
    overview: dto.overview ?? "",
    posterPath: buildImageUrl(dto.poster_path),
    backdropPath: buildImageUrl(dto.backdrop_path),
    rating: typeof dto.vote_average === "number" ? dto.vote_average : 0,
    releaseDate: dto.release_date ?? ""
  };
}

async function tmdbFetchJson<T>(path: string): Promise<T | null> {
  const token = getOptionalTmdbBearerToken();
  if (!token) {
    console.error("[tmdb] Missing TMDB_BEARER_TOKEN");
    return null;
  }

  const url = `${TMDB_API_BASE}${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      console.error(`[tmdb] ${path} failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error("[tmdb] Request error", error);
    return null;
  }
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await tmdbFetchJson<TmdbMovieListResponse>("/trending/movie/week");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/popular");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/top_rated");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function searchMovies(query: string): Promise<SearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], totalResults: 0 };
  }

  const path = `/search/movie?${new URLSearchParams({ query: trimmed }).toString()}`;
  const data = await tmdbFetchJson<TmdbSearchResponse>(path);

  if (!data) {
    return { results: [], totalResults: 0 };
  }

  const results = (data.results ?? []).map(mapMovieDto);
  return {
    results,
    totalResults: data.total_results ?? results.length
  };
}

export async function getMovieById(id: number): Promise<Movie | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const data = await tmdbFetchJson<TmdbMovieDto>(`/movie/${id}`);
  if (!data) {
    return null;
  }

  return mapMovieDto(data);
}
