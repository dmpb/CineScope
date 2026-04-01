import { Banner } from "@/components/Banner";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
  getMovieById,
  getMovieTrailerById,
  getMovieGenres,
  getMoviesByGenre,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  type MovieGenre,
  getUpcomingMovies
} from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

type HomeGenreSection = {
  genre: MovieGenre;
  movies: Movie[];
};

type HomeMovies = {
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

async function getHomeMovies(): Promise<HomeMovies> {
  try {
    const [trending, popular, topRated, nowPlaying, upcoming, allGenres] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getUpcomingMovies(),
      getMovieGenres()
    ]);

    const selectedGenres = (
      allGenres.find((genre) => genre.id === 28)
        ? [allGenres.find((genre) => genre.id === 28), allGenres.find((genre) => genre.id === 35)]
        : allGenres.slice(0, 2)
    ).filter((genre): genre is MovieGenre => Boolean(genre));

    const ensuredSelectedGenres =
      selectedGenres.length >= 2 ? selectedGenres : [{ id: 28, name: "Action" }, { id: 35, name: "Comedy" }];

    const genreSections = await Promise.all(
      ensuredSelectedGenres.map(async (genre) => ({
        genre,
        movies: await getMoviesByGenre(genre.id)
      }))
    );

    const featuredMovieCandidate = trending[0] ?? popular[0] ?? topRated[0] ?? nowPlaying[0] ?? upcoming[0] ?? null;
    let featuredMovie: Movie | null = featuredMovieCandidate;
    let featuredTrailerUrl: string | null = null;

    if (featuredMovieCandidate) {
      try {
        const [featuredMovieFromDetail, trailerUrl] = await Promise.all([
          getMovieById(featuredMovieCandidate.id),
          getMovieTrailerById(featuredMovieCandidate.id)
        ]);
        featuredMovie = featuredMovieFromDetail ?? featuredMovieCandidate;
        featuredTrailerUrl = trailerUrl;
      } catch {
        featuredTrailerUrl = null;
        featuredMovie = featuredMovieCandidate;
      }
    }

    return { trending, popular, topRated, nowPlaying, upcoming, genreSections, featuredMovie, featuredTrailerUrl, hasError: false };
  } catch {
    return {
      trending: [],
      popular: [],
      topRated: [],
      nowPlaying: [],
      upcoming: [],
      genreSections: [],
      featuredMovie: null,
      featuredTrailerUrl: null,
      hasError: true
    };
  }
}

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const { trending, popular, topRated, nowPlaying, upcoming, genreSections, featuredMovie, featuredTrailerUrl, hasError } =
    await getHomeMovies();
  const hasAnyMovies =
    trending.length > 0 ||
    popular.length > 0 ||
    topRated.length > 0 ||
    nowPlaying.length > 0 ||
    upcoming.length > 0 ||
    genreSections.some((section) => section.movies.length > 0);
  const rowSections = [
    {
      key: "trending",
      title: "Tendencias de la semana",
      movies: trending,
      emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
    },
    {
      key: "popular",
      title: "Populares",
      movies: popular,
      emptyMessage: "No se encontraron peliculas populares en este momento."
    },
    {
      key: "top-rated",
      title: "Mejor valoradas",
      movies: topRated,
      emptyMessage: "No hay peliculas mejor valoradas para mostrar."
    },
    {
      key: "now-playing",
      title: "En cartelera",
      movies: nowPlaying,
      emptyMessage: "No hay peliculas en cartelera disponibles en este momento."
    },
    {
      key: "upcoming",
      title: "Proximamente",
      movies: upcoming,
      emptyMessage: "No hay proximos lanzamientos para mostrar."
    },
    ...genreSections.map(({ genre, movies }) => ({
      key: `genre-${genre.id}`,
      title: `Genero: ${genre.name}`,
      movies,
      emptyMessage: `No hay peliculas para el genero ${genre.name} en este momento.`
    }))
  ];

  const stripCandidates = [popular[0], topRated[0], nowPlaying[0], upcoming[0], trending[1]].filter(
    (movie): movie is Movie => Boolean(movie) && movie.id !== featuredMovie?.id
  );
  const stripMovies = stripCandidates.filter((movie, index, allMovies) => allMovies.findIndex((item) => item.id === movie.id) === index);

  return (
    <main className="-mt-20 home-cinematic-shell">
      {featuredMovie && <Banner movie={featuredMovie} trailerUrl={featuredTrailerUrl} />}

      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
          </StateMessage>
        )}

        {hasError && (
          <StateMessage variant="error">
            Ocurrio un error al cargar datos de TMDb. Intenta nuevamente en unos segundos.
          </StateMessage>
        )}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label="Seleccion de la semana" />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnyMovies && (
          <StateMessage variant="empty">No hay resultados para mostrar por ahora.</StateMessage>
        )}
      </div>
    </main>
  );
}
