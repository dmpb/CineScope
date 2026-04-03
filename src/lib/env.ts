const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

/**
 * Idioma de textos TMDb (param `language` en la API v3): titulos, sinopsis, generos.
 * Por defecto es-ES; mas adelante puede sustituirse por preferencia de usuario (cookie / cuenta).
 */
const TMDB_LANGUAGE_DEFAULT = "es-ES";

/** Region para cartelera / proximos estrenos (ISO 3166-1), p. ej. ES o US. */
const TMDB_REGION_DEFAULT = "ES";

export function getOptionalTmdbBearerToken(): string | null {
  return TMDB_BEARER_TOKEN?.trim() ? TMDB_BEARER_TOKEN : null;
}

export function getTmdbLanguage(): string {
  const raw = process.env.TMDB_LANGUAGE?.trim();
  return raw && raw.length > 0 ? raw : TMDB_LANGUAGE_DEFAULT;
}

export function getTmdbRegion(): string {
  const raw = process.env.TMDB_REGION?.trim();
  return raw && raw.length > 0 ? raw : TMDB_REGION_DEFAULT;
}

export function getTmdbBearerToken(): string {
  const token = getOptionalTmdbBearerToken();
  if (!token) {
    throw new Error(
      "Missing TMDB_BEARER_TOKEN. Define it in .env.local before calling TMDb."
    );
  }

  return token;
}
