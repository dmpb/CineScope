import type { Movie } from "@/types/movie";
import { cache } from "react";
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

export type FeaturedSlide = {
  movie: Movie;
  trailerUrl: string | null;
};

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
  featuredSlides: FeaturedSlide[];
  hasError: boolean;
};

export type MoviesPageData = {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
  genreSections: HomeGenreSection[];
  featuredSlides: FeaturedSlide[];
  hasError: boolean;
};

export type SeriesPageData = {
  trendingTv: Movie[];
  popularTv: Movie[];
  topRatedTv: Movie[];
  onTheAirTv: Movie[];
  airingTodayTv: Movie[];
  featuredSlides: FeaturedSlide[];
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
const FEATURED_CAROUSEL_MAX = 5;

const getMovieByIdCached = cache(async (id: number) => getMovieById(id));
const getTvByIdCached = cache(async (id: number) => getTvById(id));
const getMovieTrailerByIdCached = cache(async (id: number) => getMovieTrailerById(id));
const getTvTrailerByIdCached = cache(async (id: number) => getTvTrailerById(id));

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
  return movie.mediaType === "tv" ? getTvByIdCached : getMovieByIdCached;
}

function getMediaTrailerFetcher(movie: Movie) {
  return movie.mediaType === "tv" ? getTvTrailerByIdCached : getMovieTrailerByIdCached;
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

function selectFeaturedCandidates(candidates: Movie[], max: number): Movie[] {
  const uniqueCandidates = dedupeMedia(candidates);
  if (uniqueCandidates.length === 0 || max <= 0) {
    return [];
  }

  const sorted = uniqueCandidates.slice().sort((a, b) => {
    const scoreDiff = calculateMediaScore(b) - calculateMediaScore(a);
    if (Math.abs(scoreDiff) > 0.001) {
      return scoreDiff;
    }
    return a.id - b.id;
  });

  return sorted.slice(0, max);
}

async function resolveFeaturedSlide(movie: Movie, index: number): Promise<{ slide: FeaturedSlide | null; hasError: boolean }> {
  const detailFetcher = getMediaDetailFetcher(movie);
  const trailerFetcher = getMediaTrailerFetcher(movie);
  let featured = movie;
  let trailerUrl: string | null = null;
  let hasError = false;

  const detailPromise = shouldFetchFeaturedDetail(movie)
    ? runTimedSection(`featured-slide-${index}-detail`, () => detailFetcher(movie.id))
    : Promise.resolve(movie);
  const trailerPromise = runTimedSection(`featured-slide-${index}-trailer`, () => trailerFetcher(movie.id));

  const [detailResult, trailerResult] = await Promise.allSettled([detailPromise, trailerPromise]);

  if (detailResult.status === "fulfilled") {
    featured = detailResult.value ?? movie;
  } else {
    hasError = true;
  }

  if (trailerResult.status === "fulfilled") {
    trailerUrl = trailerResult.value;
  } else {
    hasError = true;
  }

  if (!featured) {
    return { slide: null, hasError };
  }

  return { slide: { movie: featured, trailerUrl }, hasError };
}

async function resolveFeaturedSlidesFromCandidates(candidates: Movie[]): Promise<{ slides: FeaturedSlide[]; hasError: boolean }> {
  if (candidates.length === 0) {
    return { slides: [], hasError: false };
  }

  const results = await Promise.all(candidates.map((movie, index) => resolveFeaturedSlide(movie, index)));
  const slides = results.map((r) => r.slide).filter((s): s is FeaturedSlide => Boolean(s));
  const hasError = results.some((r) => r.hasError);
  return { slides, hasError };
}

async function selectAndResolveFeaturedSlides(candidates: Movie[]): Promise<{ slides: FeaturedSlide[]; hasError: boolean }> {
  const featuredCandidates = selectFeaturedCandidates(candidates, FEATURED_CAROUSEL_MAX);
  return resolveFeaturedSlidesFromCandidates(featuredCandidates);
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

  const featured = await selectAndResolveFeaturedSlides([
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
  const featuredSlides = featured.slides;
  const featuredHasError = featured.hasError;

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
    featuredSlides,
    hasError: baseHasError || genreHasError || featuredHasError
  };
}

export async function getMoviesPageData(): Promise<MoviesPageData> {
  const baseResults = await Promise.allSettled([
    runTimedSection("movies-trending", () => getTrendingMovies()),
    runTimedSection("movies-popular", () => getPopularMovies()),
    runTimedSection("movies-top-rated", () => getTopRatedMovies()),
    runTimedSection("movies-now-playing", () => getNowPlayingMovies()),
    runTimedSection("movies-upcoming", () => getUpcomingMovies()),
    runTimedSection("movies-genres", () => getMovieGenres())
  ]);

  const trending = getSettledValue(baseResults[0], [] as Movie[]);
  const popular = getSettledValue(baseResults[1], [] as Movie[]);
  const topRated = getSettledValue(baseResults[2], [] as Movie[]);
  const nowPlaying = getSettledValue(baseResults[3], [] as Movie[]);
  const upcoming = getSettledValue(baseResults[4], [] as Movie[]);
  const allGenres = getSettledValue(baseResults[5], [] as MovieGenre[]);

  const selectedGenres = pickHomeGenres(allGenres);
  const genreSectionResults = await Promise.allSettled(
    selectedGenres.map(async (genre) => ({
      genre,
      movies: await runTimedSection(`movies-genre-${genre.id}`, () => getMoviesByGenre(genre.id))
    }))
  );
  const genreSections = genreSectionResults
    .filter((result): result is PromiseFulfilledResult<HomeGenreSection> => result.status === "fulfilled")
    .map((result) => result.value);

  const featured = await selectAndResolveFeaturedSlides([
    ...trending.slice(0, 8),
    ...popular.slice(0, 6),
    ...topRated.slice(0, 4),
    ...nowPlaying.slice(0, 3),
    ...upcoming.slice(0, 2)
  ]);

  return {
    trending,
    popular,
    topRated,
    nowPlaying,
    upcoming,
    genreSections,
    featuredSlides: featured.slides,
    hasError: baseResults.some((result) => result.status === "rejected") || genreSectionResults.some((result) => result.status === "rejected") || featured.hasError
  };
}

export async function getSeriesPageData(): Promise<SeriesPageData> {
  const baseResults = await Promise.allSettled([
    runTimedSection("series-trending", () => getTrendingTv()),
    runTimedSection("series-popular", () => getPopularTv()),
    runTimedSection("series-top-rated", () => getTopRatedTv()),
    runTimedSection("series-on-the-air", () => getOnTheAirTv()),
    runTimedSection("series-airing-today", () => getAiringTodayTv())
  ]);

  const trendingTv = getSettledValue(baseResults[0], [] as Movie[]);
  const popularTv = getSettledValue(baseResults[1], [] as Movie[]);
  const topRatedTv = getSettledValue(baseResults[2], [] as Movie[]);
  const onTheAirTv = getSettledValue(baseResults[3], [] as Movie[]);
  const airingTodayTv = getSettledValue(baseResults[4], [] as Movie[]);

  const featured = await selectAndResolveFeaturedSlides([
    ...trendingTv.slice(0, 8),
    ...popularTv.slice(0, 6),
    ...topRatedTv.slice(0, 4),
    ...onTheAirTv.slice(0, 3),
    ...airingTodayTv.slice(0, 2)
  ]);

  return {
    trendingTv,
    popularTv,
    topRatedTv,
    onTheAirTv,
    airingTodayTv,
    featuredSlides: featured.slides,
    hasError: baseResults.some((result) => result.status === "rejected") || featured.hasError
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

  return candidateSections;
}

/** Listas de /movies: una fila por endpoint TMDb, sin quitar titulos por solaparse entre secciones. */
export function buildMoviesRowSections(data: MoviesPageData): HomeRowSection[] {
  return [
    {
      key: "trending-movies",
      title: "Tendencias de peliculas",
      movies: dedupeMedia(data.trending),
      emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
    },
    {
      key: "popular-movies",
      title: "Peliculas populares",
      movies: dedupeMedia(data.popular),
      emptyMessage: "No se encontraron peliculas populares en este momento."
    },
    {
      key: "top-rated-movies",
      title: "Peliculas mejor valoradas",
      movies: dedupeMedia(data.topRated),
      emptyMessage: "No hay peliculas mejor valoradas para mostrar."
    },
    {
      key: "now-playing",
      title: "En cartelera",
      movies: dedupeMedia(data.nowPlaying),
      emptyMessage: "No hay peliculas en cartelera disponibles en este momento."
    },
    {
      key: "upcoming",
      title: "Proximamente",
      movies: dedupeMedia(data.upcoming),
      emptyMessage: "No hay proximos lanzamientos para mostrar."
    },
    ...data.genreSections.map(({ genre, movies }) => ({
      key: `genre-${genre.id}`,
      title: `Genero: ${genre.name}`,
      movies: dedupeMedia(movies),
      emptyMessage: `No hay peliculas para el genero ${genre.name} en este momento.`
    }))
  ];
}

export function buildSeriesRowSections(data: SeriesPageData): HomeRowSection[] {
  const candidateSections: HomeRowSection[] = [
    {
      key: "trending-tv",
      title: "Series en tendencia",
      movies: dedupeMedia(data.trendingTv),
      emptyMessage: "No hay series en tendencia para mostrar por ahora."
    },
    {
      key: "popular-tv",
      title: "Series populares",
      movies: dedupeMedia(data.popularTv),
      emptyMessage: "No se encontraron series populares en este momento."
    },
    {
      key: "top-rated-tv",
      title: "Series mejor valoradas",
      movies: dedupeMedia(data.topRatedTv),
      emptyMessage: "No hay series mejor valoradas para mostrar."
    },
    {
      key: "airing-today-tv",
      title: "Series emitiendo hoy",
      movies: dedupeMedia(data.airingTodayTv),
      emptyMessage: "No hay episodios en emision para hoy."
    },
    {
      key: "on-the-air-tv",
      title: "Series en emision",
      movies: dedupeMedia(data.onTheAirTv),
      emptyMessage: "No hay series en emision disponibles en este momento."
    }
  ];

  return candidateSections;
}

export function selectHomeStripMovies(data: HomeData): Movie[] {
  const featuredKeys = new Set(data.featuredSlides.map((slide) => getMediaKey(slide.movie)));
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
  ].filter((movie): movie is Movie => Boolean(movie))).filter((movie) => !featuredKeys.has(getMediaKey(movie)));

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

export function selectMoviesStripMovies(data: MoviesPageData): Movie[] {
  const featuredKeys = new Set(data.featuredSlides.map((slide) => getMediaKey(slide.movie)));
  return dedupeMedia(
    [data.popular[0], data.topRated[0], data.nowPlaying[0], data.upcoming[0], data.trending[1]].filter((movie): movie is Movie => Boolean(movie))
  ).filter((movie) => !featuredKeys.has(getMediaKey(movie)));
}

export function selectSeriesStripMovies(data: SeriesPageData): Movie[] {
  const featuredKeys = new Set(data.featuredSlides.map((slide) => getMediaKey(slide.movie)));
  return dedupeMedia(
    [data.popularTv[0], data.topRatedTv[0], data.airingTodayTv[0], data.onTheAirTv[0], data.trendingTv[1]].filter((movie): movie is Movie => Boolean(movie))
  ).filter((movie) => !featuredKeys.has(getMediaKey(movie)));
}
