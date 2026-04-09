import type { Metadata } from "next";
import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildMoviesRowSections, getMoviesPageData, selectMoviesStripMovies } from "@/lib/home";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const code = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(code);
  return {
    title: ui.metaMoviesTitle,
    description: ui.metaMoviesDescription,
    openGraph: {
      url: "/movies"
    },
    alternates: {
      canonical: "/movies"
    }
  };
}

export default async function MoviesPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(tmdbLanguage);
  const moviesData = await getMoviesPageData();
  const { featuredSlides, hasError } = moviesData;
  const rowSections = buildMoviesRowSections(moviesData, ui);
  const hasAnyMovies = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectMoviesStripMovies(moviesData);

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      {featuredSlides.length > 0 && <FeaturedBannerCarousel slides={featuredSlides} />}

      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            {ui.tokenWarningBefore}
            <code>TMDB_BEARER_TOKEN</code>
            {ui.tokenWarningAfter}
          </StateMessage>
        )}

        {hasError && <StateMessage variant="error">{ui.errorLoadMovies}</StateMessage>}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} ui={ui} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label={ui.featuredMoviesRec} ui={ui} />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnyMovies && (
          <StateMessage variant="empty">{ui.emptyNoMovies}</StateMessage>
        )}
      </div>
    </main>
  );
}
