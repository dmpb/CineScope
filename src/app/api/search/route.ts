import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  if (!query) {
    return NextResponse.json({ results: [], totalResults: 0, currentPage: 1, totalPages: 0 });
  }

  const result = await searchMovies(query, page);
  return NextResponse.json(result);
}
