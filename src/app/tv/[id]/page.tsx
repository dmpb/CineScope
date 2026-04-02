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
      title: "Serie — CineScope",
      description: "Explora series y valoraciones en CineScope."
    };
  }

  const show = await getTvByIdCached(tvId);
  if (!show) {
    return {
      title: "Serie no disponible — CineScope",
      description: "No se pudo cargar esta serie."
    };
  }

  const plainOverview = show.overview.trim();
  const description =
    plainOverview.length > 0
      ? plainOverview.length > 155
        ? `${plainOverview.slice(0, 155)}…`
        : plainOverview
      : `Serie: ${show.title}. Valoracion, reparto y titulos similares en CineScope.`;

  return {
    title: `${show.title} — CineScope`,
    description,
    openGraph: {
      title: show.title,
      description
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
    <main className="-mt-20 home-cinematic-shell">
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
