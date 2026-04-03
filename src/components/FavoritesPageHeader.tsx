"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { FavoritesFilterMode, FavoritesSortMode } from "@/lib/favorites-display";
import type { Movie } from "@/types/movie";

type FavoritesPageHeaderProps = {
  loading: boolean;
  /** Evita CTAs de descubrimiento cuando hay error de carga. */
  allowEmptyCtas: boolean;
  storedKeysCount: number;
  baseMovieCount: number;
  displayMovies: Movie[];
  sortMode: FavoritesSortMode;
  filterMode: FavoritesFilterMode;
  onSortChange: (mode: FavoritesSortMode) => void;
  onFilterChange: (mode: FavoritesFilterMode) => void;
  onExport: () => void;
  onShare: () => void;
};

/** Estrella regular de 5 puntas; trazo con uniones redondeadas para puntas suaves. */
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={`block shrink-0 ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="fill stroke"
      />
    </svg>
  );
}

export function FavoritesPageHeader({
  loading,
  allowEmptyCtas,
  storedKeysCount,
  baseMovieCount,
  displayMovies,
  sortMode,
  filterMode,
  onSortChange,
  onFilterChange,
  onExport,
  onShare
}: FavoritesPageHeaderProps) {
  const counts = useMemo(() => {
    const movies = displayMovies.filter((m) => m.mediaType !== "tv").length;
    const series = displayMovies.filter((m) => m.mediaType === "tv").length;
    return { movies, series, total: displayMovies.length };
  }, [displayMovies]);

  const showEmptyCtas = allowEmptyCtas && !loading && storedKeysCount === 0;
  const showControls = !loading && baseMovieCount > 0;

  const selectClass =
    "focus-ring premium-transition h-10 min-w-[9rem] cursor-pointer appearance-none rounded-lg border border-zinc-700/80 bg-zinc-950/50 px-3 pr-9 text-sm text-zinc-100 hover:border-zinc-600";

  return (
    <header
      className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-red-950/25 px-5 py-6 shadow-lg shadow-black/20 sm:px-8 sm:py-8"
      aria-labelledby="favoritos-page-title"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/40 p-2 text-red-300">
              <StarIcon className="h-[1.35rem] w-[1.35rem] sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0 space-y-2">
              <h1 id="favoritos-page-title" className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                Mis favoritos
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                Los titulos se guardan en este dispositivo (navegador) y los datos se obtienen de{" "}
                <abbr title="The Movie Database" className="cursor-help no-underline">
                  TMDb
                </abbr>
                . En el futuro podras sincronizar o cambiar idioma desde tu cuenta.
              </p>
            </div>
          </div>

          <div
            className="flex flex-col items-stretch gap-2 sm:items-end"
            aria-live="polite"
            aria-busy={loading ? true : undefined}
          >
            {loading && storedKeysCount > 0 ? (
              <div className="space-y-2 text-right">
                <div className="skeleton-shimmer ml-auto h-6 w-32 rounded-md" />
                <div className="skeleton-shimmer ml-auto h-4 w-48 rounded-md" />
              </div>
            ) : (
              <>
                <p className="text-right text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-100">{counts.total}</span>{" "}
                  {counts.total === 1 ? "titulo" : "titulos"}
                  {counts.total > 0 && (
                    <span className="block text-xs text-zinc-500 sm:inline sm:ml-2 sm:before:content-['·_']">
                      {counts.movies} peliculas · {counts.series} series
                    </span>
                  )}
                </p>
                {storedKeysCount > 0 && counts.total === 0 && !loading && (
                  <p className="text-right text-xs text-amber-200/90">
                    {storedKeysCount} guardados en este dispositivo; pendiente de cargar desde TMDb.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {showEmptyCtas && (
          <nav aria-label="Descubrir contenido" className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/movies"
              className="focus-ring premium-transition rounded-lg border border-zinc-600 bg-zinc-900/60 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:border-red-500/50 hover:bg-red-950/30"
            >
              Explorar peliculas
            </Link>
            <Link
              href="/series"
              className="focus-ring premium-transition rounded-lg border border-zinc-600 bg-zinc-900/60 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:border-red-500/50 hover:bg-red-950/30"
            >
              Explorar series
            </Link>
            <Link
              href="/search"
              className="focus-ring premium-transition rounded-lg border border-red-500/40 bg-red-950/20 px-4 py-2.5 text-sm font-medium text-red-100 hover:bg-red-950/40"
            >
              Buscar
            </Link>
          </nav>
        )}

        {showControls && (
          <div
            role="group"
            aria-label="Ordenar, filtrar y exportar favoritos"
            className="flex flex-col gap-3 border-t border-zinc-800/80 pt-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex min-w-[10rem] flex-col gap-1">
                <label htmlFor="favoritos-filter" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Tipo
                </label>
                <select
                  id="favoritos-filter"
                  value={filterMode}
                  onChange={(e) => onFilterChange(e.target.value as FavoritesFilterMode)}
                  className={selectClass}
                >
                  <option value="todos">Todos</option>
                  <option value="movie">Solo peliculas</option>
                  <option value="tv">Solo series</option>
                </select>
              </div>
              <div className="flex min-w-[11rem] flex-col gap-1">
                <label htmlFor="favoritos-sort" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  Orden
                </label>
                <select
                  id="favoritos-sort"
                  value={sortMode}
                  onChange={(e) => onSortChange(e.target.value as FavoritesSortMode)}
                  className={selectClass}
                >
                  <option value="orden">Orden guardado</option>
                  <option value="titulo">Titulo (A-Z)</option>
                  <option value="valoracion">Valoracion (mayor)</option>
                  <option value="estreno">Fecha de estreno</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={onExport}
                className="focus-ring premium-transition rounded-lg border border-zinc-600 bg-zinc-900/70 px-3 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-400"
              >
                Exportar JSON
              </button>
              <button
                type="button"
                onClick={onShare}
                className="focus-ring premium-transition rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm font-medium text-red-100 hover:bg-red-950/50"
              >
                Compartir lista
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
