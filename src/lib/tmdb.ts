import { getOptionalTmdbBearerToken, getTmdbLanguage, getTmdbRegion } from "@/lib/env";
import { filterSearchResults, type SearchMediaKind, type SearchMediaOptions } from "@/lib/search-params";
import type { CastMember, CrewHighlights, Movie, SearchResult, WatchProvider } from "@/types/movie";

export type { SearchMediaKind, SearchMediaOptions } from "@/lib/search-params";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const isTmdbMockMode = process.env.TMDB_MOCK_MODE === "1";
const RUNTIME_ENRICH_LIMIT = 8;

type TmdbMovieDto = {
  id: number;
  title?: string;
  original_title?: string;
  tagline?: string;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  status?: string;
  production_countries?: Array<{ iso_3166_1?: string; name?: string }>;
  release_date?: string;
  original_language?: string;
  runtime?: number;
  genres?: TmdbGenreDto[];
};

type TmdbCreatedByPerson = {
  name?: string;
};

type TmdbNetworkDto = {
  name?: string;
};

type TmdbTvDto = {
  id: number;
  name?: string;
  original_name?: string;
  tagline?: string;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  status?: string;
  production_countries?: Array<{ iso_3166_1?: string; name?: string }>;
  origin_country?: string[];
  first_air_date?: string;
  last_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  networks?: TmdbNetworkDto[];
  created_by?: TmdbCreatedByPerson[];
  original_language?: string;
  episode_run_time?: number[];
  genres?: TmdbGenreDto[];
};

type TmdbMovieListResponse = {
  results?: TmdbMovieDto[];
};

type TmdbTvListResponse = {
  results?: TmdbTvDto[];
};

type TmdbSearchResponse = {
  results?: TmdbMovieDto[];
  total_results?: number;
  page?: number;
  total_pages?: number;
};

type TmdbTvSearchResponse = {
  results?: TmdbTvDto[];
  total_results?: number;
  page?: number;
  total_pages?: number;
};

type TmdbMultiSearchRecord = (TmdbMovieDto | TmdbTvDto) & { media_type?: string };

type TmdbMultiSearchResponse = {
  results?: TmdbMultiSearchRecord[];
  total_results?: number;
  page?: number;
  total_pages?: number;
};

type TmdbVideoDto = {
  key?: string;
  site?: string;
  type?: string;
  official?: boolean;
};

type TmdbVideoListResponse = {
  results?: TmdbVideoDto[];
};

type TmdbCastDto = {
  id: number;
  name?: string;
  character?: string;
  profile_path?: string | null;
};

type TmdbCreditsResponse = {
  cast?: TmdbCastDto[];
  crew?: Array<{
    id: number;
    name?: string;
    job?: string;
    department?: string;
  }>;
};

type TmdbGenreDto = {
  id: number;
  name?: string;
};

type TmdbGenreListResponse = {
  genres?: TmdbGenreDto[];
};

type TmdbWatchProvidersResponse = {
  results?: Record<
    string,
    {
      flatrate?: Array<{ provider_id?: number; provider_name?: string; logo_path?: string | null }>;
      rent?: Array<{ provider_id?: number; provider_name?: string; logo_path?: string | null }>;
      buy?: Array<{ provider_id?: number; provider_name?: string; logo_path?: string | null }>;
    }
  >;
};

type TmdbImagesResponse = {
  backdrops?: Array<{ file_path?: string | null }>;
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
    vote_count: 26000,
    release_date: "1999-03-31",
    original_language: "en",
    runtime: 136,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "A thief enters dreams to steal secrets and plant an idea.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    vote_average: 8.4,
    vote_count: 37000,
    release_date: "2010-07-16",
    original_language: "en",
    runtime: 148,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" }
    ]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman faces Joker as chaos spreads across Gotham City.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    vote_average: 8.5,
    vote_count: 33000,
    release_date: "2008-07-18",
    original_language: "en",
    runtime: 152,
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ]
  },
  {
    id: 550,
    title: "Fight Club",
    overview: "An insomniac office worker starts an underground fight club.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
    vote_average: 8.4,
    vote_count: 29000,
    release_date: "1999-10-15",
    original_language: "en",
    runtime: 139,
    genres: [
      { id: 18, name: "Drama" },
      { id: 53, name: "Thriller" }
    ]
  },
  {
    id: 13,
    title: "Forrest Gump",
    overview: "Forrest recounts his accidental role in pivotal historical moments.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    vote_average: 8.5,
    vote_count: 28000,
    release_date: "1994-07-06",
    original_language: "en",
    runtime: 142,
    genres: [
      { id: 35, name: "Comedy" },
      { id: 18, name: "Drama" }
    ]
  },
  {
    id: 238,
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    vote_average: 8.7,
    vote_count: 21000,
    release_date: "1972-03-14",
    original_language: "en",
    runtime: 175,
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ]
  }
];

