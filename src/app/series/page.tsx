import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildSeriesRowSections, getSeriesPageData, selectSeriesStripMovies } from "@/lib/home";

export default async function SeriesPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const seriesData = await getSeriesPageData();
  const { featuredSlides, hasError } = seriesData;
  const rowSections = buildSeriesRowSections(seriesData);
  const hasAnySeries = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectSeriesStripMovies(seriesData);

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
            Ocurrio un error al cargar series desde TMDb. Intenta nuevamente en unos segundos.
          </StateMessage>
        )}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label="Recomendacion de series" />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnySeries && (
          <StateMessage variant="empty">No hay series para mostrar por ahora.</StateMessage>
        )}
      </div>
    </main>
  );
}
