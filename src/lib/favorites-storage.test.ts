import { beforeEach, describe, expect, it } from "vitest";
import {
  FAVORITES_STORAGE_KEY,
  parseFavoriteKey,
  parseKeyToMediaRef,
  readFavoritesFromStorage,
  toFavoriteKey,
  writeFavoritesToStorage
} from "@/lib/favorites-storage";

describe("favorites-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("parses legacy numeric entries as movie ids", () => {
    expect(parseFavoriteKey(603)).toBe("movie:603");
  });

  it("parses compound keys", () => {
    expect(parseFavoriteKey("tv:1399")).toBe("tv:1399");
    expect(parseKeyToMediaRef("tv:1399")).toEqual({ kind: "tv", id: 1399 });
    expect(parseKeyToMediaRef("movie:1")).toEqual({ kind: "movie", id: 1 });
    expect(toFavoriteKey("movie", 2)).toBe("movie:2");
  });

  it("rejects invalid keys", () => {
    expect(parseFavoriteKey("bad")).toBeNull();
    expect(parseKeyToMediaRef("x:1")).toBeNull();
  });

  it("migra entradas con status a solo keys", () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([
        { key: "movie:1", status: "seen" },
        "tv:2",
        { key: "movie:3", status: "want" }
      ])
    );
    expect(readFavoritesFromStorage()).toEqual(["movie:1", "tv:2", "movie:3"]);
  });

  it("persiste keys como array de strings", () => {
    writeFavoritesToStorage(["movie:10", "tv:20"]);
    expect(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]")).toEqual([
      "movie:10",
      "tv:20"
    ]);
  });
});
