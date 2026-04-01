import Image from "next/image";
import Link from "next/link";
import { TrailerModal } from "@/components/TrailerModal";
import type { Movie } from "@/types/movie";

type BannerProps = {
  movie: Movie;
  trailerUrl?: string | null;
};

export function Banner({ movie, trailerUrl = null }: BannerProps) {
  const movieTitle = movie.title || "Sin titulo";
  const movieOverview = movie.overview || "Sin sinopsis disponible para esta pelicula.";
  const fallbackBackdrop = movie.posterPath;
  const imageSrc = movie.backdropPath || fallbackBackdrop;
  const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : "Duracion N/D";
  const genresText = movie.genres.length > 0 ? movie.genres.slice(0, 3).join(" · ") : "Genero N/D";

  return (
    <section aria-labelledby="featured-banner-title" className="relative min-h-[72vh] overflow-hidden">
      <div className="relative h-[72vh] min-h-[460px] max-h-[860px] w-full">
        {imageSrc ? (
          <Image src={imageSrc} alt={`Backdrop de ${movieTitle}`} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/30 to-transparent" />

        <div className="home-content-container relative z-10 flex h-full items-end pb-12">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">Pelicula destacada</p>
            <h2 id="featured-banner-title" className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
              {movieTitle}
            </h2>
            <p className="text-sm text-zinc-200 sm:text-base">
              ⭐ {movie.rating.toFixed(1)} · {runtimeText} · {genresText}
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-200 sm:max-w-2xl sm:text-base">{movieOverview}</p>
            <div className="flex flex-wrap items-center gap-3">
              <TrailerModal trailerUrl={trailerUrl} movieTitle={movieTitle} />
              <Link
                href={`/movie/${movie.id}`}
                className="focus-ring premium-transition accent-button inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg shadow-red-950/40"
              >
                Ver detalle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
