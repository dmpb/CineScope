import { FeaturedBannerCarousel } from "@/components/FeaturedBannerCarousel";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildMoviesRowSections, getMoviesPageData, selectMoviesStripMovies } from "@/lib/home";

export default async function MoviesPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const moviesData = await getMoviesPageData();
  const { featuredSlides, hasError } = moviesData;
  const rowSections = buildMoviesRowSections(moviesData);
  const hasAnyMovies = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectMoviesStripMovies(moviesData);

  return (
    <main className="-mt-20 home-cinematic-shell">
      {featuredSlides.length > 0 && <FeaturedBannerCarousel slides={featuredSlides} />}

      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
          </StateMessage>
        )}

        {hasError && (
          <StateMessage variant="error">
            Ocurrio un error al cargar peliculas desde TMDb. Intenta nuevamente en unos segundos.
          </StateMessage>
        )}

        {rowSections.map((section, index) => (
          <div key={section.key} className="space-y-8 sm:space-y-10">
            <MovieSection title={section.title} movies={section.movies} emptyMessage={section.emptyMessage} />
            {index % 2 === 1 && stripMovies[Math.floor(index / 2)] && (
              <FeaturedStrip movie={stripMovies[Math.floor(index / 2)]} label="Recomendacion de peliculas" />
            )}
          </div>
        ))}

        {!hasError && hasToken && !hasAnyMovies && (
          <StateMessage variant="empty">No hay peliculas para mostrar por ahora.</StateMessage>
        )}
      </div>
    </main>
  );
}
