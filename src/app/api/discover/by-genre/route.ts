import { NextResponse } from "next/server";
import { getDiscoverMoviesByGenrePage, getDiscoverTvByGenrePage } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "tv" ? "tv" : "movie";
  const genreIdParam = Number(searchParams.get("genreId") ?? "0");
  const genreId = Number.isInteger(genreIdParam) && genreIdParam > 0 ? genreIdParam : 0;
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  if (!genreId) {
    return NextResponse.json(
      { results: [], totalResults: 0, currentPage: 1, totalPages: 0, error: "genreId invalido." },
      { status: 400 }
    );
  }

  try {
    const result =
      kind === "tv" ? await getDiscoverTvByGenrePage(genreId, page) : await getDiscoverMoviesByGenrePage(genreId, page);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        results: [],
        totalResults: 0,
        currentPage: page,
        totalPages: 0,
        error: "No se pudo cargar el listado por genero en este momento."
      },
      { status: 500 }
    );
  }
}
