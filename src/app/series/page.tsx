import type { Metadata } from "next";
import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { GenreCategoryRail } from "@/components/GenreCategoryRail";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildSeriesRowSections, getSeriesPageData, selectSeriesStripMovies } from "@/lib/home";
import { getTvGenres } from "@/lib/tmdb";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const code = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(code);
  return {
    title: ui.metaSeriesTitle,
    description: ui.metaSeriesDescription,
    openGraph: {
      url: "/series"
    },
    alternates: {
      canonical: "/series"
    }
  };
}

export default async function SeriesPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(tmdbLanguage);
  const [seriesData, tvGenres] = await Promise.all([getSeriesPageData(), getTvGenres()]);
  const { featuredSlides, hasError } = seriesData;
  const rowSections = buildSeriesRowSections(seriesData, ui);
  const hasAnySeries = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectSeriesStripMovies(seriesData);

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      {featuredSlides.length > 0 && <FeaturedBannerCarousel slides={featuredSlides} />}

      <GenreCategoryRail
        genres={tvGenres}
        basePath="/series"
        ariaLabel={ui.genreRailAriaSeries}
        browseHint={ui.genreBrowseHint}
      />

      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            {ui.tokenWarningBefore}
            <code>TMDB_BEARER_TOKEN</code>
            {ui.tokenWarningAfter}
          </StateMessage>
        )}

        {hasError && <StateMessage variant="error">{ui.errorLoadSeries}</StateMessage>}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} ui={ui} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label={ui.featuredSeriesRec} ui={ui} />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnySeries && (
          <StateMessage variant="empty">{ui.emptyNoSeries}</StateMessage>
        )}
      </div>
    </main>
  );
}
