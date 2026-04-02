"use client";

import { useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "cinescope:favorites";

type MediaKind = "movie" | "tv";
type FavoriteKey = string;

function parseFavoriteKey(item: unknown): FavoriteKey | null {
  if (typeof item === "string" && /^(movie|tv):\d+$/.test(item)) {
    return item;
  }
  if (typeof item === "number" && Number.isInteger(item) && item > 0) {
    return `movie:${item}`;
  }
  return null;
}

function toFavoriteKey(mediaKind: MediaKind, id: number): FavoriteKey {
  return `${mediaKind}:${id}`;
}

function readFavorites(): FavoriteKey[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(parseFavoriteKey).filter((key): key is FavoriteKey => key != null);
  } catch {
    return [];
  }
}

function writeFavorites(favorites: FavoriteKey[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

type FavoriteButtonProps = {
  movieId: number;
  movieTitle: string;
  /** Por defecto `movie`. Usar `tv` en fichas de serie para evitar colisión de IDs con películas. */
  mediaKind?: MediaKind;
  variant?: "card" | "inline";
};

export function FavoriteButton({ movieId, movieTitle, mediaKind = "movie", variant = "card" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const favoriteKey = useMemo(() => toFavoriteKey(mediaKind, movieId), [mediaKind, movieId]);
  const label = useMemo(
    () => (isFavorite ? `Quitar ${movieTitle} de favoritos` : `Agregar ${movieTitle} a favoritos`),
    [isFavorite, movieTitle]
  );

  useEffect(() => {
    const favorites = readFavorites();
    setIsFavorite(favorites.includes(favoriteKey));
  }, [favoriteKey]);

  useEffect(() => {
    const onStorage = () => {
      const favorites = readFavorites();
      setIsFavorite(favorites.includes(favoriteKey));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [favoriteKey]);

  function toggleFavorite() {
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(favoriteKey)
      ? favorites.filter((key) => key !== favoriteKey)
      : [...favorites, favoriteKey];
    writeFavorites(nextFavorites);
    setIsFavorite(nextFavorites.includes(favoriteKey));
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 180);
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite();
      }}
      className={`focus-ring premium-transition inline-flex items-center justify-center border text-sm text-zinc-100 backdrop-blur ${
        variant === "card" ? "absolute right-2 top-2 z-20 h-8 w-8 rounded-full" : "h-10 rounded-lg px-3"
      } ${
        isFavorite
          ? "border-red-400/80 bg-red-900/70 shadow-lg shadow-red-950/40"
          : "border-zinc-700/80 bg-black/60 hover:border-zinc-500 hover:bg-black/80"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
    >
      <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
      {variant === "inline" && <span className="ml-2 text-xs font-medium">{isFavorite ? "En favoritos" : "Favorito"}</span>}
    </button>
  );
}
