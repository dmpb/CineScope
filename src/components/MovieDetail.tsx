import Image from "next/image";
import type { CastMember, Movie } from "@/types/movie";

type MovieDetailProps = {
  movie: Movie;
  trailerUrl?: string | null;
  cast?: CastMember[];
};

export function MovieDetail({ movie, trailerUrl = null, cast = [] }: MovieDetailProps) {
  const movieTitle = movie.title || "Sin titulo";
  const genresText = movie.genres.length > 0 ? movie.genres.join(", ") : "No disponible";
  const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : "No disponible";
  const languageText = movie.language ? movie.language.toUpperCase() : "No disponible";
  const voteCountText = movie.voteCount > 0 ? new Intl.NumberFormat("es-ES").format(movie.voteCount) : "Sin votos";

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80">
      <div className="relative aspect-[16/9] w-full bg-zinc-800 sm:aspect-[21/9]">
        {movie.backdropPath ? (
          <Image
            src={movie.backdropPath}
            alt={`Backdrop de ${movieTitle}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Backdrop no disponible
          </div>
        )}
      </div>

      <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-xl bg-zinc-800">
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={`Poster de ${movieTitle}`}
              fill
              className="object-cover"
              sizes="220px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
              Poster no disponible
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">{movieTitle}</h1>
          <dl className="text-sm text-zinc-300">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Fecha de estreno</dt>
              <dd>{movie.releaseDate || "Fecha desconocida"}</dd>
              <span aria-hidden="true">·</span>
              <dt className="sr-only">Calificacion</dt>
              <dd>⭐ {movie.rating.toFixed(1)}</dd>
            </div>
          </dl>
          <dl className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
            <div>
              <dt className="text-zinc-400">Generos</dt>
              <dd>{genresText}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Duracion</dt>
              <dd>{runtimeText}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Idioma</dt>
              <dd>{languageText}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Votos</dt>
              <dd>{voteCountText}</dd>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-zinc-200 sm:text-base">
            {movie.overview || "No hay sinopsis disponible para esta pelicula."}
          </p>
          {trailerUrl && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Trailer</h2>
              <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
                <iframe
                  src={trailerUrl}
                  title={`Trailer de ${movieTitle}`}
                  className="aspect-video w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </section>
          )}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Cast principal</h2>
            {cast.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {cast.slice(0, 8).map((member) => (
                  <li key={member.id} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
                      {member.profilePath ? (
                        <Image src={member.profilePath} alt={`Foto de ${member.name}`} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">N/A</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-100">{member.name}</p>
                      <p className="truncate text-xs text-zinc-400">{member.character}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">No hay informacion de cast disponible.</p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
