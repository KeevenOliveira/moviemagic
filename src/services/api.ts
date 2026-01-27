import axios, { AxiosError } from "axios";

export type ApiErrorCode =
  | "ENV_MISSING"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "REQUEST_ABORTED"
  | "HTTP_ERROR"
  | "UNKNOWN";

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  details?: unknown;

  constructor(
    message: string,
    opts: { code: ApiErrorCode; status?: number; details?: unknown },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>;
    const status = ax.response?.status;

    if (ax.code === "ECONNABORTED") {
      return new ApiError("Tempo limite ao conectar na API.", {
        code: "TIMEOUT",
        status,
        details: { message: ax.message },
      });
    }

    if (ax.code === "ERR_CANCELED") {
      return new ApiError("Requisição cancelada.", {
        code: "REQUEST_ABORTED",
        status,
        details: { message: ax.message },
      });
    }

    if (!ax.response) {
      return new ApiError(
        "Não foi possível conectar na API. Verifique sua conexão.",
        {
          code: "NETWORK_ERROR",
          details: { message: ax.message },
        },
      );
    }

    const responseData =
      (ax.response?.data && typeof ax.response.data === "object"
        ? (ax.response.data as Record<string, unknown>)
        : undefined) || undefined;

    const apiMessage =
      (typeof responseData?.status_message === "string" &&
        responseData.status_message) ||
      (typeof responseData?.message === "string" && responseData.message) ||
      ax.message ||
      "Erro ao consultar a API.";

    return new ApiError(apiMessage, {
      code: "HTTP_ERROR",
      status,
      details: ax.response?.data,
    });
  }

  if (error instanceof Error) {
    return new ApiError(
      error.message || "Erro inesperado ao consultar a API.",
      {
        code: "UNKNOWN",
        details: { name: error.name },
      },
    );
  }

  return new ApiError("Erro inesperado ao consultar a API.", {
    code: "UNKNOWN",
    details: error,
  });
}

const baseURL =
  process.env.NEXT_PUBLIC_THE_MOVIE_URL?.trim() ||
  "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL,
  timeout: 12_000,
  params: {
    api_key: process.env.NEXT_PUBLIC_THE_MOVIE_API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const apiKey = process.env.NEXT_PUBLIC_THE_MOVIE_API_KEY?.trim();

  if (!apiKey) {
    return Promise.reject(
      new ApiError(
        "Configuração ausente: defina NEXT_PUBLIC_THE_MOVIE_API_KEY.",
        {
          code: "ENV_MISSING",
        },
      ),
    );
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

export default api;
