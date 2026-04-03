import { NextResponse } from "next/server";
import { parseKeyToMediaRef } from "@/lib/favorites-storage";
import { getMovieById, getTvById } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

const MAX_KEYS = 120;

function dedupeKeysPreserveOrder(keys: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const key of keys) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(key);
  }
  return out;
}

function normalizeBodyKeys(body: unknown): string[] {
  if (body === null || typeof body !== "object" || !("keys" in body)) {
    return [];
  }
  const raw = (body as { keys?: unknown }).keys;
  if (!Array.isArray(raw)) {
    return [];
  }
  const keys = raw
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.trim())
    .filter((s) => /^(movie|tv):\d+$/.test(s));
  return dedupeKeysPreserveOrder(keys).slice(0, MAX_KEYS);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ movies: [] as Movie[], error: "invalid_json" }, { status: 400 });
  }

  const keys = normalizeBodyKeys(body);
  if (keys.length === 0) {
    return NextResponse.json({ movies: [] as Movie[] });
  }

  const results = await Promise.all(
    keys.map(async (key) => {
      const ref = parseKeyToMediaRef(key);
      if (!ref) {
        return null;
      }
      try {
        return ref.kind === "tv" ? await getTvById(ref.id) : await getMovieById(ref.id);
      } catch {
        return null;
      }
    })
  );

  const movies = results.filter((m): m is Movie => m != null);
  return NextResponse.json({ movies });
}
