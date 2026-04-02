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
  results: Movie[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
