import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import MoviePage from "@/app/movie/[id]/page";

vi.mock("@/lib/tmdb-language-server", () => ({
  resolveTmdbLanguageForRequest: vi.fn().mockResolvedValue("es-ES")
}));

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  getMovieById: vi.fn(),
  getMovieTrailerById: vi.fn(),
  getMovieCastById: vi.fn(),
  getMovieCrewHighlightsById: vi.fn(),
  getMovieWatchProvidersById: vi.fn(),
  getMovieImagesById: vi.fn(),
  getSimilarMoviesById: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
  getMovieById,
  getMovieCastById,
  getMovieCrewHighlightsById,
  getMovieImagesById,
  getMovieTrailerById,
  getMovieWatchProvidersById,
  getSimilarMoviesById
} from "@/lib/tmdb";

const movieFixture: Movie = {
  id: 1,
  title: "Interstellar",
  overview: "Space travel.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.7,
  releaseDate: "2014-11-07",
  genres: ["Adventure", "Science Fiction"],
  runtime: 169,
  language: "en",
  voteCount: 39000
};

describe("Movie detail page", () => {
  it("renders movie detail for valid id", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getMovieById).mockResolvedValue(movieFixture);
    vi.mocked(getMovieTrailerById).mockResolvedValue("https://www.youtube.com/embed/zSWdZVtXT7E");
    vi.mocked(getMovieCastById).mockResolvedValue([
      {
        id: 10,
        name: "Matthew McConaughey",
        character: "Cooper",
        profilePath: "https://image.tmdb.org/t/p/original/m.jpg"
      }
    ]);
    vi.mocked(getMovieCrewHighlightsById).mockResolvedValue({
      directors: ["Christopher Nolan"],
      writers: ["Jonathan Nolan", "Christopher Nolan"]
    });
    vi.mocked(getMovieWatchProvidersById).mockResolvedValue([{ id: 8, name: "Netflix", logoPath: "https://image.tmdb.org/t/p/original/a.png", category: "flatrate" }]);
    vi.mocked(getMovieImagesById).mockResolvedValue(["https://image.tmdb.org/t/p/original/c.jpg"]);
    vi.mocked(getSimilarMoviesById).mockResolvedValue([
      {
        ...movieFixture,
        id: 2,
        title: "The Martian"
      }
    ]);

    render(await MoviePage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Adventure, Science Fiction")).toBeInTheDocument();
    expect(screen.getByText("169 min")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver tráiler" })).toBeInTheDocument();
    expect(screen.getByText("Christopher Nolan")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("Matthew McConaughey")).toBeInTheDocument();
    expect(screen.getByText('Similares a "Interstellar"')).toBeInTheDocument();
    expect(screen.getByText("The Martian")).toBeInTheDocument();
  });

  it("shows empty similar message when related list is empty", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getMovieById).mockResolvedValue(movieFixture);
    vi.mocked(getMovieTrailerById).mockResolvedValue(null);
    vi.mocked(getMovieCastById).mockResolvedValue([]);
    vi.mocked(getMovieCrewHighlightsById).mockResolvedValue({ directors: [], writers: [] });
    vi.mocked(getMovieWatchProvidersById).mockResolvedValue([]);
    vi.mocked(getMovieImagesById).mockResolvedValue([]);
    vi.mocked(getSimilarMoviesById).mockResolvedValue([]);

    render(await MoviePage({ params: Promise.resolve({ id: "1" }) }));

    expect(screen.getByText(/No se encontraron películas similares relevantes/i)).toBeInTheDocument();
  });

  it("shows invalid id fallback", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");

    render(await MoviePage({ params: Promise.resolve({ id: "abc" }) }));

    expect(screen.getByText(/no es válido/i)).toBeInTheDocument();
  });
});
