import { describe, expect, it } from "vitest";
import { isAllowedTmdbLanguage, tmdbLanguageToHtmlLang, TMDB_LANGUAGE_OPTIONS } from "@/lib/tmdb-language";

describe("tmdb-language", () => {
  it("acepta solo codigos de la lista TMDb", () => {
    expect(isAllowedTmdbLanguage("es-ES")).toBe(true);
    expect(isAllowedTmdbLanguage("en-US")).toBe(true);
    expect(isAllowedTmdbLanguage("xx-XX")).toBe(false);
    expect(isAllowedTmdbLanguage("")).toBe(false);
  });

  it("tmdbLanguageToHtmlLang devuelve subetiqueta primaria", () => {
    expect(tmdbLanguageToHtmlLang("es-ES")).toBe("es");
    expect(tmdbLanguageToHtmlLang("es-MX")).toBe("es");
    expect(tmdbLanguageToHtmlLang("en-US")).toBe("en");
  });

  it("tmdbLanguageToHtmlLang hace fallback ante codigo raro", () => {
    expect(tmdbLanguageToHtmlLang("")).toBe("es");
    expect(tmdbLanguageToHtmlLang("123")).toBe("es");
  });

  it("no hay codigos duplicados en opciones", () => {
    const codes = TMDB_LANGUAGE_OPTIONS.map((o) => o.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("solo idiomas MVP: es-ES, es-MX, en-US", () => {
    expect(TMDB_LANGUAGE_OPTIONS.map((o) => o.code)).toEqual(["es-ES", "es-MX", "en-US"]);
  });
});
