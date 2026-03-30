export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  rating: number;
  releaseDate: string;
}

export interface MovieListResult {
  results: Movie[];
}
