import { MovieDetail } from "@/components/MovieDetail";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getTvById, getTvCastById, getTvTrailerById } from "@/lib/tmdb";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

function parseTvId(idParam: string): number | null {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export default async function TvPage({ params }: TvPageProps) {
  const { id: idParam } = await params;
  const tvId = parseTvId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const [tvShow, trailerUrl, cast] = tvId
    ? await Promise.all([getTvById(tvId), getTvTrailerById(tvId), getTvCastById(tvId)])
    : [null, null, []];

  return (
    <main className="-mt-20 home-cinematic-shell">
      {(!hasToken || !tvId || (tvId && !tvShow)) && (
        <div className="home-content-container space-y-4 pt-6">
          {!hasToken && (
            <StateMessage variant="warning">
              Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
            </StateMessage>
          )}

          {!tvId && <StateMessage variant="empty">El ID de la serie no es valido.</StateMessage>}

          {tvId && !tvShow && (
            <StateMessage variant="error">
              No se pudo cargar la serie solicitada. Puede no existir o estar temporalmente no disponible.
            </StateMessage>
          )}
        </div>
      )}

      {tvShow && <MovieDetail movie={tvShow} trailerUrl={trailerUrl} cast={cast} />}
      {tvShow && (
        <section id="similar-movies" className="anchor-target home-content-container py-6">
          <StateMessage variant="empty">La seccion de similares para series se habilitara en una siguiente iteracion.</StateMessage>
        </section>
      )}
    </main>
  );
}
