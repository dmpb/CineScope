import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SearchResult } from "@/types/movie";
import SearchPage from "@/app/search/page";

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  searchMedia: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { searchMedia } from "@/lib/tmdb";

const searchFixture: SearchResult = {
  results: [
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker learns reality is a simulation.",
      posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
      backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
      rating: 8.5,
      releaseDate: "1999-03-31",
      genres: [],
      runtime: 0,
      language: "",
      voteCount: 0
    }
  ],
  totalResults: 1,
  currentPage: 1,
  totalPages: 1
};

describe("Search page", () => {
  it("shows prompt when query is empty", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");

    render(await SearchPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText(/Ingresa un termino/)).toBeInTheDocument();
  });

  it("renders query results", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(searchMedia).mockResolvedValue(searchFixture);

    render(await SearchPage({ searchParams: Promise.resolve({ q: "matrix" }) }));

    expect(screen.getByText(/Resultados para "matrix"/)).toBeInTheDocument();
    expect(screen.getByText("1 resultado")).toBeInTheDocument();
    expect(screen.getByText("The Matrix")).toBeInTheDocument();
  });
});
