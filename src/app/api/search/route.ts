import { NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";
import { parseMinVoteParam, parseSearchMediaKind, parseYearParam } from "@/lib/search-params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const mediaKind = parseSearchMediaKind(searchParams.get("type"));
  const year = parseYearParam(searchParams.get("year") ?? undefined);
  const minVote = parseMinVoteParam(searchParams.get("minVote") ?? undefined);

  if (!query) {
    return NextResponse.json({ results: [], totalResults: 0, currentPage: 1, totalPages: 0 });
  }

  try {
    const result = await searchMedia(query, page, { kind: mediaKind, year, minVote });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        results: [],
        totalResults: 0,
        currentPage: page,
        totalPages: 0,
        error: "No se pudo procesar la busqueda en este momento."
      },
      { status: 500 }
    );
  }
}
