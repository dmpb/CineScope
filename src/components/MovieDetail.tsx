import Image from "next/image";
import type { Movie } from "@/types/movie";

type MovieDetailProps = {
  movie: Movie;
};

export function MovieDetail({ movie }: MovieDetailProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="relative aspect-[21/9] w-full bg-zinc-800">
        {movie.backdropPath ? (
          <Image
            src={movie.backdropPath}
            alt={`Backdrop de ${movie.title || "pelicula"}`}
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

      <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-lg bg-zinc-800">
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={movie.title || "Poster de pelicula"}
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

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-zinc-100">{movie.title || "Sin titulo"}</h1>
          <p className="text-sm text-zinc-300">
            {movie.releaseDate || "Fecha desconocida"} · ⭐ {movie.rating.toFixed(1)}
          </p>
          <p className="leading-relaxed text-zinc-200">
            {movie.overview || "No hay sinopsis disponible para esta pelicula."}
          </p>
        </div>
      </div>
    </article>
  );
}
