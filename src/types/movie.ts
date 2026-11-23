/** Persona en listados de búsqueda (TMDb `/search/multi` o `/search/person`). */
export interface PersonSearchHit {
  mediaType: "person";
  id: number;
  name: string;
  profilePath: string;
  popularity: number;
  knownForDepartment?: string;
}

export type SearchListItem = Movie | PersonSearchHit;

export interface Movie {
  id: number;
  mediaType?: "movie" | "tv";
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  rating: number;
  popularity?: number;
  releaseDate: string;
  status?: string;
  productionCountries?: string[];
  genres: string[];
  runtime: number;
  language: string;
  voteCount: number;
  /** TV: creadores desde TMDb `created_by` */
  creators?: string[];
  /** TV: temporadas emitidas */
  numberOfSeasons?: number;
  /** TV: episodios totales */
  numberOfEpisodes?: number;
  /** TV: nombres de cadenas / plataformas de emisión */
  networkNames?: string[];
  /** TV: última fecha de emisión (TMDb `last_air_date`) */
  lastAirDate?: string;
  /** TV: duraciones de episodio en minutos (para rango o “variable”) */
  episodeRunTimes?: number[];
  /** Película: colección / saga TMDb si aplica */
  collection?: MovieCollectionRef;
  /** TV: resumen de temporadas desde el detalle */
  seasons?: TvSeasonSummary[];
}

export interface MovieCollectionRef {
  id: number;
  name: string;
  posterPath: string;
  backdropPath: string;
}

export interface MovieCollection {
  id: number;
  name: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  parts: Movie[];
}

export interface TvSeasonSummary {
  seasonNumber: number;
  name: string;
  overview: string;
  episodeCount: number;
  airDate: string;
  posterPath: string;
}

export interface TvEpisode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  name: string;
  overview: string;
  airDate: string;
  runtime: number;
  stillPath: string;
  rating: number;
}

export interface TvSeasonDetail {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string;
  posterPath: string;
  episodes: TvEpisode[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string;
}

export interface CrewHighlights {
  directors: string[];
  writers: string[];
}

export interface WatchProvider {
  id: number;
  name: string;
  logoPath: string;
  category: "flatrate" | "rent" | "buy";
}

/** Resultado de `/watch/providers` con enlace regional (JustWatch vía TMDb). */
export interface WatchProvidersResult {
  providers: WatchProvider[];
  link: string | null;
}

export interface MovieListResult {
  results: Movie[];
}

export interface SearchResult {
  results: SearchListItem[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