const MOCK_TV: TmdbTvDto[] = [
  {
    id: 1399,
    name: "Game of Thrones",
    original_name: "Game of Thrones",
    overview: "Noble families fight for control of the Iron Throne in Westeros.",
    poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop_path: "/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    vote_average: 8.4,
    vote_count: 24000,
    first_air_date: "2011-04-17",
    last_air_date: "2019-05-19",
    number_of_seasons: 8,
    number_of_episodes: 73,
    networks: [{ name: "HBO" }],
    created_by: [{ name: "David Benioff" }, { name: "D. B. Weiss" }],
    original_language: "en",
    episode_run_time: [57],
    genres: [
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 18, name: "Drama" }
    ]
  },
  {
    id: 1396,
    name: "Breaking Bad",
    original_name: "Breaking Bad",
    overview: "A chemistry teacher turns to producing methamphetamine.",
    poster_path: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    vote_average: 8.9,
    vote_count: 14000,
    first_air_date: "2008-01-20",
    last_air_date: "2013-09-29",
    number_of_seasons: 5,
    number_of_episodes: 62,
    networks: [{ name: "AMC" }],
    created_by: [{ name: "Vince Gilligan" }],
    original_language: "en",
    episode_run_time: [47],
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ]
  },
  {
    id: 87108,
    name: "Chernobyl",
    original_name: "Chernobyl",
    overview: "A dramatization of the Chernobyl nuclear disaster.",
    poster_path: "/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    backdrop_path: "/8uXJ4y4dQ3sS6C0hWfB5w1QdM2A.jpg",
    vote_average: 8.7,
    vote_count: 6200,
    first_air_date: "2019-05-06",
    last_air_date: "2019-06-03",
    number_of_seasons: 1,
    number_of_episodes: 5,
    networks: [{ name: "HBO" }],
    created_by: [{ name: "Craig Mazin" }],
    original_language: "en",
    episode_run_time: [65],
    genres: [
      { id: 18, name: "Drama" }
    ]
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
  const productionCountries = (dto.production_countries ?? [])
    .map((country) => country.name ?? country.iso_3166_1 ?? "")
    .filter(Boolean);

  return {
    id: dto.id,
    mediaType: "movie",
    title: dto.title ?? "",
    originalTitle: dto.original_title ?? "",
    tagline: dto.tagline ?? "",
    overview: dto.overview ?? "",
    posterPath: buildImageUrl(dto.poster_path),
    backdropPath: buildImageUrl(dto.backdrop_path),
    rating: typeof dto.vote_average === "number" ? dto.vote_average : 0,
    popularity: typeof dto.popularity === "number" ? dto.popularity : 0,
    releaseDate: dto.release_date ?? "",
    status: dto.status ?? "",
    productionCountries,
    genres: (dto.genres ?? []).map((genre) => genre.name ?? "").filter(Boolean),
    runtime: typeof dto.runtime === "number" ? dto.runtime : 0,
    language: dto.original_language ?? "",
    voteCount: typeof dto.vote_count === "number" ? dto.vote_count : 0
  };
}

function mapTvDto(dto: TmdbTvDto): Movie {
  const productionCountries = (dto.production_countries ?? [])
    .map((country) => country.name ?? country.iso_3166_1 ?? "")
    .filter(Boolean);

  const countryFallback = (dto.origin_country ?? []).filter(Boolean);
  const rawEpisodeTimes = Array.isArray(dto.episode_run_time)
    ? dto.episode_run_time.filter((value): value is number => typeof value === "number" && value > 0)
    : [];
  const episodeRunTimes = [...new Set(rawEpisodeTimes)].sort((a, b) => a - b);
  const runtimeFromEpisode = episodeRunTimes[0] ?? 0;
  const creators = normalizeNames((dto.created_by ?? []).map((person) => person.name ?? ""));
  const networkNames = normalizeNames((dto.networks ?? []).map((network) => network.name ?? ""));

  return {
    id: dto.id,
    mediaType: "tv",
    title: dto.name ?? "",
    originalTitle: dto.original_name ?? "",
    tagline: dto.tagline ?? "",
    overview: dto.overview ?? "",
    posterPath: buildImageUrl(dto.poster_path),
    backdropPath: buildImageUrl(dto.backdrop_path),
    rating: typeof dto.vote_average === "number" ? dto.vote_average : 0,
    popularity: typeof dto.popularity === "number" ? dto.popularity : 0,
    releaseDate: dto.first_air_date ?? "",
    status: dto.status ?? "",
    productionCountries: productionCountries.length > 0 ? productionCountries : countryFallback,
    genres: (dto.genres ?? []).map((genre) => genre.name ?? "").filter(Boolean),
    runtime: typeof runtimeFromEpisode === "number" ? runtimeFromEpisode : 0,
    language: dto.original_language ?? "",
    voteCount: typeof dto.vote_count === "number" ? dto.vote_count : 0,
    creators: creators.length > 0 ? creators : undefined,
    numberOfSeasons: typeof dto.number_of_seasons === "number" ? dto.number_of_seasons : undefined,
    numberOfEpisodes: typeof dto.number_of_episodes === "number" ? dto.number_of_episodes : undefined,
    networkNames: networkNames.length > 0 ? networkNames : undefined,
    lastAirDate: dto.last_air_date?.trim() || undefined,
    episodeRunTimes: episodeRunTimes.length > 0 ? episodeRunTimes : undefined
  };
}

