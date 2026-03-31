import { Banner } from "@/components/Banner";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
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

    return { trending, popular, topRated, nowPlaying, upcoming, genreSections, hasError: false };
  } catch {
    return {
      trending: [],
      popular: [],
      topRated: [],
      nowPlaying: [],
      upcoming: [],
      genreSections: [],
      hasError: true
    };
  }
}

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const { trending, popular, topRated, nowPlaying, upcoming, genreSections, hasError } = await getHomeMovies();
  const hasAnyMovies =
    trending.length > 0 ||
    popular.length > 0 ||
    topRated.length > 0 ||
    nowPlaying.length > 0 ||
    upcoming.length > 0 ||
    genreSections.some((section) => section.movies.length > 0);
  const featuredMovie = trending[0] ?? popular[0] ?? topRated[0] ?? nowPlaying[0] ?? upcoming[0] ?? null;

  return (
    <main className="page-shell">
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

      {featuredMovie && <Banner movie={featuredMovie} />}

      <MovieSection
        title="Tendencias de la semana"
        movies={trending}
        emptyMessage="No hay peliculas en tendencia para mostrar en este momento."
      />

      <MovieSection
        title="Populares"
        movies={popular}
        emptyMessage="No se encontraron peliculas populares en este momento."
      />

      <MovieSection
        title="Mejor valoradas"
        movies={topRated}
        emptyMessage="No hay peliculas mejor valoradas para mostrar."
      />

      <MovieSection
        title="En cartelera"
        movies={nowPlaying}
        emptyMessage="No hay peliculas en cartelera disponibles en este momento."
      />

      <MovieSection
        title="Proximamente"
        movies={upcoming}
        emptyMessage="No hay proximos lanzamientos para mostrar."
      />

      {genreSections.map(({ genre, movies }) => (
        <MovieSection
          key={genre.id}
          title={`Genero: ${genre.name}`}
          movies={movies}
          emptyMessage={`No hay peliculas para el genero ${genre.name} en este momento.`}
        />
      ))}

      {!hasError && hasToken && !hasAnyMovies && (
        <StateMessage variant="empty">No hay resultados para mostrar por ahora.</StateMessage>
      )}
    </main>
  );
}
