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

export interface MovieListResult {
  results: Movie[];
}

export interface SearchResult {
  results: SearchListItem[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
