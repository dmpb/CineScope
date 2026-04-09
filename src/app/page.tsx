import type { Metadata } from "next";
import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildHomeRowSections, getHomeData, selectHomeStripMovies } from "@/lib/home";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { SITE_DEFAULT_DESCRIPTION } from "@/lib/site";
import { getUiMessages } from "@/lib/ui-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const code = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(code);
  return {
    title: ui.metaHomeTitle,
    description: SITE_DEFAULT_DESCRIPTION,
    openGraph: {
      description: SITE_DEFAULT_DESCRIPTION,
      url: "/"
    },
    alternates: {
      canonical: "/"
    }
  };
}

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const tmdbLanguage = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(tmdbLanguage);
  const homeData = await getHomeData();
  const { featuredSlides, hasError } = homeData;
  const rowSections = buildHomeRowSections(homeData, ui);
  const hasAnyMovies = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectHomeStripMovies(homeData);

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

        {hasError && <StateMessage variant="error">{ui.errorLoadTmdb}</StateMessage>}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} ui={ui} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label={ui.featuredWeekPick} ui={ui} />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnyMovies && (
          <StateMessage variant="empty">{ui.emptyNoResults}</StateMessage>
        )}
      </div>
    </main>
  );
}
