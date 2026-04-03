import { describe, expect, it } from "vitest";
import { applyFavoritesSortAndFilter } from "@/lib/favorites-display";
import type { Movie } from "@/types/movie";

const base = (overrides: Partial<Movie>): Movie => ({
  id: 1,
  title: "A",
  overview: "",
  posterPath: "",
  backdropPath: "",
  rating: 7,
  releaseDate: "2020-01-01",
  genres: [],
  runtime: 0,
  language: "",
  voteCount: 0,
  ...overrides
});

describe("applyFavoritesSortAndFilter", () => {
  it("filters by movie vs tv", () => {
    const list = [base({ id: 1, mediaType: "movie" }), base({ id: 2, mediaType: "tv" })];
    const moviesOnly = applyFavoritesSortAndFilter(list, "movie", "orden");
    expect(moviesOnly).toHaveLength(1);
    expect(moviesOnly[0]?.mediaType).not.toBe("tv");
  });

  it("sorts by title", () => {
    const list = [base({ id: 1, title: "Z" }), base({ id: 2, title: "A" })];
    const sorted = applyFavoritesSortAndFilter(list, "todos", "titulo");
    expect(sorted.map((m) => m.title)).toEqual(["A", "Z"]);
  });
});
