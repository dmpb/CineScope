import { Banner } from "@/components/Banner";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildHomeRowSections, getHomeData, selectHomeStripMovies } from "@/lib/home";

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const homeData = await getHomeData();
  const { featuredMovie, featuredTrailerUrl, hasError } = homeData;
  const rowSections = buildHomeRowSections(homeData);
  const hasAnyMovies = rowSections.some((section) => section.movies.length > 0);
  const stripMovies = selectHomeStripMovies(homeData);

  return (
    <main className="-mt-20 home-cinematic-shell">
      {featuredMovie && <Banner movie={featuredMovie} trailerUrl={featuredTrailerUrl} />}

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