function getMockMovies(): Movie[] {
  return MOCK_MOVIES.map(mapMovieDto);
}

function getMockTvShows(): Movie[] {
  return MOCK_TV.map(mapTvDto);
}

function getMockGenres(): MovieGenre[] {
  return [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" }
  ];
}

function getMockCastByMediaId(id: number): CastMember[] {
  const baseCast: Record<number, CastMember[]> = {
    603: [
      { id: 1, name: "Keanu Reeves", character: "Neo", profilePath: buildImageUrl("/rRdru6REr9i3WIHv2mntpcgxnoY.jpg") },
      { id: 2, name: "Carrie-Anne Moss", character: "Trinity", profilePath: buildImageUrl("/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg") },
      { id: 3, name: "Laurence Fishburne", character: "Morpheus", profilePath: buildImageUrl("/8SuOhUmPbfKqDQ17jQ1Gy0mIvof.jpg") }
    ],
    27205: [
      { id: 4, name: "Leonardo DiCaprio", character: "Cobb", profilePath: buildImageUrl("/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg") },
      { id: 5, name: "Joseph Gordon-Levitt", character: "Arthur", profilePath: buildImageUrl("/4U9G4YwTlIEbA6wudwZ2fCRfP7a.jpg") },
      { id: 6, name: "Elliot Page", character: "Ariadne", profilePath: buildImageUrl("/g9BQx4A2dUQXbUoVhM8a1fKTf4Q.jpg") }
    ],
    1399: [
      { id: 7, name: "Emilia Clarke", character: "Daenerys Targaryen", profilePath: buildImageUrl("/86jeYCG5M6hYw4Q2j4WZ1pE5qmy.jpg") },
      { id: 8, name: "Kit Harington", character: "Jon Snow", profilePath: buildImageUrl("/qhvVweQ66Q8aJxC7F7RoYxYhA2r.jpg") },
      { id: 9, name: "Peter Dinklage", character: "Tyrion Lannister", profilePath: buildImageUrl("/rW6acN8x4fQf4JQ89G5knYVv2v7.jpg") }
    ]
  };

  return baseCast[id] ?? [];
}

function getMockCrewHighlightsByMovieId(id: number): CrewHighlights {
  const byMovieId: Record<number, CrewHighlights> = {
    603: { directors: ["Lana Wachowski", "Lilly Wachowski"], writers: ["Lana Wachowski", "Lilly Wachowski"] },
    27205: { directors: ["Christopher Nolan"], writers: ["Christopher Nolan"] },
    155: { directors: ["Christopher Nolan"], writers: ["Jonathan Nolan", "Christopher Nolan"] }
  };

  return byMovieId[id] ?? { directors: [], writers: [] };
}

function getMockWatchProvidersByMovieId(id: number): WatchProvider[] {
  const providerLogo = (path: string) => buildImageUrl(path);
  const byMovieId: Record<number, WatchProvider[]> = {
    603: [
      { id: 8, name: "Netflix", logoPath: providerLogo("/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"), category: "flatrate" },
      { id: 2, name: "Apple TV", logoPath: providerLogo("/peURlLlr8jggOwK53fJ5wdQl05y.jpg"), category: "rent" }
    ],
    27205: [
      { id: 337, name: "Disney+", logoPath: providerLogo("/7rwgEsKTfFC0rQ1HfGZ7s2nP6kG.jpg"), category: "flatrate" }
    ]
  };

  return byMovieId[id] ?? [];
}

