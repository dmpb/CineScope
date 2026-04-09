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
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

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
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const { id: idParam } = await params;
  const movieId = parseMovieId(idParam);
  if (!movieId) {
    return {
      title: ui.metaMovieNotFoundTitle,
      description: ui.metaMovieNotFoundDesc
    };
  }

  const movie = await getMovieByIdCached(movieId);
  if (!movie) {
    return {
      title: ui.metaMovieUnavailableTitle,
      description: ui.metaMovieUnavailableDesc
    };
  }

  const plainOverview = movie.overview.trim();
  const description =
    plainOverview.length > 0
      ? plainOverview.length > 155
        ? `${plainOverview.slice(0, 155)}…`
        : plainOverview
      : ui.metaMovieFallbackDescription(movie.title);

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
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());

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
              {ui.tokenWarningBefore}
              <code>TMDB_BEARER_TOKEN</code>
              {ui.tokenWarningAfter}
            </StateMessage>
          )}

          {!movieId && <StateMessage variant="empty">{ui.movieInvalidId}</StateMessage>}

          {movieId && !movie && <StateMessage variant="error">{ui.movieLoadError}</StateMessage>}
        </div>
      )}

      {movie && (
        <MovieDetail
          movie={movie}
          ui={ui}
          trailerUrl={trailerUrl}
          cast={cast}
          crew={crew}
          providers={providers}
          mediaImages={mediaImages}
        />
      )}
      {movie && (
        <div id="similar-movies" className="anchor-target home-content-container home-content-stack">
          <MovieSection
            title={ui.similarMoviesTitle(movie.title)}
            movies={similarMovies}
            emptyMessage={ui.similarMoviesEmpty}
            ui={ui}
          />
        </div>
      )}
    </main>
  );
}
