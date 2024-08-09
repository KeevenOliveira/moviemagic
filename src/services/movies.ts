import api from "./api";

const getMovieById = async (id: string) => {
  const data = await api.get(`/movie/${id}`);
  return data;
};

const listTrendingMovies = async () => {
  const data = await api.get("/trending/movie/day");
  return data;
};

const listPopularMovies = async () => {
  const data = await api.get("/movie/popular");
  return data;
};

const listSimilarMovies = async (id: string) => {
  const data = await api.get(`/movie/${id}/similar`);
  return data;
};

const searchMovies = async (query = "Wolverine", page: number) => {
  const data = await api.get(`/search/movie?query=${query}&page=${page}`);
  return data;
};

export {
  getMovieById,
  listTrendingMovies,
  listPopularMovies,
  listSimilarMovies,
  searchMovies,
};
