import { NextResponse } from "next/server";
import { getTvSeasonById } from "@/lib/tmdb";

type RouteContext = {
  params: Promise<{ id: string; seasonNumber: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id: idParam, seasonNumber: seasonParam } = await context.params;
  const tvId = Number(idParam);
  const seasonNumber = Number(seasonParam);

  if (!Number.isInteger(tvId) || tvId <= 0 || !Number.isInteger(seasonNumber) || seasonNumber < 0) {
    return NextResponse.json({ season: null, error: "invalid_params" }, { status: 400 });
  }

  try {
    const season = await getTvSeasonById(tvId, seasonNumber);
    return NextResponse.json({ season });
  } catch {
    return NextResponse.json({ season: null, error: "fetch_failed" }, { status: 500 });
  }
}
