import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { UiMessages } from "@/lib/ui-i18n";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  ui: UiMessages;
};

export function MovieCard({ movie, ui }: MovieCardProps) {
  const movieTitle = movie.title || ui.untitled;
  const movieYear = movie.releaseDate ? movie.releaseDate.slice(0, 4) : ui.cardYearNA;
  const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : ui.cardRuntimeNA;
  const isTv = movie.mediaType === "tv";
  const detailHref = isTv ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <article className="relative">
      <FavoriteButton movieId={movie.id} movieTitle={movieTitle} mediaKind={isTv ? "tv" : "movie"} />
      <Link
        href={detailHref}
        aria-label={ui.cardSeeDetailAria(isTv ? "tv" : "movie", movieTitle)}
        className="focus-ring premium-transition group glass-surface-soft block overflow-hidden rounded-xl hover:-translate-y-1 hover:border-zinc-500 hover:shadow-xl hover:shadow-black/40"
      >
        <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={ui.cardPosterAlt(movieTitle)}
              fill
              loading="lazy"
              className="object-cover premium-transition group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
              {ui.cardPosterMissing}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_0_1px_rgba(239,68,68,0.45),0_0_32px_rgba(239,68,68,0.22)] opacity-0 premium-transition group-hover:opacity-100 group-focus-visible:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 premium-transition group-hover:opacity-100 group-focus-visible:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 premium-transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <p className="line-clamp-1 text-xs font-semibold uppercase tracking-wide text-zinc-100">
              ⭐ {movie.rating.toFixed(1)} · {movieYear}
            </p>
            <p className="line-clamp-2 text-xs leading-relaxed text-zinc-200">{movie.overview || ui.cardOverviewMissing}</p>
          </div>
        </div>

        <div className="space-y-1.5 p-3 sm:p-3.5">
          <h3 className="line-clamp-1 text-sm font-medium text-zinc-100 sm:text-base">{movieTitle}</h3>
          <p className="text-xs text-zinc-400 sm:text-sm">
            {runtimeText} · ⭐ {movie.rating.toFixed(1)}
          </p>
        </div>
      </Link>
    </article>
  );
}
