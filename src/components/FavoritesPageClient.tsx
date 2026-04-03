"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FAVORITES_CHANGED_EVENT, readFavoritesFromStorage } from "@/lib/favorites-storage";
import { applyFavoritesSortAndFilter, type FavoritesFilterMode, type FavoritesSortMode } from "@/lib/favorites-display";
import { FavoritesPageHeader } from "@/components/FavoritesPageHeader";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { MovieSection } from "@/components/MovieSection";
import { StateMessage } from "@/components/StateMessage";
import type { Movie } from "@/types/movie";

type FavoritesPageClientProps = {
  hasToken: boolean;
};

export function FavoritesPageClient({ hasToken }: FavoritesPageClientProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  /** Siempre igual en servidor y primer render cliente; la lectura de localStorage va en useEffect. */
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [storedKeysCount, setStoredKeysCount] = useState(0);
  const [sortMode, setSortMode] = useState<FavoritesSortMode>("orden");
  const [filterMode, setFilterMode] = useState<FavoritesFilterMode>("todos");

  const loadFavorites = useCallback(async () => {
    setLoadError(false);
    const keys = readFavoritesFromStorage();
    setStoredKeysCount(keys.length);
    if (keys.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys })
      });
      const data = (await response.json()) as { movies?: Movie[] };
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      setMovies(Array.isArray(data.movies) ? data.movies : []);
    } catch {
      setLoadError(true);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const onChange = () => void loadFavorites();
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [loadFavorites]);

  const displayMovies = useMemo(
    () => applyFavoritesSortAndFilter(movies, filterMode, sortMode),
    [movies, filterMode, sortMode]
  );

  const handleExport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: "CineScope",
      items: movies.map((m) => ({
        key: `${m.mediaType === "tv" ? "tv" : "movie"}:${m.id}`,
        title: m.title,
        releaseDate: m.releaseDate,
        rating: m.rating
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cinescope-favoritos-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [movies]);

  const handleShare = useCallback(async () => {
    const text = movies.map((m) => m.title).join(" · ");
    const title = "Mis favoritos — CineScope";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: text.slice(0, 4000) });
      } else if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${title}\n${text}`);
        window.alert("Lista copiada al portapapeles.");
      }
    } catch {
      /* usuario cancelo o fallo */
    }
  }, [movies]);

  const stripMovie = displayMovies.length > 0 ? displayMovies[Math.min(1, displayMovies.length - 1)] : null;

  const sectionEmptyMessage =
    movies.length === 0 && storedKeysCount > 0
      ? "Tienes favoritos guardados pero no se pudieron cargar desde TMDb. Revisa la conexion o el token, o vuelve a agregarlos."
      : movies.length > 0 && displayMovies.length === 0
        ? "No hay titulos con este filtro. Prueba «Todos» u otro orden."
        : "Aun no tienes favoritos. Usa la estrella en las tarjetas o en la ficha de pelicula o serie.";

  const showGridSkeleton = loading && storedKeysCount > 0;

  return (
    <div className="home-content-container home-content-stack">
      {!hasToken && (
        <StateMessage variant="warning">
          Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
        </StateMessage>
      )}

      {loadError && (
        <StateMessage variant="error">
          Ocurrio un error al cargar tus favoritos desde TMDb. Intenta nuevamente en unos segundos.
        </StateMessage>
      )}

      <>
        <FavoritesPageHeader
          loading={loading}
          allowEmptyCtas={!loadError}
          storedKeysCount={storedKeysCount}
          baseMovieCount={movies.length}
          displayMovies={displayMovies}
          sortMode={sortMode}
          filterMode={filterMode}
          onSortChange={setSortMode}
          onFilterChange={setFilterMode}
          onExport={handleExport}
          onShare={handleShare}
        />

        {!loadError &&
          (showGridSkeleton ? (
            <div className="space-y-4 sm:space-y-5">
              <div className="skeleton-shimmer h-7 w-48 rounded-lg" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx} className="skeleton-shimmer overflow-hidden rounded-xl">
                    <div className="aspect-[2/3] w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-10">
              <MovieSection
                title="Titulos en tu lista"
                headingId="favoritos-grid-heading"
                movies={displayMovies}
                emptyMessage={sectionEmptyMessage}
                layout="grid"
              />
              {stripMovie && <FeaturedStrip movie={stripMovie} label="Destacado de tu lista" />}
            </div>
          ))}
      </>
    </div>
  );
}
