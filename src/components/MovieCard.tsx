import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700"
    >
      <div className="relative aspect-[2/3] w-full bg-zinc-800">
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={movie.title || "Poster de pelicula"}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
            Poster no disponible
          </div>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-zinc-100">{movie.title || "Sin titulo"}</h3>
        <p className="text-xs text-zinc-400">
          {movie.releaseDate || "Fecha desconocida"} · ⭐ {movie.rating.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}
