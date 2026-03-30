import Link from "next/link";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getMovieById } from "@/lib/tmdb";
import { MovieDetail } from "@/components/MovieDetail";

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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-12">
      <Link href="/" className="w-fit text-sm text-zinc-300 underline-offset-4 hover:underline">
        ← Volver al inicio
      </Link>

      {!hasToken && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </div>
      )}

      {!movieId && (
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-300">
          El ID de la pelicula no es valido.
        </div>
      )}

      {movieId && !movie && (
        <div className="rounded-lg border border-amber-900 bg-amber-950/50 px-4 py-6 text-sm text-amber-200">
          No se pudo cargar la pelicula solicitada. Puede no existir o estar temporalmente no disponible.
        </div>
      )}

      {movie && <MovieDetail movie={movie} />}
    </main>
  );
}
