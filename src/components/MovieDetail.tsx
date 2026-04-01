import Image from "next/image";
import { CastScroller } from "@/components/CastScroller";
import { TrailerModal } from "@/components/TrailerModal";
import type { CastMember, Movie } from "@/types/movie";

type MovieDetailProps = {
  movie: Movie;
  trailerUrl?: string | null;
  cast?: CastMember[];
};

export function MovieDetail({ movie, trailerUrl = null, cast = [] }: MovieDetailProps) {
  const movieTitle = movie.title || "Sin titulo";
  const originalTitleText = movie.originalTitle && movie.originalTitle !== movieTitle ? movie.originalTitle : null;
  const taglineText = movie.tagline?.trim() || null;
  const genresText = movie.genres.length > 0 ? movie.genres.join(", ") : "No disponible";
  const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : "No disponible";
  const languageText = movie.language ? movie.language.toUpperCase() : "No disponible";
  const voteCountText = movie.voteCount > 0 ? new Intl.NumberFormat("es-ES").format(movie.voteCount) : "Sin votos";
  const popularityText = typeof movie.popularity === "number" && movie.popularity > 0 ? movie.popularity.toFixed(1) : "No disponible";
  const statusText = movie.status?.trim() || "No disponible";
  const countriesText =
    Array.isArray(movie.productionCountries) && movie.productionCountries.length > 0
      ? movie.productionCountries.join(", ")
      : "No disponible";
  const imageSrc = movie.backdropPath || movie.posterPath;

  return (
    <article className="relative min-h-[72vh] overflow-hidden bg-zinc-900">
      {imageSrc ? (
        <Image src={imageSrc} alt={`Backdrop de ${movieTitle}`} fill className="object-cover" priority sizes="100vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">Backdrop no disponible</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/78 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

      <div className="relative z-10 flex min-h-[72vh] w-full items-end px-4 pb-10 pt-24 sm:px-6 lg:px-10">
        <div className="grid w-full gap-6 md:grid-cols-[280px_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-800 shadow-xl shadow-black/50">
            {movie.posterPath ? (
              <Image src={movie.posterPath} alt={`Poster de ${movieTitle}`} fill className="object-cover" sizes="280px" />
            ) : (
              <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">Poster no disponible</div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-5 overflow-hidden">
            <h1 className="text-3xl font-semibold text-zinc-100 sm:text-4xl lg:text-5xl">{movieTitle}</h1>
            {originalTitleText && <p className="text-sm text-zinc-300">Titulo original: {originalTitleText}</p>}
            {taglineText && <p className="text-sm italic text-zinc-300">"{taglineText}"</p>}
            <dl className="text-sm text-zinc-300">
              <div className="flex flex-wrap items-center gap-2">
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
              <div>
                <dt className="text-zinc-400">Estado</dt>
                <dd>{statusText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Popularidad</dt>
                <dd>{popularityText}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-400">Paises de produccion</dt>
                <dd>{countriesText}</dd>
              </div>
            </dl>
            <p className="w-full text-sm leading-relaxed text-zinc-200 sm:text-base">
              {movie.overview || "No hay sinopsis disponible para esta pelicula."}
            </p>
            <div className="flex flex-wrap gap-3">
              <TrailerModal trailerUrl={trailerUrl} movieTitle={movieTitle} />
            </div>
            <section className="space-y-2">
              {cast.length > 0 ? (
                <CastScroller cast={cast} />
              ) : (
                <p className="text-sm text-zinc-400">No hay informacion de cast disponible.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
