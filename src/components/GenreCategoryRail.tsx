import Link from "next/link";
import type { MovieGenre } from "@/lib/tmdb";

type GenreCategoryRailProps = {
  genres: MovieGenre[];
  /** Ruta base sin barra final, p. ej. `/movies` o `/series`. */
  basePath: "/movies" | "/series";
  ariaLabel: string;
  browseHint: string;
  /** Si se indica, el enlace correspondiente lleva `aria-current="page"`. */
  activeGenreId?: number;
};

export function GenreCategoryRail({ genres, basePath, ariaLabel, browseHint, activeGenreId }: GenreCategoryRailProps) {
  if (genres.length === 0) {
    return null;
  }

  const hintId = basePath === "/movies" ? "genre-rail-hint-movies" : "genre-rail-hint-series";

  return (
    <nav aria-label={ariaLabel} className="w-full bg-gradient-to-b from-black/80 via-zinc-950/90 to-zinc-950">
      <div className="home-content-container py-2 sm:py-3">
        <p id={hintId} className="sr-only">
          {browseHint}
        </p>
        <ul
          className="horizontal-scroll-row flex-nowrap !snap-none gap-2 sm:gap-2.5"
          role="list"
          aria-describedby={hintId}
        >
          {genres.map((genre) => {
            const href = `${basePath}/genre/${genre.id}`;
            const isActive = activeGenreId === genre.id;
            return (
              <li key={genre.id} className="horizontal-scroll-item shrink-0">
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`focus-ring premium-transition inline-flex items-center rounded-md border px-3 py-2 text-xs font-medium sm:text-sm ${
                    isActive
                      ? "border-red-500/60 bg-red-600/20 text-red-100 shadow-[0_0_0_1px_rgba(229,9,20,0.25)]"
                      : "border-zinc-700/90 bg-zinc-900/80 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/90 hover:text-white"
                  }`}
                >
                  {genre.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
