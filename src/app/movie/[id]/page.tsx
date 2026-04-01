import { MovieSection } from "@/components/MovieSection";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
  getMovieById,
  getMovieCastById,
  getMovieCrewHighlightsById,
  getMovieImagesById,
  getMovieTrailerById,
  getMovieWatchProvidersById,
  getSimilarMoviesById
} from "@/lib/tmdb";
import { MovieDetail } from "@/components/MovieDetail";
import { StateMessage } from "@/components/StateMessage";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

function parseMovieId(idParam: string): number | null {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id: idParam } = await params;
  const movieId = parseMovieId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const [movie, trailerUrl, cast, crew, providers, mediaImages, similarMovies] = movieId
    ? await Promise.all([
        getMovieById(movieId),
        getMovieTrailerById(movieId),
        getMovieCastById(movieId),
        getMovieCrewHighlightsById(movieId),
        getMovieWatchProvidersById(movieId),
        getMovieImagesById(movieId),
        getSimilarMoviesById(movieId)
      ])
    : [null, null, [], { directors: [], writers: [] }, [], [], []];

  return (
    <main className="-mt-20 home-cinematic-shell">
      {(!hasToken || !movieId || (movieId && !movie)) && (
        <div className="home-content-container space-y-4 pt-6">
          {!hasToken && (
            <StateMessage variant="warning">
              Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
            </StateMessage>
          )}

          {!movieId && (
            <StateMessage variant="empty">El ID de la pelicula no es valido.</StateMessage>
          )}

          {movieId && !movie && (
            <StateMessage variant="error">
              No se pudo cargar la pelicula solicitada. Puede no existir o estar temporalmente no disponible.
            </StateMessage>
          )}
        </div>
      )}

      {movie && <MovieDetail movie={movie} trailerUrl={trailerUrl} cast={cast} crew={crew} providers={providers} mediaImages={mediaImages} />}
      {movie && (
        <div id="similar-movies" className="anchor-target home-content-container home-content-stack">
          <MovieSection
            title={`Similares a "${movie.title}"`}
            movies={similarMovies}
            emptyMessage="No se encontraron peliculas similares relevantes para este titulo."
          />
        </div>
      )}
    </main>
  );
}
