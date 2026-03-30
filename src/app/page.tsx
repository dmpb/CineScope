import { MovieSection } from "@/components/MovieSection";
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">CineScope</h1>
        <p className="max-w-2xl text-zinc-300">
          Explora tendencias semanales, catalogo popular y peliculas mejor valoradas.
        </p>
        <Link href="/search" className="inline-block text-sm text-zinc-300 underline-offset-4 hover:underline">
          Ir a busqueda →
        </Link>
      </header>

      {!hasToken && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </div>
      )}

      {hasError && (
        <div className="rounded-lg border border-amber-900 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">
          Ocurrio un error al cargar datos de TMDb. Intenta nuevamente en unos segundos.
        </div>
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
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-300">
          No hay resultados para mostrar por ahora.
        </div>
      )}
    </main>
  );
}