function getMockMovieImagesById(id: number): string[] {
  const byMovieId: Record<number, string[]> = {
    603: [
      buildImageUrl("/icmmSD4vTTDKOq2vvdulafOGw93.jpg"),
      buildImageUrl("/7u3pxc0K1wx32IleAkLv78MKgrw.jpg")
    ],
    27205: [
      buildImageUrl("/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"),
      buildImageUrl("/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg")
    ]
  };

  return byMovieId[id] ?? [];
}

function getMockWatchProvidersByTvId(id: number): WatchProvider[] {
  const providerLogo = (path: string) => buildImageUrl(path);
  const byTvId: Record<number, WatchProvider[]> = {
    1399: [
      { id: 8, name: "HBO Max", logoPath: providerLogo("/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"), category: "flatrate" },
      { id: 2, name: "Apple TV", logoPath: providerLogo("/peURlLlr8jggOwK53fJ5wdQl05y.jpg"), category: "rent" }
    ],
    1396: [{ id: 8, name: "Netflix", logoPath: providerLogo("/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"), category: "flatrate" }],
    87108: [{ id: 8, name: "HBO Max", logoPath: providerLogo("/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"), category: "flatrate" }]
  };

  return byTvId[id] ?? [];
}

function getMockTvImagesById(id: number): string[] {
  const byTvId: Record<number, string[]> = {
    1399: [buildImageUrl("/suopoADq0k8YZr4dQXcU6pToj6s.jpg"), buildImageUrl("/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg")],
    1396: [buildImageUrl("/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg")],
    87108: [buildImageUrl("/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg")]
  };

  return byTvId[id] ?? [];
}

function getMockCrewHighlightsByTvId(id: number): CrewHighlights {
  const byTvId: Record<number, CrewHighlights> = {
    1399: { directors: [], writers: ["David Benioff", "D. B. Weiss", "George R. R. Martin"] },
    1396: { directors: [], writers: ["Vince Gilligan"] },
    87108: { directors: [], writers: ["Craig Mazin"] }
  };

  return byTvId[id] ?? { directors: [], writers: [] };
}

function mapCastDto(dto: TmdbCastDto): CastMember {
  return {
    id: dto.id,
    name: dto.name ?? "Sin nombre",
    character: dto.character ?? "Sin personaje",
    profilePath: buildImageUrl(dto.profile_path)
  };
}

function normalizeNames(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized.toLowerCase())) {
      return false;
    }
    seen.add(normalized.toLowerCase());
    return true;
  });
}

function mapProviderEntries(
  entries: Array<{ provider_id?: number; provider_name?: string; logo_path?: string | null }> | undefined,
  category: WatchProvider["category"]
): WatchProvider[] {
  return (entries ?? [])
    .filter((entry) => Number.isInteger(entry.provider_id))
    .map((entry) => ({
      id: entry.provider_id as number,
      name: entry.provider_name ?? "Proveedor",
      logoPath: buildImageUrl(entry.logo_path),
      category
    }));
}

function buildTheatricalListQuery(): string {
  const params = new URLSearchParams({
    language: getTmdbLanguage(),
    region: getTmdbRegion()
  });
  return `?${params.toString()}`;
}

