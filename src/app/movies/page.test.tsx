import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import MoviesPage from "@/app/movies/page";
import type { MoviesPageData } from "@/lib/home";

vi.mock("@/lib/tmdb-language-server", () => ({
  resolveTmdbLanguageForRequest: vi.fn().mockResolvedValue("es-ES")
}));

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/home", () => ({
  getMoviesPageData: vi.fn(),
  buildMoviesRowSections: vi.fn(),
  selectMoviesStripMovies: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildMoviesRowSections, getMoviesPageData, selectMoviesStripMovies } from "@/lib/home";

const movieFixture: Movie = {
  id: 1,
  mediaType: "movie",
  title: "Inception",
  overview: "Dreams.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.2,
  releaseDate: "2010-07-16",
  genres: [],
  runtime: 0,
  language: "",
  voteCount: 0
};

const moviesPageDataFixture: MoviesPageData = {
  trending: [movieFixture],
  popular: [],
  topRated: [],
  nowPlaying: [],
  upcoming: [],
  genreSections: [],
  featuredSlides: [
    {
      movie: { ...movieFixture, genres: ["Action"], runtime: 148 },
      trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
    }
  ],
  hasError: false
};

describe("MoviesPage", () => {
  it("renders movies content", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getMoviesPageData).mockResolvedValue(moviesPageDataFixture);
    vi.mocked(buildMoviesRowSections).mockReturnValue([
      {
        key: "trending-movies",
        title: "Tendencias de peliculas",
        movies: [movieFixture],
        emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
      }
    ]);
    vi.mocked(selectMoviesStripMovies).mockReturnValue([]);

    render(await MoviesPage());

    expect(screen.getByText("Película destacada")).toBeInTheDocument();
    expect(screen.getByText("Tendencias de peliculas")).toBeInTheDocument();
  });

  it("shows warning when token is missing", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue(null);
    vi.mocked(getMoviesPageData).mockResolvedValue({ ...moviesPageDataFixture, featuredSlides: [], trending: [] });
    vi.mocked(buildMoviesRowSections).mockReturnValue([]);
    vi.mocked(selectMoviesStripMovies).mockReturnValue([]);

    render(await MoviesPage());
    expect(screen.getByText(/Falta configurar/)).toBeInTheDocument();
  });
});
