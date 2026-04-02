import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import HomePage from "@/app/page";
import type { HomeData } from "@/lib/home";

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/home", () => ({
  getHomeData: vi.fn(),
  buildHomeRowSections: vi.fn(),
  selectHomeStripMovies: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildHomeRowSections, getHomeData, selectHomeStripMovies } from "@/lib/home";

const movieFixture: Movie = {
  id: 1,
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

const homeDataFixture: HomeData = {
  trending: [movieFixture],
  popular: [],
  topRated: [],
  nowPlaying: [],
  upcoming: [],
  trendingTv: [],
  popularTv: [],
  topRatedTv: [],
  onTheAirTv: [],
  airingTodayTv: [],
  genreSections: [
    { genre: { id: 28, name: "Action" }, movies: [] },
    { genre: { id: 35, name: "Comedy" }, movies: [] }
  ],
  featuredSlides: [
    {
      movie: {
        ...movieFixture,
        genres: ["Action", "Science Fiction"],
        runtime: 148
      },
      trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
    }
  ],
  hasError: false
};

const rowSectionsFixture = [
  {
    key: "trending",
    title: "Tendencias de la semana",
    movies: [movieFixture],
    emptyMessage: "No hay peliculas en tendencia para mostrar en este momento."
  },
  {
    key: "genre-28",
    title: "Genero: Action",
    movies: [],
    emptyMessage: "No hay peliculas para el genero Action en este momento."
  },
  {
    key: "genre-35",
    title: "Genero: Comedy",
    movies: [],
    emptyMessage: "No hay peliculas para el genero Comedy en este momento."
  }
];

describe("HomePage", () => {
  it("renders movie sections with data", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getHomeData).mockResolvedValue(homeDataFixture);
    vi.mocked(buildHomeRowSections).mockReturnValue(rowSectionsFixture);
    vi.mocked(selectHomeStripMovies).mockReturnValue([]);

    render(await HomePage());

    expect(screen.getByText("Pelicula destacada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver trailer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver detalle" })).toHaveAttribute("href", "/movie/1");
    expect(screen.getByText("Tendencias de la semana")).toBeInTheDocument();
    expect(screen.getByText("Genero: Action")).toBeInTheDocument();
    expect(screen.getByText("Genero: Comedy")).toBeInTheDocument();
    expect(screen.getAllByText("Inception").length).toBeGreaterThan(0);
  });

  it("shows token warning when missing", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue(null);
    vi.mocked(getHomeData).mockResolvedValue({
      ...homeDataFixture,
      trending: [],
      featuredSlides: []
    });
    vi.mocked(buildHomeRowSections).mockReturnValue([]);
    vi.mocked(selectHomeStripMovies).mockReturnValue([]);

    render(await HomePage());

    expect(screen.getByText(/Falta configurar/)).toBeInTheDocument();
  });

  it("renders partial data with global error state", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getHomeData).mockResolvedValue({
      ...homeDataFixture,
      hasError: true,
      popular: []
    });
    vi.mocked(buildHomeRowSections).mockReturnValue(rowSectionsFixture);
    vi.mocked(selectHomeStripMovies).mockReturnValue([]);

    render(await HomePage());

    expect(screen.getByText(/Ocurrio un error al cargar datos de TMDb/i)).toBeInTheDocument();
    expect(screen.getByText("Tendencias de la semana")).toBeInTheDocument();
  });
});
