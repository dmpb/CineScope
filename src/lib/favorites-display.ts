import type { Movie } from "@/types/movie";

export type FavoritesFilterMode = "todos" | "movie" | "tv";
export type FavoritesSortMode = "orden" | "titulo" | "valoracion" | "estreno";

export function applyFavoritesSortAndFilter(
  list: Movie[],
  filter: FavoritesFilterMode,
  sort: FavoritesSortMode
): Movie[] {
  let out = [...list];
  if (filter === "movie") {
    out = out.filter((m) => m.mediaType !== "tv");
  } else if (filter === "tv") {
    out = out.filter((m) => m.mediaType === "tv");
  }

  if (sort === "orden") {
    return out;
  }
  if (sort === "titulo") {
    return out.sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }));
  }
  if (sort === "valoracion") {
    return out.sort((a, b) => b.rating - a.rating);
  }
  if (sort === "estreno") {
    return out.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
  }
  return out;
}
