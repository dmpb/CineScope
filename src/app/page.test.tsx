import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import HomePage from "@/app/page";

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  getTrendingMovies: vi.fn(),
  getPopularMovies: vi.fn(),
  getTopRatedMovies: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from "@/lib/tmdb";

const movieFixture: Movie = {
  id: 1,
  title: "Inception",
  overview: "Dreams.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.2,
  releaseDate: "2010-07-16"
};

describe("HomePage", () => {
  it("renders movie sections with data", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getTrendingMovies).mockResolvedValue([movieFixture]);
    vi.mocked(getPopularMovies).mockResolvedValue([]);
    vi.mocked(getTopRatedMovies).mockResolvedValue([]);

    render(await HomePage());

    expect(screen.getByText("Tendencias de la semana")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("shows token warning when missing", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue(null);
    vi.mocked(getTrendingMovies).mockResolvedValue([]);
    vi.mocked(getPopularMovies).mockResolvedValue([]);
    vi.mocked(getTopRatedMovies).mockResolvedValue([]);

    render(await HomePage());

    expect(screen.getByText(/Falta configurar/)).toBeInTheDocument();
  });
});
