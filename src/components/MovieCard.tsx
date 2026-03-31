import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const movieTitle = movie.title || "Sin titulo";

  return (
    <article className="relative">
      <FavoriteButton movieId={movie.id} movieTitle={movieTitle} />
      <Link
        href={`/movie/${movie.id}`}
        aria-label={`Ver detalle de ${movieTitle}`}
        className="focus-ring group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 transition duration-300 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/40"
      >
        <div className="relative aspect-[2/3] w-full bg-zinc-800">
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={`Poster de ${movieTitle}`}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
              Poster no disponible
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <p className="line-clamp-3 text-xs leading-relaxed text-zinc-200">{movie.overview || "Sinopsis no disponible."}</p>
          </div>
        </div>

        <div className="space-y-1.5 p-3 sm:p-3.5">
          <h3 className="line-clamp-1 text-sm font-medium text-zinc-100 sm:text-base">{movieTitle}</h3>
          <p className="text-xs text-zinc-400 sm:text-sm">
            {movie.releaseDate || "Fecha desconocida"} · ⭐ {movie.rating.toFixed(1)}
          </p>
        </div>
      </Link>
    </article>
  );
}
