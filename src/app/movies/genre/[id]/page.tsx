import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenreCategoryRail } from "@/components/GenreCategoryRail";
import { GenreDiscoverInfinite } from "@/components/GenreDiscoverInfinite";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getDiscoverMoviesByGenrePage, getMovieGenres } from "@/lib/tmdb";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

type GenreMoviePageProps = {
  params: Promise<{ id: string }>;
};

function parseGenreId(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    return null;
  }
  return n;
}

export async function generateMetadata({ params }: GenreMoviePageProps): Promise<Metadata> {
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const { id: idParam } = await params;
  const genreId = parseGenreId(idParam);
  if (!genreId) {
    return { title: ui.metaMoviesTitle };
  }
  const genres = await getMovieGenres();
  const genre = genres.find((g) => g.id === genreId);
  const label = genre?.name ?? String(genreId);
  return {
    title: ui.genreTitle(label),
    description: ui.metaMoviesDescription,
    openGraph: {
      url: `/movies/genre/${genreId}`
    },
    alternates: {
      canonical: `/movies/genre/${genreId}`
    }
  };
}

export default async function MoviesGenrePage({ params }: GenreMoviePageProps) {
  const { id: idParam } = await params;
  const genreId = parseGenreId(idParam);
  if (!genreId) {
    notFound();
  }

  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(tmdbLanguage);
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const [genres, discover] = await Promise.all([getMovieGenres(), getDiscoverMoviesByGenrePage(genreId, 1)]);
  const genre = genres.find((g) => g.id === genreId);
  const genreName = genre?.name ?? `ID ${genreId}`;

  return (
    <main className="-mt-28 flex min-h-screen flex-col gap-0 pb-14 lg:-mt-20">
      <div className="h-28 shrink-0 lg:h-20" aria-hidden="true" />

      <GenreCategoryRail
        genres={genres}
        basePath="/movies"
        ariaLabel={ui.genreRailAriaMovies}
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

        <GenreDiscoverInfinite
          kind="movie"
          genreId={genreId}
          genreName={genreName}
          sectionTitle={ui.genreResultsMovies}
          emptyMessage={ui.genreEmpty(genreName)}
          initialResults={discover.results}
          initialTotalResults={discover.totalResults}
          initialPage={discover.currentPage}
          initialTotalPages={discover.totalPages}
        />
      </div>
    </main>
  );
}
