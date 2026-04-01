import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";

type BannerProps = {
  movie: Movie;
};

export function Banner({ movie }: BannerProps) {
  const movieTitle = movie.title || "Sin titulo";
  const movieOverview = movie.overview || "Sin sinopsis disponible para esta pelicula.";
  const fallbackBackdrop = movie.posterPath;
  const imageSrc = movie.backdropPath || fallbackBackdrop;

  return (
    <section aria-labelledby="featured-banner-title" className="glass-surface relative overflow-hidden rounded-2xl">
      <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-[380px]">
        {imageSrc ? (
          <Image src={imageSrc} alt={`Backdrop de ${movieTitle}`} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative z-10 flex h-full items-end p-5 sm:p-7 lg:p-8">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">Pelicula destacada</p>
            <h2 id="featured-banner-title" className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl lg:text-4xl">
              {movieTitle}
            </h2>
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-200 sm:text-base">{movieOverview}</p>
            <Link
              href={`/movie/${movie.id}`}
              className="focus-ring premium-transition accent-button inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg shadow-red-950/40"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