/** Anexa `language` a toda peticion v3 para titulos, sinopsis y generos localizados (defecto es-ES via env). */
function pathWithTmdbLanguage(path: string): string {
  if (/[?&]language=/.test(path)) {
    return path;
  }
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}language=${encodeURIComponent(getTmdbLanguage())}`;
}

async function tmdbFetchJson<T>(path: string): Promise<T | null> {
  const token = getOptionalTmdbBearerToken();
  if (!token) {
    console.error("[tmdb] Missing TMDB_BEARER_TOKEN");
    return null;
  }

  const url = `${TMDB_API_BASE}${pathWithTmdbLanguage(path)}`;

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

async function enrichMoviesWithDetails(movies: Movie[], limit = RUNTIME_ENRICH_LIMIT): Promise<Movie[]> {
  const boundedLimit = Number.isInteger(limit) && limit > 0 ? limit : RUNTIME_ENRICH_LIMIT;
  const moviesToEnrich = movies.slice(0, boundedLimit);

  const enrichedSubset = await Promise.all(
    moviesToEnrich.map(async (movie) => {
      if (movie.runtime > 0 && movie.genres.length > 0) {
        return movie;
      }

      const detail = await tmdbFetchJson<TmdbMovieDto>(`/movie/${movie.id}`);
      if (!detail) {
        return movie;
      }

      const detailRuntime = typeof detail.runtime === "number" ? detail.runtime : movie.runtime;
      const detailGenres = (detail.genres ?? []).map((genre) => genre.name ?? "").filter(Boolean);

      return {
        ...movie,
        runtime: detailRuntime > 0 ? detailRuntime : movie.runtime,
        genres: detailGenres.length > 0 ? detailGenres : movie.genres
      };
    })
  );

  return [...enrichedSubset, ...movies.slice(boundedLimit)];
}

async function enrichTvWithDetails(series: Movie[], limit = RUNTIME_ENRICH_LIMIT): Promise<Movie[]> {
  const boundedLimit = Number.isInteger(limit) && limit > 0 ? limit : RUNTIME_ENRICH_LIMIT;
  const seriesToEnrich = series.slice(0, boundedLimit);

  const enrichedSubset = await Promise.all(
    seriesToEnrich.map(async (show) => {
      if (show.runtime > 0 && show.genres.length > 0) {
        return show;
      }

      const detail = await tmdbFetchJson<TmdbTvDto>(`/tv/${show.id}`);
      if (!detail) {
        return show;
      }

      const merged = mapTvDto(detail);
      return {
        ...show,
        runtime: merged.runtime > 0 ? merged.runtime : show.runtime,
        genres: merged.genres.length > 0 ? merged.genres : show.genres,
        creators: merged.creators ?? show.creators,
        numberOfSeasons: merged.numberOfSeasons ?? show.numberOfSeasons,
        numberOfEpisodes: merged.numberOfEpisodes ?? show.numberOfEpisodes,
        networkNames: merged.networkNames ?? show.networkNames,
        lastAirDate: merged.lastAirDate ?? show.lastAirDate,
        episodeRunTimes: merged.episodeRunTimes ?? show.episodeRunTimes
      };
    })
  );

  return [...enrichedSubset, ...series.slice(boundedLimit)];
}

function normalizeSimilarMovies(targetMovieId: number, movies: Movie[]): Movie[] {
  if (!Number.isFinite(targetMovieId) || targetMovieId <= 0) {
    return [];
  }

  const seen = new Set<number>();
  return movies.filter((movie) => {
    if (!movie || !Number.isFinite(movie.id) || movie.id <= 0) {
      return false;
    }
    if (movie.id === targetMovieId || seen.has(movie.id)) {
      return false;
    }
    seen.add(movie.id);
    return true;
  });
}

export async function getTrendingMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return getMockMovies().slice(0, 5);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>("/trending/movie/week");
  if (!data?.results?.length) {
    return [];
  }

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
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

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
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

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const movies = getMockMovies();
    return [movies[2], movies[0], movies[4], movies[1], movies[3]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>(`/movie/now_playing${buildTheatricalListQuery()}`);
  if (!data?.results?.length) {
    return [];
  }

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const movies = getMockMovies();
    return [movies[5], movies[1], movies[3], movies[0], movies[2]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>(`/movie/upcoming${buildTheatricalListQuery()}`);
  if (!data?.results?.length) {
    return [];
  }

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
}

export async function getTrendingTv(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return getMockTvShows();
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>("/trending/tv/week");
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  return enrichTvWithDetails(shows);
}

export async function getPopularTv(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    const tvShows = getMockTvShows();
    return [tvShows[1], tvShows[0], tvShows[2]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>("/tv/popular");
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  return enrichTvWithDetails(shows);
}

export async function getTopRatedTv(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return getMockTvShows()
      .slice()
      .sort((a, b) => b.rating - a.rating);
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>("/tv/top_rated");
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  return enrichTvWithDetails(shows);
}

export async function getOnTheAirTv(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return [getMockTvShows()[0], getMockTvShows()[2]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>("/tv/on_the_air");
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  return enrichTvWithDetails(shows);
}

export async function getAiringTodayTv(): Promise<Movie[]> {
  if (isTmdbMockMode) {
    return [getMockTvShows()[2], getMockTvShows()[1]].filter(Boolean);
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>("/tv/airing_today");
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  return enrichTvWithDetails(shows);
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

  const movies = data.results.map(mapMovieDto);
  return enrichMoviesWithDetails(movies);
}

function selectYouTubeTrailer(videos: TmdbVideoDto[]): TmdbVideoDto | null {
  if (videos.length === 0) {
    return null;
  }

  const youtubeVideos = videos.filter((video) => video.site === "YouTube" && typeof video.key === "string" && video.key.length > 0);
  if (youtubeVideos.length === 0) {
    return null;
  }

  const officialTrailer = youtubeVideos.find((video) => video.type === "Trailer" && video.official);
  if (officialTrailer) {
    return officialTrailer;
  }

  const anyTrailer = youtubeVideos.find((video) => video.type === "Trailer");
  if (anyTrailer) {
    return anyTrailer;
  }

  return youtubeVideos[0] ?? null;
}

export async function getMovieTrailerById(id: number): Promise<string | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  if (isTmdbMockMode) {
    const mockTrailerByMovieId: Record<number, string> = {
      603: "vKQi3bBA1y8",
      27205: "YoHD9XEInc0",
      155: "EXeTwQWrcwY",
      550: "qtRKdVHc-cE",
      13: "bLvqoHBptjg",
      238: "sY1S34973zA"
    };

    const trailerKey = mockTrailerByMovieId[id];
    return trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null;
  }

  const data = await tmdbFetchJson<TmdbVideoListResponse>(`/movie/${id}/videos`);
  if (!data?.results?.length) {
    return null;
  }

  const selectedTrailer = selectYouTubeTrailer(data.results);
  return selectedTrailer?.key ? `https://www.youtube.com/embed/${selectedTrailer.key}` : null;
}

