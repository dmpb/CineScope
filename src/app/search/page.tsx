import Link from "next/link";
import { MovieSection } from "@/components/MovieSection";
import { SearchBar } from "@/components/SearchBar";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { searchMovies } from "@/lib/tmdb";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  let hasError = false;
  let totalResults = 0;
  let results = [] as Awaited<ReturnType<typeof searchMovies>>["results"];

  if (query) {
    try {
      const searchResult = await searchMovies(query);
      totalResults = searchResult.totalResults;
      results = searchResult.results;
    } catch {
      hasError = true;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <Link href="/" className="w-fit text-sm text-zinc-300 underline-offset-4 hover:underline">
        ← Volver al inicio
      </Link>

      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Busqueda</h1>
        <p className="max-w-2xl text-zinc-300">
          Escribe un titulo y presiona buscar. La consulta se refleja en la URL con <code>?q=</code>.
        </p>
      </header>

      <SearchBar defaultValue={query} />

      {!hasToken && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </div>
      )}

      {query.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-300">
          Ingresa un termino para comenzar la busqueda.
        </div>
      )}

      {hasError && (
        <div className="rounded-lg border border-amber-900 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">
          Ocurrio un error al buscar peliculas. Intenta nuevamente.
        </div>
      )}

      {query.length > 0 && !hasError && (
        <MovieSection
          title={`Resultados para "${query}" (${totalResults})`}
          movies={results}
          emptyMessage="No se encontraron peliculas para esta busqueda."
        />
      )}
    </main>
  );
}
