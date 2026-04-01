"use client";

import { useEffect, useMemo, useState } from "react";

const FAVORITES_STORAGE_KEY = "cinescope:favorites";

function readFavorites(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => Number.isInteger(item)) : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: number[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

type FavoriteButtonProps = {
  movieId: number;
  movieTitle: string;
};

export function FavoriteButton({ movieId, movieTitle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const label = useMemo(
    () => (isFavorite ? `Quitar ${movieTitle} de favoritos` : `Agregar ${movieTitle} a favoritos`),
    [isFavorite, movieTitle]
  );

  useEffect(() => {
    const favorites = readFavorites();
    setIsFavorite(favorites.includes(movieId));
  }, [movieId]);

  useEffect(() => {
    const onStorage = () => {
      const favorites = readFavorites();
      setIsFavorite(favorites.includes(movieId));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [movieId]);

  function toggleFavorite() {
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(movieId) ? favorites.filter((id) => id !== movieId) : [...favorites, movieId];
    writeFavorites(nextFavorites);
    setIsFavorite(nextFavorites.includes(movieId));
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
      className={`focus-ring premium-transition absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm text-zinc-100 backdrop-blur ${
        isFavorite
          ? "border-red-400/80 bg-red-900/70 shadow-lg shadow-red-950/40"
          : "border-zinc-700/80 bg-black/60 hover:border-zinc-500 hover:bg-black/80"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
    >
      <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
    </button>
  );
}
