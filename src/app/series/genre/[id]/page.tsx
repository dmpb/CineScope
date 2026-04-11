import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenreCategoryRail } from "@/components/GenreCategoryRail";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getTvGenres, getTvShowsByGenre } from "@/lib/tmdb";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

type GenreSeriesPageProps = {
  params: Promise<{ id: string }>;
};

function parseGenreId(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    return null;
  }
  return n;
}

export async function generateMetadata({ params }: GenreSeriesPageProps): Promise<Metadata> {
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const { id: idParam } = await params;
  const genreId = parseGenreId(idParam);
  if (!genreId) {
    return { title: ui.metaSeriesTitle };
  }
  const genres = await getTvGenres();
  const genre = genres.find((g) => g.id === genreId);
  const label = genre?.name ?? String(genreId);
  return {
    title: `${ui.genreTitle(label)} | ${ui.metaSeriesTitle}`,
    description: ui.metaSeriesDescription,
    openGraph: {
      url: `/series/genre/${genreId}`
    },
    alternates: {
      canonical: `/series/genre/${genreId}`
    }
  };
}

export default async function SeriesGenrePage({ params }: GenreSeriesPageProps) {
  const { id: idParam } = await params;
  const genreId = parseGenreId(idParam);
  if (!genreId) {
    notFound();
  }

  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(tmdbLanguage);
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const [genres, shows] = await Promise.all([getTvGenres(), getTvShowsByGenre(genreId)]);
  const genre = genres.find((g) => g.id === genreId);
  const genreName = genre?.name ?? `ID ${genreId}`;

  return (
    <main className="-mt-28 flex min-h-screen flex-col gap-0 pb-14 lg:-mt-20">
      <div className="h-28 shrink-0 lg:h-20" aria-hidden="true" />

      <GenreCategoryRail
        genres={genres}
        basePath="/series"
        ariaLabel={ui.genreRailAriaSeries}
        browseHint={ui.genreBrowseHint}
        activeGenreId={genreId}
      />

      <div className="home-content-container home-content-stack pt-6 sm:pt-8">
        {!hasToken && (
          <StateMessage variant="warning">
            {ui.tokenWarningBefore}
            <code>TMDB_BEARER_TOKEN</code>
            {ui.tokenWarningAfter}
          </StateMessage>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title mt-2">{ui.genreTitle(genreName)}</h1>
          </div>
        </div>

        <MovieSection
          title={ui.genreResultsTv}
          movies={shows}
          emptyMessage={ui.genreEmptySeries(genreName)}
          layout="grid"
          ui={ui}
        />
      </div>
    </main>
  );
}
