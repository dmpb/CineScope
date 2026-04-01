import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";

type FeaturedStripProps = {
  movie: Movie;
  label?: string;
};

export function FeaturedStrip({ movie, label = "Recomendacion destacada" }: FeaturedStripProps) {
  const movieTitle = movie.title || "Sin titulo";
  const imageSrc = movie.backdropPath || movie.posterPath;

  return (
    <section aria-labelledby={`strip-${movie.id}`} className="glass-surface relative overflow-hidden rounded-2xl">
      <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]">
        {imageSrc ? (
          <Image src={imageSrc} alt={`Imagen destacada de ${movieTitle}`} fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="relative z-10 flex h-full items-center px-5 py-6 sm:px-6 sm:py-8">
          <div className="max-w-xl space-y-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">{label}</p>
            <h3 id={`strip-${movie.id}`} className="text-xl font-semibold text-zinc-100 sm:text-2xl">
              {movieTitle}
            </h3>
            <p className="line-clamp-2 text-sm text-zinc-200">{movie.overview || "Descubre mas de este titulo destacado."}</p>
            <Link
              href={`/movie/${movie.id}`}
              className="focus-ring premium-transition inline-flex items-center rounded-md border border-zinc-300/40 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-100 hover:border-zinc-100/70 hover:bg-black/55"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
