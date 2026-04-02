import type { Movie } from "@/types/movie";
import {
  getAiringTodayTv,
  getMovieById,
  getMovieGenres,
  getMovieTrailerById,
  getMoviesByGenre,
  getNowPlayingMovies,
  getOnTheAirTv,
  getPopularMovies,
  getPopularTv,
  getTopRatedMovies,
  getTopRatedTv,
  getTrendingMovies,
  getTrendingTv,
  getTvById,
  getTvTrailerById,
  getUpcomingMovies,
  type MovieGenre
} from "@/lib/tmdb";

export type HomeGenreSection = {
  genre: MovieGenre;
  movies: Movie[];
};

export type HomeData = {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
  trendingTv: Movie[];
  popularTv: Movie[];
  topRatedTv: Movie[];
  onTheAirTv: Movie[];
  airingTodayTv: Movie[];
  genreSections: HomeGenreSection[];
  featuredMovie: Movie | null;
  featuredTrailerUrl: string | null;
  hasError: boolean;
};

export type HomeRowSection = {
  key: string;
  title: string;
  movies: Movie[];
  emptyMessage: string;
};

const DEFAULT_HOME_GENRES: MovieGenre[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" }
];
const PRIORITY_GENRE_IDS = [28, 35];
const HOME_LOG_PREFIX = "[home]";

function getSettledValue<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

async function runTimedSection<T>(label: string, task: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();
  try {
    const result = await task();
    const elapsedMs = Date.now() - startedAt;
    console.info(`${HOME_LOG_PREFIX} ${label} completed in ${elapsedMs}ms`);
    return result;
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    console.error(`${HOME_LOG_PREFIX} ${label} failed in ${elapsedMs}ms`, error);
    throw error;
  }
}

function dedupeGenresById(genres: MovieGenre[]): MovieGenre[] {
  const seenIds = new Set<number>();
  const uniqueGenres: MovieGenre[] = [];
  for (const genre of genres) {
    if (seenIds.has(genre.id)) {
      continue;
    }
    seenIds.add(genre.id);
    uniqueGenres.push(genre);
  }
  return uniqueGenres;
}

function pickHomeGenres(allGenres: MovieGenre[]): MovieGenre[] {
  const uniqueGenres = dedupeGenresById(allGenres);
  if (uniqueGenres.length === 0) {
    return DEFAULT_HOME_GENRES;
  }

  const preferred = PRIORITY_GENRE_IDS
    .map((genreId) => uniqueGenres.find((genre) => genre.id === genreId))
    .filter((genre): genre is MovieGenre => Boolean(genre));

  const fallbackPool = uniqueGenres
    .filter((genre) => !preferred.some((item) => item.id === genre.id))
    .sort((a, b) => a.id - b.id);
  const fallback = [...preferred, ...fallbackPool];
  return fallback.slice(0, 2);
}

function shouldFetchFeaturedDetail(movie: Movie): boolean {
  return movie.runtime <= 0 || movie.genres.length === 0 || !movie.tagline;
}

function getMediaDetailFetcher(movie: Movie) {
  return movie.mediaType === "tv" ? getTvById : getMovieById;
}

function getMediaTrailerFetcher(movie: Movie) {
  return movie.mediaType === "tv" ? getTvTrailerById : getMovieTrailerById;
}

function getMediaKey(movie: Movie): string {
  return `${movie.mediaType ?? "movie"}-${movie.id}`;
}

