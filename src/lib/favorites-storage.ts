export const FAVORITES_STORAGE_KEY = "cinescope:favorites";

/** Misma pestaña: `storage` no dispara al escribir; usamos este evento para refrescar listas. */
export const FAVORITES_CHANGED_EVENT = "cinescope:favorites-changed";

export type FavoriteMediaKind = "movie" | "tv";

export function parseFavoriteKey(item: unknown): string | null {
  if (typeof item === "string" && /^(movie|tv):\d+$/.test(item)) {
    return item;
  }
  if (typeof item === "number" && Number.isInteger(item) && item > 0) {
    return `movie:${item}`;
  }
  return null;
}

export function toFavoriteKey(mediaKind: FavoriteMediaKind, id: number): string {
  return `${mediaKind}:${id}`;
}

export function parseKeyToMediaRef(key: string): { kind: FavoriteMediaKind; id: number } | null {
  const match = /^(movie|tv):(\d+)$/.exec(key.trim());
  if (!match) {
    return null;
  }
  const id = Number(match[2]);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return { kind: match[1] as FavoriteMediaKind, id };
}

export function readFavoritesFromStorage(): string[] {
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
    return parsed.map(parseFavoriteKey).filter((key): key is string => key != null);
  } catch {
    return [];
  }
}

export function writeFavoritesToStorage(favorites: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}
