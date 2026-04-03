import { describe, expect, it } from "vitest";
import { parseFavoriteKey, parseKeyToMediaRef, toFavoriteKey } from "@/lib/favorites-storage";

describe("favorites-storage", () => {
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
});