function dedupeMedia(items: Movie[]): Movie[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getMediaKey(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function calculateMediaScore(item: Movie): number {
  const ratingScore = Number.isFinite(item.rating) ? item.rating : 0;
  const popularityBase = typeof item.popularity === "number" ? item.popularity : 0;
  const popularityScore = Math.min(popularityBase, 200) / 200;
  const releaseYear = Number(item.releaseDate?.slice(0, 4));
  const currentYear = new Date().getFullYear();
  const yearDistance = Number.isFinite(releaseYear) ? Math.max(0, currentYear - releaseYear) : 20;
  const recencyScore = Math.max(0, 1 - yearDistance / 15);
  const backdropBonus = item.backdropPath ? 0.4 : 0;
  const overviewBonus = item.overview ? 0.25 : 0;
  return ratingScore * 0.45 + popularityScore * 3 + recencyScore * 2 + backdropBonus + overviewBonus;
}

function selectFeaturedCandidate(candidates: Movie[]): Movie | null {
  const uniqueCandidates = dedupeMedia(candidates);
  if (uniqueCandidates.length === 0) {
    return null;
  }

  const sorted = uniqueCandidates.slice().sort((a, b) => {
    const scoreDiff = calculateMediaScore(b) - calculateMediaScore(a);
    if (Math.abs(scoreDiff) > 0.001) {
      return scoreDiff;
    }
    return a.id - b.id;
  });

  return sorted[0] ?? null;
}

export async function getHomeData(): Promise<HomeData> {
  const baseResults = await Promise.allSettled([
    runTimedSection("trending", () => getTrendingMovies()),
    runTimedSection("popular", () => getPopularMovies()),
    runTimedSection("top-rated", () => getTopRatedMovies()),
    runTimedSection("now-playing", () => getNowPlayingMovies()),
    runTimedSection("upcoming", () => getUpcomingMovies()),
    runTimedSection("trending-tv", () => getTrendingTv()),
    runTimedSection("popular-tv", () => getPopularTv()),
    runTimedSection("top-rated-tv", () => getTopRatedTv()),
    runTimedSection("on-the-air-tv", () => getOnTheAirTv()),
    runTimedSection("airing-today-tv", () => getAiringTodayTv()),
    runTimedSection("genres", () => getMovieGenres())
  ]);

  const baseLabels = [
    "trending",
    "popular",
    "top-rated",
    "now-playing",
    "upcoming",
    "trending-tv",
    "popular-tv",
    "top-rated-tv",
    "on-the-air-tv",
    "airing-today-tv",
    "genres"
  ];
  baseResults.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`${HOME_LOG_PREFIX} dataset "${baseLabels[index]}" unavailable`);
    }
  });

  const trending = getSettledValue(baseResults[0], [] as Movie[]);
  const popular = getSettledValue(baseResults[1], [] as Movie[]);
  const topRated = getSettledValue(baseResults[2], [] as Movie[]);
  const nowPlaying = getSettledValue(baseResults[3], [] as Movie[]);
  const upcoming = getSettledValue(baseResults[4], [] as Movie[]);
  const trendingTv = getSettledValue(baseResults[5], [] as Movie[]);
  const popularTv = getSettledValue(baseResults[6], [] as Movie[]);
  const topRatedTv = getSettledValue(baseResults[7], [] as Movie[]);
  const onTheAirTv = getSettledValue(baseResults[8], [] as Movie[]);
  const airingTodayTv = getSettledValue(baseResults[9], [] as Movie[]);
  const allGenres = getSettledValue(baseResults[10], [] as MovieGenre[]);

  const selectedGenres = pickHomeGenres(allGenres);
  const genreSectionResults = await Promise.allSettled(
    selectedGenres.map(async (genre) => ({
      genre,
      movies: await runTimedSection(`genre-${genre.id}`, () => getMoviesByGenre(genre.id))
    }))
  );

  const genreSections = genreSectionResults
    .filter((result): result is PromiseFulfilledResult<HomeGenreSection> => result.status === "fulfilled")
    .map((result) => result.value);

  const featuredMovieCandidate = selectFeaturedCandidate([
    ...trending.slice(0, 8),
    ...trendingTv.slice(0, 8),
    ...popular.slice(0, 6),
    ...popularTv.slice(0, 6),
    ...topRated.slice(0, 4),
    ...topRatedTv.slice(0, 4),
    ...nowPlaying.slice(0, 3),
    ...onTheAirTv.slice(0, 3),
    ...upcoming.slice(0, 2),
    ...airingTodayTv.slice(0, 2)
  ]);
  let featuredMovie: Movie | null = featuredMovieCandidate;
  let featuredTrailerUrl: string | null = null;
  let featuredHasError = false;

  if (featuredMovieCandidate) {
    const detailFetcher = getMediaDetailFetcher(featuredMovieCandidate);
    const trailerFetcher = getMediaTrailerFetcher(featuredMovieCandidate);
    const featuredDetailPromise = shouldFetchFeaturedDetail(featuredMovieCandidate)
      ? runTimedSection("featured-detail", () => detailFetcher(featuredMovieCandidate.id))
      : Promise.resolve(featuredMovieCandidate);
    const trailerPromise = runTimedSection("featured-trailer", () => trailerFetcher(featuredMovieCandidate.id));

    const [featuredDetailResult, trailerResult] = await Promise.allSettled([featuredDetailPromise, trailerPromise]);

    if (featuredDetailResult.status === "fulfilled") {
      featuredMovie = featuredDetailResult.value ?? featuredMovieCandidate;
    } else {
      featuredHasError = true;
    }

    if (trailerResult.status === "fulfilled") {
      featuredTrailerUrl = trailerResult.value;
    } else {
      featuredHasError = true;
    }
  }

  const baseHasError = baseResults.some((result) => result.status === "rejected");
  const genreHasError = genreSectionResults.some((result) => result.status === "rejected");

  return {
    trending,
    popular,
    topRated,
    nowPlaying,
    upcoming,
    trendingTv,
    popularTv,
    topRatedTv,
    onTheAirTv,
    airingTodayTv,
    genreSections,
    featuredMovie,
    featuredTrailerUrl,
    hasError: baseHasError || genreHasError || featuredHasError
  };
}

