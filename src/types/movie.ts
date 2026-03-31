export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  rating: number;
  releaseDate: string;
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

export interface MovieListResult {
  results: Movie[];
}

export interface SearchResult {
  results: Movie[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}
