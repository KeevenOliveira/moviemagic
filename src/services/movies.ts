import api, { normalizeApiError } from "./api";

export type MovieSummary = {
  id: string | number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
};

export type MovieListResponse = {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
};

export type MovieCreditsResponse = {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path?: string | null;
    order?: number;
  }>;
};

export type MovieReviewsResponse = {
  id: number;
  page: number;
  results: Array<{
    id: string;
    author: string;
    content: string;
    created_at: string;
    url: string;
    author_details?: {
      name?: string;
      username?: string;
      rating?: number | null;
      avatar_path?: string | null;
    };
  }>;
  total_pages: number;
  total_results: number;
};

export type MovieVideosResponse = {
  id: number;
  results: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official?: boolean;
    published_at?: string;
  }>;
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path?: string | null;
  display_priority?: number;
};

export type WatchProvidersResponse = {
  results: WatchProvider[];
};

export type MovieWatchProvidersResponse = {
  id: number;
  results: Record<
    string,
    {
      link?: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    }
  >;
};

const getMovieById = async (id: string) => {
  try {
    return await api.get(`/movie/${id}`);
  } catch (error) {
    console.error("[movies] getMovieById failed", {
      id,
      error: normalizeApiError(error),
    });
    return { data: null };
  }
};

const listTrendingMovies = async () => {
  try {
    return await api.get("/trending/movie/day");
  } catch (error) {
    console.error("[movies] listTrendingMovies failed", {
      error: normalizeApiError(error),
    });
    return { data: { results: [] } };
  }
};

const listPopularMovies = async () => {
  try {
    return await api.get("/movie/popular");
  } catch (error) {
    console.error("[movies] listPopularMovies failed", {
      error: normalizeApiError(error),
    });
    return { data: { results: [] } };
  }
};

const listSimilarMovies = async (id: string) => {
  try {
    return await api.get(`/movie/${id}/similar`);
  } catch (error) {
    console.error("[movies] listSimilarMovies failed", {
      id,
      error: normalizeApiError(error),
    });
    return { data: { results: [] } };
  }
};

const getMovieCredits = async (id: string) => {
  try {
    return await api.get<MovieCreditsResponse>(`/movie/${id}/credits`);
  } catch (error) {
    console.error("[movies] getMovieCredits failed", {
      id,
      error: normalizeApiError(error),
    });
    return { data: { id: Number(id), cast: [] } satisfies MovieCreditsResponse };
  }
};

const getMovieReviews = async (id: string, page = 1) => {
  try {
    return await api.get<MovieReviewsResponse>(`/movie/${id}/reviews`, {
      params: { page },
    });
  } catch (error) {
    console.error("[movies] getMovieReviews failed", {
      id,
      page,
      error: normalizeApiError(error),
    });
    return {
      data: {
        id: Number(id),
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      } satisfies MovieReviewsResponse,
    };
  }
};

const getMovieVideos = async (id: string) => {
  try {
    return await api.get<MovieVideosResponse>(`/movie/${id}/videos`);
  } catch (error) {
    console.error("[movies] getMovieVideos failed", {
      id,
      error: normalizeApiError(error),
    });
    return { data: { id: Number(id), results: [] } satisfies MovieVideosResponse };
  }
};

const getMovieWatchProviders = async (id: string) => {
  try {
    return await api.get<MovieWatchProvidersResponse>(`/movie/${id}/watch/providers`);
  } catch (error) {
    console.error("[movies] getMovieWatchProviders failed", {
      id,
      error: normalizeApiError(error),
    });
    return {
      data: { id: Number(id), results: {} } satisfies MovieWatchProvidersResponse,
    };
  }
};

const searchMovies = async (query = "Wolverine", page = 1) => {
  try {
    return await api.get(`/search/movie?query=${query}&page=${page}`);
  } catch (error) {
    console.error("[movies] searchMovies failed", {
      query,
      page,
      error: normalizeApiError(error),
    });
    return { data: { page: 1, results: [], total_pages: 0, total_results: 0 } };
  }
};

const listMovieWatchProviders = async (watchRegion?: string) => {
  try {
    return await api.get<WatchProvidersResponse>("/watch/providers/movie", {
      params: {
        ...(watchRegion ? { watch_region: watchRegion } : {}),
      },
    });
  } catch (error) {
    console.error("[movies] listMovieWatchProviders failed", {
      watchRegion,
      error: normalizeApiError(error),
    });
    return { data: { results: [] } satisfies WatchProvidersResponse };
  }
};

type DiscoverMoviesParams = {
  page?: number;
  sortBy?: string;
  genreIds?: number[];
  releaseYear?: string;
  ratingRange?: [number, number];
  runtimeRange?: [number, number];
  minimumVotes?: number;
  country?: string;
  originalLanguage?: string;
  includeAdult?: boolean;
  withVideo?: boolean;
  watchProviderIds?: number[];
  watchRegion?: string;
};

const discoverMovies = async ({
  page = 1,
  sortBy = "popularity.desc",
  genreIds,
  releaseYear,
  ratingRange,
  runtimeRange,
  minimumVotes,
  country,
  originalLanguage,
  includeAdult,
  withVideo,
  watchProviderIds,
  watchRegion,
}: DiscoverMoviesParams = {}) => {
  try {
    return await api.get("/discover/movie", {
      params: {
        page,
        sort_by: sortBy,
        ...(genreIds && genreIds.length > 0 ? { with_genres: genreIds.join(",") } : {}),
        ...(releaseYear ? { primary_release_year: releaseYear } : {}),
        ...(ratingRange ? { "vote_average.gte": ratingRange[0], "vote_average.lte": ratingRange[1] } : {}),
        ...(runtimeRange ? { "with_runtime.gte": runtimeRange[0], "with_runtime.lte": runtimeRange[1] } : {}),
        ...(typeof minimumVotes === "number" ? { "vote_count.gte": minimumVotes } : {}),
        ...(country && country !== "all" ? { region: country } : {}),
        ...(originalLanguage && originalLanguage !== "all" ? { with_original_language: originalLanguage } : {}),
        ...(typeof includeAdult === "boolean" ? { include_adult: includeAdult } : {}),
        ...(typeof withVideo === "boolean" ? { with_video: withVideo } : {}),
        ...(watchProviderIds && watchProviderIds.length > 0
          ? {
              with_watch_providers: watchProviderIds.join("|"),
              watch_region: watchRegion || (country && country !== "all" ? country : "US"),
              with_watch_monetization_types: "flatrate",
            }
          : {}),
      },
    });
  } catch (error) {
    console.error("[movies] discoverMovies failed", {
      params: {
        page,
        sortBy,
        genreIds,
        releaseYear,
        ratingRange,
        runtimeRange,
        minimumVotes,
        country,
        originalLanguage,
        includeAdult,
        withVideo,
        watchProviderIds,
        watchRegion,
      },
      error: normalizeApiError(error),
    });
    return { data: { page: 1, results: [], total_pages: 0, total_results: 0 } };
  }
};

export {
  getMovieById,
  listTrendingMovies,
  listPopularMovies,
  listSimilarMovies,
  getMovieCredits,
  getMovieReviews,
  getMovieVideos,
  getMovieWatchProviders,
  searchMovies,
  listMovieWatchProviders,
  discoverMovies,
};
