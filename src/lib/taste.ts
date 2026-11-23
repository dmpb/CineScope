import { parseKeyToMediaRef, TASTE_COOKIE } from "@/lib/favorites-storage";

export { TASTE_COOKIE };

/** Parsea la cookie `cinescope_taste` (keys `movie:1,tv:2`) en refs válidos. */
export function parseTasteCookieValue(raw: string | undefined | null): Array<{ kind: "movie" | "tv"; id: number; key: string }> {
  if (!raw?.trim()) {
    return [];
  }
  let decoded = raw.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* valor ya decodificado */
  }
  const out: Array<{ kind: "movie" | "tv"; id: number; key: string }> = [];
  const seen = new Set<string>();
  for (const part of decoded.split(",")) {
    const key = part.trim();
    const ref = parseKeyToMediaRef(key);
    if (!ref || seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push({ ...ref, key });
  }
  return out.slice(0, 8);
}
