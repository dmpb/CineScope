const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export function getTmdbBearerToken(): string {
  if (!TMDB_BEARER_TOKEN) {
    throw new Error(
      "Missing TMDB_BEARER_TOKEN. Define it in .env.local before calling TMDb."
    );
  }

  return TMDB_BEARER_TOKEN;
}
