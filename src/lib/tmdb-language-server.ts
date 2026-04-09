import { cookies } from "next/headers";
import { cache } from "react";
import { getTmdbLanguage } from "@/lib/env";
import {
  isAllowedTmdbLanguage,
  TMDB_LANGUAGE_OPTIONS,
  TMDB_USER_LANGUAGE_COOKIE
} from "@/lib/tmdb-language";

/**
 * Idioma efectivo para peticiones TMDb: cookie validada del usuario, o `getTmdbLanguage()` (env / defecto).
 * Solo importar desde Server Components, Route Handlers o `tmdb.ts` (servidor).
 * Memoizado por request (React `cache`). Fuera de request Next, hace fallback sin lanzar.
 */
export const resolveTmdbLanguageForRequest = cache(async (): Promise<string> => {
  try {
    const store = await cookies();
    const raw = store.get(TMDB_USER_LANGUAGE_COOKIE)?.value?.trim();
    if (raw && isAllowedTmdbLanguage(raw)) {
      return raw;
    }
  } catch {
    /* fuera de request */
  }
  const fromEnv = getTmdbLanguage();
  return isAllowedTmdbLanguage(fromEnv) ? fromEnv : TMDB_LANGUAGE_OPTIONS[0].code;
});
