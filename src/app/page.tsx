import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import Link from "next/link";

type HomeMovies = {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  hasError: boolean;
};

async function getHomeMovies(): Promise<HomeMovies> {
  try {
    const [trending, popular, topRated] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies()
    ]);

    return { trending, popular, topRated, hasError: false };
  } catch {
    return { trending: [], popular: [], topRated: [], hasError: true };
  }
}

export default async function HomePage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const { trending, popular, topRated, hasError } = await getHomeMovies();
  const hasAnyMovies = trending.length > 0 || popular.length > 0 || topRated.length > 0;

  return (
    <main className="page-shell">
      <header className="space-y-3">
        <h1 className="page-title">CineScope</h1>
        <p className="page-subtitle">
          Explora tendencias semanales, catalogo popular y peliculas mejor valoradas.
        </p>
        <Link
          href="/search"
          className="focus-ring inline-block rounded-md text-sm text-zinc-300 underline-offset-4 hover:text-zinc-100 hover:underline"
        >
          Ir a busqueda →
        </Link>
      </header>

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

      <MovieSection
        title="Tendencias de la semana"
        movies={trending}
        emptyMessage="No hay peliculas en tendencia para mostrar en este momento."
      />

      <MovieSection
        title="Populares"
        movies={popular}
        emptyMessage="No se encontraron peliculas populares en este momento."
      />

      <MovieSection
        title="Mejor valoradas"
        movies={topRated}
        emptyMessage="No hay peliculas mejor valoradas para mostrar."
      />

      {!hasError && hasToken && !hasAnyMovies && (
        <StateMessage variant="empty">No hay resultados para mostrar por ahora.</StateMessage>
      )}
    </main>
  );
}
