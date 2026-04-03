import type { Metadata } from "next";
import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildHomeRowSections, getHomeData, selectHomeStripMovies } from "@/lib/home";
import { SITE_DEFAULT_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inicio",
  description: SITE_DEFAULT_DESCRIPTION,
  openGraph: {
    description: SITE_DEFAULT_DESCRIPTION,
    url: "/"
  },
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const homeData = await getHomeData();
  const { featuredSlides, hasError } = homeData;
  const rowSections = buildHomeRowSections(homeData);
  const hasAnyMovies = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectHomeStripMovies(homeData);

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      {featuredSlides.length > 0 && <FeaturedBannerCarousel slides={featuredSlides} />}

      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
          </StateMessage>
        )}

        {hasError && (
          <StateMessage variant="error">
            Ocurrio un error al cargar datos de TMDb. Intenta nuevamente en unos segundos.
          </StateMessage>
        )}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label="Seleccion de la semana" />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnyMovies && (
          <StateMessage variant="empty">No hay resultados para mostrar por ahora.</StateMessage>
        )}
      </div>
    </main>
  );
}
