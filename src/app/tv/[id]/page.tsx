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
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

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
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const { id: idParam } = await params;
  const tvId = parseTvId(idParam);
  if (!tvId) {
    return {
      title: ui.metaTvNotFoundTitle,
      description: ui.metaTvNotFoundDesc
    };
  }

  const show = await getTvByIdCached(tvId);
  if (!show) {
    return {
      title: ui.metaTvUnavailableTitle,
      description: ui.metaTvUnavailableDesc
    };
  }

  const plainOverview = show.overview.trim();
  const description =
    plainOverview.length > 0
      ? plainOverview.length > 155
        ? `${plainOverview.slice(0, 155)}…`
        : plainOverview
      : ui.metaTvFallbackDescription(show.title);

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
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());

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
              {ui.tokenWarningBefore}
              <code>TMDB_BEARER_TOKEN</code>
              {ui.tokenWarningAfter}
            </StateMessage>
          )}

          {!tvId && <StateMessage variant="empty">{ui.tvInvalidId}</StateMessage>}

          {tvId && !tvShow && <StateMessage variant="error">{ui.tvLoadError}</StateMessage>}
        </div>
      )}

      {tvShow && (
        <MovieDetail
          movie={tvShow}
          ui={ui}
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
            title={ui.similarTvTitle(tvShow.title)}
            movies={similarTv}
            emptyMessage={ui.similarTvEmpty}
            ui={ui}
          />
        </div>
      )}
    </main>
  );
}
