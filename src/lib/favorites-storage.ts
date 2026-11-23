export const FAVORITES_STORAGE_KEY = "cinescope:favorites";

/** Misma pestaña: `storage` no dispara al escribir; usamos este evento para refrescar listas. */
export const FAVORITES_CHANGED_EVENT = "cinescope:favorites-changed";

/** Cookie leída en servidor para personalizar home (ids compuestos, máx. 8). */
export const TASTE_COOKIE = "cinescope_taste";

const TASTE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;
const TASTE_MAX_KEYS = 8;

export type FavoriteMediaKind = "movie" | "tv";

export function parseFavoriteKey(item: unknown): string | null {
  if (typeof item === "string" && /^(movie|tv):\d+$/.test(item)) {
    return item;
  }
  if (typeof item === "number" && Number.isInteger(item) && item > 0) {
    return `movie:${item}`;
  }
  // Migración desde entradas `{ key, status }` de la fase 2.
  if (item !== null && typeof item === "object" && "key" in item) {
    return parseFavoriteKey((item as { key?: unknown }).key);
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

function dedupeKeysPreserveOrder(keys: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const key of keys) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function syncTasteCookieFromKeys(keys: string[]): void {
  if (typeof document === "undefined") {
    return;
  }
  const value = keys
    .slice(0, TASTE_MAX_KEYS)
    .filter((key) => parseKeyToMediaRef(key) != null)
    .join(",");
  document.cookie = `${TASTE_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${TASTE_COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
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
    return dedupeKeysPreserveOrder(parsed.map(parseFavoriteKey).filter((key): key is string => key != null));
  } catch {
    return [];
  }
}

export function writeFavoritesToStorage(favorites: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = dedupeKeysPreserveOrder(
    favorites.map(parseFavoriteKey).filter((key): key is string => key != null)
  );
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalized));
  syncTasteCookieFromKeys(normalized);
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
}
