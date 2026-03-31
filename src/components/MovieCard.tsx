import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  const movieTitle = movie.title || "Sin titulo";

  return (
    <Link
      href={`/movie/${movie.id}`}
      aria-label={`Ver detalle de ${movieTitle}`}
      className="focus-ring group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="relative aspect-[2/3] w-full bg-zinc-800">
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={`Poster de ${movieTitle}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
            Poster no disponible
          </div>
        )}
      </div>

      <div className="space-y-1.5 p-3 sm:p-3.5">
        <h3 className="line-clamp-1 text-sm font-medium text-zinc-100 sm:text-base">{movieTitle}</h3>
        <p className="text-xs text-zinc-400 sm:text-sm">
          {movie.releaseDate || "Fecha desconocida"} · ⭐ {movie.rating.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
