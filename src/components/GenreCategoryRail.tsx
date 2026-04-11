"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
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

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 15 7.5 10l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GenreCategoryRail({ genres, basePath, ariaLabel, browseHint, activeGenreId }: GenreCategoryRailProps) {
  const ui = useUiMessages();
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = listRef.current;
    if (!el) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) {
      return;
    }
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [genres, updateScrollState]);

  const scrollByDirection = useCallback((direction: -1 | 1) => {
    const el = listRef.current;
    if (!el) {
      return;
    }
    const distance = Math.max(160, Math.floor(el.clientWidth * 0.75)) * direction;
    const prefersReduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: distance, behavior: prefersReduce ? "auto" : "smooth" });
    window.requestAnimationFrame(() => updateScrollState());
  }, [updateScrollState]);

  if (genres.length === 0) {
    return null;
  }

  const hintId = basePath === "/movies" ? "genre-rail-hint-movies" : "genre-rail-hint-series";

  const scrollBtnClass =
    "focus-ring premium-transition flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-600/90 bg-zinc-950/90 text-zinc-200 shadow-md backdrop-blur-sm hover:border-zinc-400 hover:bg-zinc-900 hover:text-white disabled:pointer-events-none disabled:opacity-25 sm:h-10 sm:w-10";

  return (
    <nav aria-label={ariaLabel} className="w-full bg-gradient-to-b from-black/80 via-zinc-950/90 to-zinc-950">
      <div className="home-content-container py-2 sm:py-3">
        <p id={hintId} className="sr-only">
          {browseHint}
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2" aria-describedby={hintId}>
          <button
            type="button"
            className={scrollBtnClass}
            aria-label={ui.genreRailScrollPrev}
            disabled={!canScrollPrev}
            onClick={() => scrollByDirection(-1)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <ul ref={listRef} className="genre-rail-scroll flex-1" role="list">
            {genres.map((genre) => {
              const href = `${basePath}/genre/${genre.id}`;
              const isActive = activeGenreId === genre.id;
              return (
                <li key={genre.id} className="shrink-0">
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

          <button
            type="button"
            className={scrollBtnClass}
            aria-label={ui.genreRailScrollNext}
            disabled={!canScrollNext}
            onClick={() => scrollByDirection(1)}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
