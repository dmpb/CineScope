/**
 * Constantes y utilidades de idioma TMDb seguras para cliente y servidor.
 * No importar `next/headers` aquí: los Client Components dependen de este módulo.
 */

/** Cookie HTTP (persistente tras recargar; el servidor la envía en /api y RSC). */
export const TMDB_USER_LANGUAGE_COOKIE = "cinescope_tmdb_lang";

/**
 * Códigos `language` admitidos por la API v3 de TMDb (alcance MVP: ES España, ES Latinoamérica, inglés US).
 * Solo valores de esta lista se aceptan desde la cookie para evitar inyección en query.
 */
export const TMDB_LANGUAGE_OPTIONS: ReadonlyArray<{ code: string; label: string }> = [
  { code: "es-ES", label: "Español (España)" },
  { code: "es-MX", label: "Español (Latinoamérica)" },
  { code: "en-US", label: "English" }
];

const ALLOWED_CODES = new Set(TMDB_LANGUAGE_OPTIONS.map((o) => o.code));

export function isAllowedTmdbLanguage(value: string): boolean {
  return ALLOWED_CODES.has(value);
}

/** `lang` en <html> (BCP 47 simplificado). */
export function tmdbLanguageToHtmlLang(code: string): string {
  const base = code.split("-")[0]?.trim().toLowerCase();
  return base && /^[a-z]{2}$/.test(base) ? base : "es";
}
