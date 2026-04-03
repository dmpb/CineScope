import type { Metadata } from "next";
import { cache } from "react";
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

const getMovieByIdCached = cache(async (id: number) => getMovieById(id));

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const movieId = parseMovieId(idParam);
  if (!movieId) {
    return {
      title: "Película no encontrada",
      description: "El identificador de la película no es válido."
    };
  }

  const movie = await getMovieByIdCached(movieId);
  if (!movie) {
    return {
      title: "Película no disponible",
      description: "No se pudo cargar esta película o no existe en TMDb."
    };
  }

  const plainOverview = movie.overview.trim();
  const description =
    plainOverview.length > 0
      ? plainOverview.length > 155
        ? `${plainOverview.slice(0, 155)}…`
        : plainOverview
      : `${movie.title}. Ficha, reparto, trailers y títulos similares en CineScope.`;

  const imageUrl = movie.backdropPath || movie.posterPath;

  return {
    title: movie.title,
    description,
    alternates: {
      canonical: `/movie/${movieId}`
    },
    openGraph: {
      title: movie.title,
      description,
      type: "video.movie",
      url: `/movie/${movieId}`,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: movie.backdropPath ? 1280 : 500,
                height: movie.backdropPath ? 720 : 750
              }
            ]
          }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {})
    }
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id: idParam } = await params;
  const movieId = parseMovieId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const [movie, trailerUrl, cast, crew, providers, mediaImages, similarMovies] = movieId
    ? await Promise.all([
        getMovieByIdCached(movieId),
        getMovieTrailerById(movieId),
        getMovieCastById(movieId),
        getMovieCrewHighlightsById(movieId),
        getMovieWatchProvidersById(movieId),
        getMovieImagesById(movieId),
        getSimilarMoviesById(movieId)
      ])
    : [null, null, [], { directors: [], writers: [] }, [], [], []];

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
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
