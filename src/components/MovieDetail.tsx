import Image from "next/image";
import type { Movie } from "@/types/movie";

type MovieDetailProps = {
  movie: Movie;
};

export function MovieDetail({ movie }: MovieDetailProps) {
  const movieTitle = movie.title || "Sin titulo";

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
          <p className="text-sm leading-relaxed text-zinc-200 sm:text-base">
            {movie.overview || "No hay sinopsis disponible para esta pelicula."}
          </p>
        </div>
      </div>
    </article>
  );
}
