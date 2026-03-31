import { getOptionalTmdbBearerToken } from "@/lib/env";
import type { Movie, SearchResult } from "@/types/movie";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const isTmdbMockMode = process.env.TMDB_MOCK_MODE === "1";

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

type TmdbGenreDto = {
  id: number;
  name?: string;
};

type TmdbGenreListResponse = {
  genres?: TmdbGenreDto[];
};

export type MovieGenre = {
  id: number;
  name: string;
};

const MOCK_MOVIES: TmdbMovieDto[] = [
  {
    id: 603,
    title: "The Matrix",
    overview: "A hacker discovers reality is a simulation and joins a rebellion.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
    vote_average: 8.2,
    release_date: "1999-03-31"
  },
  {
    id: 27205,
    title: "Inception",
    overview: "A thief enters dreams to steal secrets and plant an idea.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    vote_average: 8.4,
    release_date: "2010-07-16"
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman faces Joker as chaos spreads across Gotham City.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    vote_average: 8.5,
    release_date: "2008-07-18"
  },
  {
    id: 550,
    title: "Fight Club",
    overview: "An insomniac office worker starts an underground fight club.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
    vote_average: 8.4,
    release_date: "1999-10-15"
  },
  {
    id: 13,
    title: "Forrest Gump",
    overview: "Forrest recounts his accidental role in pivotal historical moments.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    vote_average: 8.5,
    release_date: "1994-07-06"
  },
  {
    id: 238,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    vote_average: 8.7,
    release_date: "1972-03-14"
  }
];

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

function getMockMovies(): Movie[] {
  return MOCK_MOVIES.map(mapMovieDto);
}

function getMockGenres(): MovieGenre[] {
  return [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" }
  ];
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
  if (isTmdbMockMode) {
    return getMockMovies().slice(0, 5);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/trending/movie/week");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getPopularMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const movies = getMockMovies();
    return [movies[1], movies[5], movies[0], movies[2], movies[3]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/popular");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return getMockMovies()
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/top_rated");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const movies = getMockMovies();
    return [movies[2], movies[0], movies[4], movies[1], movies[3]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/now_playing");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const movies = getMockMovies();
    return [movies[5], movies[1], movies[3], movies[0], movies[2]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/movie/upcoming");
  if (!data?.results?.length) {
    return [];
  }

  return data.results.map(mapMovieDto);
}

export async function getMovieGenres(): Promise<MovieGenre[]> {
  if (isTmdbMockMode) {
    return getMockGenres();
  }

  const data = await tmdbFetchJson<TmdbGenreListResponse>("/genre/movie/list");
  if (!data?.genres?.length) {
    return [];
  }

  return data.genres
    .filter((genre) => Number.isInteger(genre.id))
    .map((genre) => ({
      id: genre.id,
      name: genre.name ?? `Genre ${genre.id}`
    }));
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  if (!Number.isInteger(genreId) || genreId <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    const movies = getMockMovies();
    if (genreId === 28) {
      return [movies[0], movies[2], movies[3]].filter(Boolean);
    }
    if (genreId === 35) {
      return [movies[4], movies[1], movies[5]].filter(Boolean);
    }
    return movies.slice(0, 5);
  }

  const path = `/discover/movie?${new URLSearchParams({ with_genres: String(genreId) }).toString()}`;
  const data = await tmdbFetchJson<TmdbMovieListResponse>(path);
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

  if (isTmdbMockMode) {
    const queryLower = trimmed.toLowerCase();
    const results = getMockMovies().filter((movie) => movie.title.toLowerCase().includes(queryLower));
    return { results, totalResults: results.length };
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

  if (isTmdbMockMode) {
    return getMockMovies().find((movie) => movie.id === id) ?? null;
  }

  const data = await tmdbFetchJson<TmdbMovieDto>(`/movie/${id}`);
  if (!data) {
    return null;
  }

  return mapMovieDto(data);
}