export async function getTvTrailerById(id: number): Promise<string | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  if (isTmdbMockMode) {
    const mockTrailerByTvId: Record<number, string> = {
      1399: "KPLWWIOCOOQ",
      1396: "HhesaQXLuRY",
      87108: "s9APLXM9Ei8"
    };

    const trailerKey = mockTrailerByTvId[id];
    return trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : null;
  }

  const data = await tmdbFetchJson<TmdbVideoListResponse>(`/tv/${id}/videos`);
  if (!data?.results?.length) {
    return null;
  }

  const selectedTrailer = selectYouTubeTrailer(data.results);
  return selectedTrailer?.key ? `https://www.youtube.com/embed/${selectedTrailer.key}` : null;
}

export async function getMovieCastById(id: number): Promise<CastMember[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockCastByMediaId(id);
  }

  const data = await tmdbFetchJson<TmdbCreditsResponse>(`/movie/${id}/credits`);
  if (!data?.cast?.length) {
    return [];
  }

  return data.cast.map(mapCastDto);
}

export async function getTvCastById(id: number): Promise<CastMember[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockCastByMediaId(id);
  }

  const data = await tmdbFetchJson<TmdbCreditsResponse>(`/tv/${id}/credits`);
  if (!data?.cast?.length) {
    return [];
  }

  return data.cast.map(mapCastDto);
}

export async function getMovieCrewHighlightsById(id: number): Promise<CrewHighlights> {
  if (!Number.isFinite(id) || id <= 0) {
    return { directors: [], writers: [] };
  }

  if (isTmdbMockMode) {
    return getMockCrewHighlightsByMovieId(id);
  }

  const data = await tmdbFetchJson<TmdbCreditsResponse>(`/movie/${id}/credits`);
  if (!data?.crew?.length) {
    return { directors: [], writers: [] };
  }

  const directors = normalizeNames(
    data.crew.filter((member) => member.job === "Director").map((member) => member.name ?? "")
  );

  const writers = normalizeNames(
    data.crew
      .filter((member) => member.job === "Writer" || member.job === "Screenplay" || member.department === "Writing")
      .map((member) => member.name ?? "")
  );

  return { directors, writers };
}

export async function getTvCrewHighlightsById(id: number): Promise<CrewHighlights> {
  if (!Number.isFinite(id) || id <= 0) {
    return { directors: [], writers: [] };
  }

  if (isTmdbMockMode) {
    return getMockCrewHighlightsByTvId(id);
  }

  const data = await tmdbFetchJson<TmdbCreditsResponse>(`/tv/${id}/credits`);
  if (!data?.crew?.length) {
    return { directors: [], writers: [] };
  }

  const writers = normalizeNames(
    data.crew
      .filter((member) => member.job === "Writer" || member.job === "Screenplay" || member.department === "Writing")
      .map((member) => member.name ?? "")
  );

  return { directors: [], writers };
}

