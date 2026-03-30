import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import MoviePage from "@/app/movie/[id]/page";

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  getMovieById: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getMovieById } from "@/lib/tmdb";

const movieFixture: Movie = {
  id: 1,
  title: "Interstellar",
  overview: "Space travel.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.7,
  releaseDate: "2014-11-07"
};

describe("Movie detail page", () => {
  it("renders movie detail for valid id", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getMovieById).mockResolvedValue(movieFixture);

    render(await MoviePage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  it("shows invalid id fallback", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");

    render(await MoviePage({ params: Promise.resolve({ id: "abc" }) }));

    expect(screen.getByText(/no es valido/i)).toBeInTheDocument();
  });
});
