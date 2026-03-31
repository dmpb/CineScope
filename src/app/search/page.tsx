import Link from "next/link";
import { SearchResultsInfinite } from "@/components/SearchResultsInfinite";
import { StateMessage } from "@/components/StateMessage";
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
  let currentPage = 1;
  let totalPages = 0;
  let results = [] as Awaited<ReturnType<typeof searchMovies>>["results"];

  if (query) {
    try {
      const searchResult = await searchMovies(query);
      totalResults = searchResult.totalResults;
      currentPage = searchResult.currentPage;
      totalPages = searchResult.totalPages;
      results = searchResult.results;
    } catch {
      hasError = true;
    }
  }

  return (
    <main className="page-shell">
      <nav aria-label="Navegacion de pagina">
        <Link
          href="/"
          className="focus-ring w-fit rounded-md text-sm text-zinc-300 underline-offset-4 hover:text-zinc-100 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="page-title">Busqueda</h1>
        <p className="page-subtitle">
          Usa la barra de busqueda del encabezado. La consulta se refleja en la URL con <code>?q=</code>.
        </p>
      </header>

      {!hasToken && (
        <StateMessage variant="warning">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </StateMessage>
      )}

      {query.length === 0 && (
        <StateMessage variant="empty">Ingresa un termino para comenzar la busqueda.</StateMessage>
      )}

      {hasError && (
        <StateMessage variant="error">Ocurrio un error al buscar peliculas. Intenta nuevamente.</StateMessage>
      )}

      {query.length > 0 && !hasError && (
        <SearchResultsInfinite
          query={query}
          initialResults={results}
          initialTotalResults={totalResults}
          initialPage={currentPage}
          initialTotalPages={totalPages}
        />
      )}
    </main>
  );
}
