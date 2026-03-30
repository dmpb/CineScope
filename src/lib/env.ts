const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

export function getOptionalTmdbBearerToken(): string | null {
  return TMDB_BEARER_TOKEN?.trim() ? TMDB_BEARER_TOKEN : null;
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