export async function getMovieWatchProvidersById(id: number, region = "US"): Promise<WatchProvider[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockWatchProvidersByMovieId(id);
  }

  const normalizedRegion = region.trim().toUpperCase() || "US";
  const data = await tmdbFetchJson<TmdbWatchProvidersResponse>(`/movie/${id}/watch/providers`);
  const regionData = data?.results?.[normalizedRegion] ?? data?.results?.US;
  if (!regionData) {
    return [];
  }

  const providers = [
    ...mapProviderEntries(regionData.flatrate, "flatrate"),
    ...mapProviderEntries(regionData.rent, "rent"),
    ...mapProviderEntries(regionData.buy, "buy")
  ];

  const seen = new Set<string>();
  return providers.filter((provider) => {
    const key = `${provider.id}-${provider.category}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function getMovieImagesById(id: number): Promise<string[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockMovieImagesById(id);
  }

  const data = await tmdbFetchJson<TmdbImagesResponse>(`/movie/${id}/images`);
  if (!data?.backdrops?.length) {
    return [];
  }

  return data.backdrops
    .map((image) => buildImageUrl(image.file_path))
    .filter(Boolean)
    .slice(0, 12);
}

export async function getSimilarMoviesById(id: number): Promise<Movie[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    const mockSimilar = getMockMovies()
      .filter((movie) => movie.id !== id)
      .slice(0, 5);
    return normalizeSimilarMovies(id, mockSimilar);
  }

  const data = await tmdbFetchJson<TmdbMovieListResponse>(`/movie/${id}/similar`);
  if (!data?.results?.length) {
    return [];
  }

  const movies = data.results.map(mapMovieDto);
  const enrichedMovies = await enrichMoviesWithDetails(movies);
  return normalizeSimilarMovies(id, enrichedMovies);
}

export async function getTvWatchProvidersById(id: number, region = "US"): Promise<WatchProvider[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockWatchProvidersByTvId(id);
  }

  const normalizedRegion = region.trim().toUpperCase() || "US";
  const data = await tmdbFetchJson<TmdbWatchProvidersResponse>(`/tv/${id}/watch/providers`);
  const regionData = data?.results?.[normalizedRegion] ?? data?.results?.US;
  if (!regionData) {
    return [];
  }

  const providers = [
    ...mapProviderEntries(regionData.flatrate, "flatrate"),
    ...mapProviderEntries(regionData.rent, "rent"),
    ...mapProviderEntries(regionData.buy, "buy")
  ];

  const seen = new Set<string>();
  return providers.filter((provider) => {
    const key = `${provider.id}-${provider.category}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function getTvImagesById(id: number): Promise<string[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    return getMockTvImagesById(id);
  }

  const data = await tmdbFetchJson<TmdbImagesResponse>(`/tv/${id}/images`);
  if (!data?.backdrops?.length) {
    return [];
  }

  return data.backdrops
    .map((image) => buildImageUrl(image.file_path))
    .filter(Boolean)
    .slice(0, 12);
}

export async function getSimilarTvById(id: number): Promise<Movie[]> {
  if (!Number.isFinite(id) || id <= 0) {
    return [];
  }

  if (isTmdbMockMode) {
    const mockSimilar = getMockTvShows()
      .filter((show) => show.id !== id)
      .slice(0, 5);
    return normalizeSimilarMovies(id, mockSimilar);
  }

  const data = await tmdbFetchJson<TmdbTvListResponse>(`/tv/${id}/similar`);
  if (!data?.results?.length) {
    return [];
  }

  const shows = data.results.map(mapTvDto);
  const enrichedShows = await enrichTvWithDetails(shows);
  return normalizeSimilarMovies(id, enrichedShows);
}

const MOCK_SEARCH_PAGE_SIZE = 2;

function mockSearchMovieHits(trimmed: string): Movie[] {
  const queryLower = trimmed.toLowerCase();
  return getMockMovies().filter((movie) => movie.title.toLowerCase().includes(queryLower));
}

function mockSearchTvHits(trimmed: string): Movie[] {
  const queryLower = trimmed.toLowerCase();
  return getMockTvShows().filter(
    (show) =>
      show.title.toLowerCase().includes(queryLower) ||
      (show.originalTitle ?? "").toLowerCase().includes(queryLower)
  );
}

function mockSearchMultiHits(trimmed: string): Movie[] {
  const movies = mockSearchMovieHits(trimmed);
  const tvs = mockSearchTvHits(trimmed);
  return [...movies, ...tvs].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
}

function paginateMockSearchResults(allResults: Movie[], normalizedPage: number): SearchResult {
  const pageSize = MOCK_SEARCH_PAGE_SIZE;
  const start = (normalizedPage - 1) * pageSize;
  const results = allResults.slice(start, start + pageSize);
  const totalPages = allResults.length === 0 ? 0 : Math.ceil(allResults.length / pageSize);
  return {
    results,
    totalResults: allResults.length,
    currentPage: normalizedPage,
    totalPages
  };
}

async function fetchSearchMoviesFromApi(trimmed: string, normalizedPage: number): Promise<SearchResult> {
  const path = `/search/movie?${new URLSearchParams({
    query: trimmed,
    page: String(normalizedPage)
  }).toString()}`;
  const data = await tmdbFetchJson<TmdbSearchResponse>(path);

  if (!data) {
    return { results: [], totalResults: 0, currentPage: normalizedPage, totalPages: 0 };
  }

  const rawResults = (data.results ?? []).map(mapMovieDto);
  const results = await enrichMoviesWithDetails(rawResults, 6);
  return {
    results,
    totalResults: data.total_results ?? results.length,
    currentPage: data.page ?? normalizedPage,
    totalPages: data.total_pages ?? 0
  };
}

async function fetchSearchTvFromApi(trimmed: string, normalizedPage: number): Promise<SearchResult> {
  const path = `/search/tv?${new URLSearchParams({
    query: trimmed,
    page: String(normalizedPage)
  }).toString()}`;
  const data = await tmdbFetchJson<TmdbTvSearchResponse>(path);

  if (!data) {
    return { results: [], totalResults: 0, currentPage: normalizedPage, totalPages: 0 };
  }

  const rawResults = (data.results ?? []).map(mapTvDto);
  const results = await enrichTvWithDetails(rawResults, 6);
  return {
    results,
    totalResults: data.total_results ?? results.length,
    currentPage: data.page ?? normalizedPage,
    totalPages: data.total_pages ?? 0
  };
}

async function fetchSearchMultiFromApi(trimmed: string, normalizedPage: number): Promise<SearchResult> {
  const path = `/search/multi?${new URLSearchParams({
    query: trimmed,
    page: String(normalizedPage)
  }).toString()}`;
  const data = await tmdbFetchJson<TmdbMultiSearchResponse>(path);

  if (!data) {
    return { results: [], totalResults: 0, currentPage: normalizedPage, totalPages: 0 };
  }

  const records = data.results ?? [];
  const movies: Movie[] = [];
  const tvs: Movie[] = [];
  const order: Array<{ kind: "movie" | "tv"; index: number }> = [];

  for (const raw of records) {
    const mt = raw.media_type;
    if (mt === "movie") {
      order.push({ kind: "movie", index: movies.length });
      movies.push(mapMovieDto(raw as TmdbMovieDto));
    } else if (mt === "tv") {
      order.push({ kind: "tv", index: tvs.length });
      tvs.push(mapTvDto(raw as TmdbTvDto));
    }
  }

  const enrichedMovies = await enrichMoviesWithDetails(movies, 6);
  const enrichedTvs = await enrichTvWithDetails(tvs, 6);
  const byKind = { movie: enrichedMovies, tv: enrichedTvs };
  const results = order.map((o) => byKind[o.kind][o.index]);
  results.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

  return {
    results,
    totalResults: data.total_results ?? results.length,
    currentPage: data.page ?? normalizedPage,
    totalPages: data.total_pages ?? 0
  };
}

export async function searchMedia(query: string, page = 1, options?: SearchMediaOptions): Promise<SearchResult> {
  const trimmed = query.trim();
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const kind: SearchMediaKind = options?.kind ?? "all";
  const year = options?.year;
  const minVote = options?.minVote;

  if (!trimmed) {
    return { results: [], totalResults: 0, currentPage: 1, totalPages: 0 };
  }

  let base: SearchResult;

  if (isTmdbMockMode) {
    if (kind === "movie") {
      base = paginateMockSearchResults(mockSearchMovieHits(trimmed), normalizedPage);
    } else if (kind === "tv") {
      base = paginateMockSearchResults(mockSearchTvHits(trimmed), normalizedPage);
    } else {
      base = paginateMockSearchResults(mockSearchMultiHits(trimmed), normalizedPage);
    }
  } else if (kind === "movie") {
    base = await fetchSearchMoviesFromApi(trimmed, normalizedPage);
  } else if (kind === "tv") {
    base = await fetchSearchTvFromApi(trimmed, normalizedPage);
  } else {
    base = await fetchSearchMultiFromApi(trimmed, normalizedPage);
  }

  const refined = filterSearchResults(base.results, { year, minVote });
  return {
    ...base,
    results: refined
  };
}

export async function searchMovies(query: string, page = 1): Promise<SearchResult> {
  return searchMedia(query, page, { kind: "movie" });
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

export async function getTvById(id: number): Promise<Movie | null> {
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  if (isTmdbMockMode) {
    return getMockTvShows().find((show) => show.id === id) ?? null;
  }

  const data = await tmdbFetchJson<TmdbTvDto>(`/tv/${id}`);
  if (!data) {
    return null;
  }

  return mapTvDto(data);
}