export function buildHomeRowSections(data: HomeData): HomeRowSection[] {
  const genreSections = data.genreSections.map(({ genre, movies }) => ({
    key: `genre-${genre.id}`,
    title: `Genero: ${genre.name}`,
    movies: dedupeMedia(movies),
    emptyMessage: `No hay peliculas para el genero ${genre.name} en este momento.`
  }));

  const candidateSections: HomeRowSection[] = [
    {
      key: "trending-movies",
      title: "Tendencias de peliculas",
      movies: dedupeMedia(data.trending),
      emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
    },
    {
      key: "trending-tv",
      title: "Series en tendencia",
      movies: dedupeMedia(data.trendingTv),
      emptyMessage: "No hay series en tendencia para mostrar por ahora."
    },
    {
      key: "popular-movies",
      title: "Peliculas populares",
      movies: dedupeMedia(data.popular),
      emptyMessage: "No se encontraron peliculas populares en este momento."
    },
    {
      key: "popular-tv",
      title: "Series populares",
      movies: dedupeMedia(data.popularTv),
      emptyMessage: "No se encontraron series populares en este momento."
    },
    {
      key: "top-rated-movies",
      title: "Peliculas mejor valoradas",
      movies: dedupeMedia(data.topRated),
      emptyMessage: "No hay peliculas mejor valoradas para mostrar."
    },
    {
      key: "top-rated-tv",
      title: "Series mejor valoradas",
      movies: dedupeMedia(data.topRatedTv),
      emptyMessage: "No hay series mejor valoradas para mostrar."
    },
    {
      key: "now-playing",
      title: "En cartelera",
      movies: dedupeMedia(data.nowPlaying),
      emptyMessage: "No hay peliculas en cartelera disponibles en este momento."
    },
    {
      key: "airing-today-tv",
      title: "Series emitiendo hoy",
      movies: dedupeMedia(data.airingTodayTv),
      emptyMessage: "No hay episodios en emision para hoy."
    },
    {
      key: "upcoming",
      title: "Proximamente",
      movies: dedupeMedia(data.upcoming),
      emptyMessage: "No hay proximos lanzamientos para mostrar."
    },
    {
      key: "on-the-air-tv",
      title: "Series en emision",
      movies: dedupeMedia(data.onTheAirTv),
      emptyMessage: "No hay series en emision disponibles en este momento."
    },
    ...genreSections
  ];

  const globalSeen = new Set<string>();
  if (data.featuredMovie) {
    globalSeen.add(getMediaKey(data.featuredMovie));
  }

  return candidateSections.map((section) => {
    const sectionMovies = section.movies.filter((movie) => {
      const key = getMediaKey(movie);
      if (globalSeen.has(key)) {
        return false;
      }
      globalSeen.add(key);
      return true;
    });
    return {
      ...section,
      movies: sectionMovies
    };
  });
}

export function selectHomeStripMovies(data: HomeData): Movie[] {
  const stripCandidates = dedupeMedia([
    data.popular[0],
    data.popularTv[0],
    data.topRated[0],
    data.topRatedTv[0],
    data.nowPlaying[0],
    data.airingTodayTv[0],
    data.upcoming[0],
    data.onTheAirTv[0],
    data.trending[1],
    data.trendingTv[1]
  ].filter((movie): movie is Movie => Boolean(movie))).filter(
    (movie) => getMediaKey(movie) !== (data.featuredMovie ? getMediaKey(data.featuredMovie) : "")
  );

  const seenKeys = new Set<string>();
  return stripCandidates.filter((movie) => {
    const key = getMediaKey(movie);
    if (seenKeys.has(key)) {
      return false;
    }
    seenKeys.add(key);
    return true;
  });
}
