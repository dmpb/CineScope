import Link from "next/link";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getMovieById } from "@/lib/tmdb";
import { MovieDetail } from "@/components/MovieDetail";
import { StateMessage } from "@/components/StateMessage";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

function parseMovieId(idParam: string): number | null {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id: idParam } = await params;
  const movieId = parseMovieId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const movie = movieId ? await getMovieById(movieId) : null;

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

      {!hasToken && (
        <StateMessage variant="warning">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </StateMessage>
      )}

      {!movieId && (
        <StateMessage variant="empty">El ID de la pelicula no es valido.</StateMessage>
      )}

      {movieId && !movie && (
        <StateMessage variant="error">
          No se pudo cargar la pelicula solicitada. Puede no existir o estar temporalmente no disponible.
        </StateMessage>
      )}

      {movie && <MovieDetail movie={movie} />}
    </main>
  );
}
