import type { Movie } from "@/types/movie";
import {
  getMovieById,
  getMovieGenres,
  getMovieTrailerById,
  getMoviesByGenre,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
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

export async function getHomeData(): Promise<HomeData> {
  const baseResults = await Promise.allSettled([
    runTimedSection("trending", () => getTrendingMovies()),
    runTimedSection("popular", () => getPopularMovies()),
    runTimedSection("top-rated", () => getTopRatedMovies()),
    runTimedSection("now-playing", () => getNowPlayingMovies()),
    runTimedSection("upcoming", () => getUpcomingMovies()),
    runTimedSection("genres", () => getMovieGenres())
  ]);

  const baseLabels = ["trending", "popular", "top-rated", "now-playing", "upcoming", "genres"];
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
  const allGenres = getSettledValue(baseResults[5], [] as MovieGenre[]);

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

  const featuredMovieCandidate = trending[0] ?? popular[0] ?? topRated[0] ?? nowPlaying[0] ?? upcoming[0] ?? null;
  let featuredMovie: Movie | null = featuredMovieCandidate;
  let featuredTrailerUrl: string | null = null;
  let featuredHasError = false;

  if (featuredMovieCandidate) {
    const featuredDetailPromise = shouldFetchFeaturedDetail(featuredMovieCandidate)
      ? runTimedSection("featured-detail", () => getMovieById(featuredMovieCandidate.id))
      : Promise.resolve(featuredMovieCandidate);
    const trailerPromise = runTimedSection("featured-trailer", () => getMovieTrailerById(featuredMovieCandidate.id));

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
    genreSections,
    featuredMovie,
    featuredTrailerUrl,
    hasError: baseHasError || genreHasError || featuredHasError
  };
}

export function buildHomeRowSections(data: HomeData): HomeRowSection[] {
  return [
    {
      key: "trending",
      title: "Tendencias de la semana",
      movies: data.trending,
      emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
    },
    {
      key: "popular",
      title: "Populares",
      movies: data.popular,
      emptyMessage: "No se encontraron peliculas populares en este momento."
    },
    {
      key: "top-rated",
      title: "Mejor valoradas",
      movies: data.topRated,
      emptyMessage: "No hay peliculas mejor valoradas para mostrar."
    },
    {
      key: "now-playing",
      title: "En cartelera",
      movies: data.nowPlaying,
      emptyMessage: "No hay peliculas en cartelera disponibles en este momento."
    },
    {
      key: "upcoming",
      title: "Proximamente",
      movies: data.upcoming,
      emptyMessage: "No hay proximos lanzamientos para mostrar."
    },
    ...data.genreSections.map(({ genre, movies }) => ({
      key: `genre-${genre.id}`,
      title: `Genero: ${genre.name}`,
      movies,
      emptyMessage: `No hay peliculas para el genero ${genre.name} en este momento.`
    }))
  ];
}

export function selectHomeStripMovies(data: HomeData): Movie[] {
  const stripCandidates = [data.popular[0], data.topRated[0], data.nowPlaying[0], data.upcoming[0], data.trending[1]].filter(
    (movie): movie is Movie => Boolean(movie) && movie.id !== data.featuredMovie?.id
  );
  const seenIds = new Set<number>();
  return stripCandidates.filter((movie) => {
    if (seenIds.has(movie.id)) {
      return false;
    }
    seenIds.add(movie.id);
    return true;
  });
}
