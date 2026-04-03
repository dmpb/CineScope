import type { Metadata } from "next";
import { cache } from "react";
import { MovieDetail } from "@/components/MovieDetail";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
  getSimilarTvById,
  getTvById,
  getTvCastById,
  getTvCrewHighlightsById,
  getTvImagesById,
  getTvTrailerById,
  getTvWatchProvidersById
} from "@/lib/tmdb";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

function parseTvId(idParam: string): number | null {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

const getTvByIdCached = cache(async (id: number) => getTvById(id));

export async function generateMetadata({ params }: TvPageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const tvId = parseTvId(idParam);
  if (!tvId) {
    return {
      title: "Serie no encontrada",
      description: "El identificador de la serie no es válido."
    };
  }

  const show = await getTvByIdCached(tvId);
  if (!show) {
    return {
      title: "Serie no disponible",
      description: "No se pudo cargar esta serie o no existe en TMDb."
    };
  }

  const plainOverview = show.overview.trim();
  const description =
    plainOverview.length > 0
      ? plainOverview.length > 155
        ? `${plainOverview.slice(0, 155)}…`
        : plainOverview
      : `Serie: ${show.title}. Valoración, reparto y títulos similares en CineScope.`;

  const imageUrl = show.backdropPath || show.posterPath;

  return {
    title: show.title,
    description,
    alternates: {
      canonical: `/tv/${tvId}`
    },
    openGraph: {
      title: show.title,
      description,
      type: "video.tv_show",
      url: `/tv/${tvId}`,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: show.backdropPath ? 1280 : 500,
                height: show.backdropPath ? 720 : 750
              }
            ]
          }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: show.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {})
    }
  };
}

export default async function TvPage({ params }: TvPageProps) {
  const { id: idParam } = await params;
  const tvId = parseTvId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const [tvShow, trailerUrl, cast, crew, providers, mediaImages, similarTv] = tvId
    ? await Promise.all([
        getTvByIdCached(tvId),
        getTvTrailerById(tvId),
        getTvCastById(tvId),
        getTvCrewHighlightsById(tvId),
        getTvWatchProvidersById(tvId),
        getTvImagesById(tvId),
        getSimilarTvById(tvId)
      ])
    : [null, null, [], { directors: [], writers: [] }, [], [], []];

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      {(!hasToken || !tvId || (tvId && !tvShow)) && (
        <div className="home-content-container space-y-4 pt-6">
          {!hasToken && (
            <StateMessage variant="warning">
              Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
            </StateMessage>
          )}

          {!tvId && <StateMessage variant="empty">El ID de la serie no es valido.</StateMessage>}

          {tvId && !tvShow && (
            <StateMessage variant="error">
              No se pudo cargar la serie solicitada. Puede no existir o estar temporalmente no disponible.
            </StateMessage>
          )}
        </div>
      )}

      {tvShow && (
        <MovieDetail
          movie={tvShow}
          trailerUrl={trailerUrl}
          cast={cast}
          crew={crew}
          providers={providers}
          mediaImages={mediaImages}
        />
      )}
      {tvShow && (
        <div id="similar-titles" className="anchor-target home-content-container home-content-stack">
          <MovieSection
            title={`Similares a "${tvShow.title}"`}
            movies={similarTv}
            emptyMessage="No se encontraron series similares relevantes para este titulo."
          />
        </div>
      )}
    </main>
  );
}
