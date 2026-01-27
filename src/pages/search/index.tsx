import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import FiltersSidebar, {
  DEFAULT_FILTERS,
  type FiltersState,
  type StreamingProviderOption,
} from "@/components/FiltersSidebar";
import DiscoverCard from "@/components/DiscoverCard";
import {
  discoverMovies,
  listMovieWatchProviders,
  searchMovies,
  type MovieSummary,
  type WatchProvider,
} from "@/services/movies";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi2";

function normalizeProviderName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function pickProviders(all: WatchProvider[]): StreamingProviderOption[] {
  const byName = new Map<string, WatchProvider>();
  for (const p of all) byName.set(normalizeProviderName(p.provider_name), p);

  const wanted: Array<{ label: string; aliases: string[] }> = [
    { label: "Netflix", aliases: ["Netflix"] },
    { label: "Amazon Prime", aliases: ["Amazon Prime Video", "Amazon Prime"] },
    { label: "Disney+", aliases: ["Disney Plus", "Disney+"] },
    { label: "HBO Max", aliases: ["HBO Max", "Max"] },
    { label: "Hulu", aliases: ["Hulu"] },
    { label: "Apple TV+", aliases: ["Apple TV Plus", "Apple TV+"] },
    { label: "Paramount+", aliases: ["Paramount Plus", "Paramount+"] },
    { label: "Peacock", aliases: ["Peacock"] },
    { label: "Crunchyroll", aliases: ["Crunchyroll"] },
  ];

  return wanted.map((w) => {
    const found = w.aliases
      .map((a) => byName.get(normalizeProviderName(a)))
      .find(Boolean);
    return { label: w.label, providerId: found?.provider_id };
  });
}

const Search = () => {
  const { query: queryParams, push } = useRouter();
  const qParam = useMemo(() => String(queryParams?.q || ""), [queryParams?.q]);
  const pageParam = useMemo(
    () => Number(queryParams?.p || 1),
    [queryParams?.p],
  );
  const shouldFocus = useMemo(
    () => String(queryParams?.focus || "") === "1",
    [queryParams?.focus],
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>(qParam);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [streamingProviders, setStreamingProviders] = useState<StreamingProviderOption[]>([
    { label: "Netflix" },
    { label: "Amazon Prime" },
    { label: "Disney+" },
    { label: "HBO Max" },
    { label: "Hulu" },
    { label: "Apple TV+" },
    { label: "Paramount+" },
    { label: "Peacock" },
    { label: "Crunchyroll" },
  ]);
  const [searchResults, setSearchResults] = useState({
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  });
  const [loading, setLoading] = useState(false);
  const skeletonKeys = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `s${i + 1}`),
    [],
  );

  useEffect(() => {
    setInputValue(qParam);
  }, [qParam]);

  useEffect(() => {
    if (!shouldFocus) return;
    // wait a tick so the input exists after route transition
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(t);
  }, [shouldFocus]);

  useEffect(() => {
    // Provider list depends on region to be meaningful.
    const region = filters.country !== "all" ? filters.country : "US";
    const fetchProviders = async () => {
      const response = await listMovieWatchProviders(region);
      setStreamingProviders(pickProviders(response?.data?.results || []));
    };
    fetchProviders().catch((error) => {
      console.error("Error fetching watch providers", error);
      // keep UI labels (disabled) if provider fetch fails
      setStreamingProviders((prev) => prev.map((p) => ({ label: p.label })));
    });
  }, [filters.country]);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);

      try {
        const response = qParam.trim()
          ? await searchMovies(qParam.trim(), pageParam)
          : await discoverMovies({
              page: pageParam,
              sortBy: filters.sortBy,
              genreIds: filters.genreIds,
              releaseYear: filters.releaseYear.trim() || undefined,
              ratingRange: filters.rating,
              runtimeRange: filters.runtime,
              minimumVotes: filters.minimumVotes,
              country: filters.country,
              originalLanguage: filters.originalLanguage,
              includeAdult: filters.includeAdult,
              withVideo: filters.withVideoOnly,
              watchProviderIds: filters.watchProviderIds,
              watchRegion: filters.country !== "all" ? filters.country : "US",
            });

        setSearchResults(response?.data);
      } catch (error) {
        console.error("Error fetching search movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [
    qParam,
    pageParam,
    filters.sortBy,
    filters.genreIds,
    filters.releaseYear,
    filters.rating,
    filters.runtime,
    filters.minimumVotes,
    filters.watchProviderIds,
    filters.country,
    filters.originalLanguage,
    filters.includeAdult,
    filters.withVideoOnly,
  ]);

  const handleSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const search = String(
        new FormData(event.currentTarget).get("search") || "",
      ).trim();

      // Keep pagination consistent and let the effect fetch.
      if (!search) {
        push({ pathname: "/search", query: { p: 1 } });
        return;
      }

      push({
        pathname: "/search",
        query: { q: search, p: 1 },
      });
    },
    [push],
  );

  const title = qParam.trim() ? "Search" : "Discover";
  const countLabel = `${searchResults.total_results || 0} movies found`;
  const isEmpty =
    !loading && (!searchResults.results || searchResults.results.length === 0);
  const pageTitle = qParam.trim()
    ? `Search “${qParam.trim()}” — Movie Magic`
    : "Discover — Movie Magic";
  const pageDescription = qParam.trim()
    ? `Search results for “${qParam.trim()}” on Movie Magic.`
    : "Discover movies using filters like genre, rating, year, and more.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="pt-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="mm-iconButton p-2.5" aria-label="Back">
            <HiArrowLeft className="text-lg text-white/90" />
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Discover Movies &amp; TV Shows
          </h1>
        </div>

      <form role="form" className="mt-4" onSubmit={handleSearch}>
        <div className="mm-glass rounded-3xl p-3 sm:p-4">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
              <svg
                className="w-4 h-4 text-slate-200/60"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              data-testid="search-input"
              name="search"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="block w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-4 ps-10 text-sm text-slate-100 placeholder:text-slate-200/50 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
              placeholder="Search for movies, TV shows, people..."
              autoComplete="off"
            />
            <button
              data-testid="search-button"
              type="submit"
              className="text-slate-900 absolute end-2.5 top-1/2 -translate-y-1/2 bg-sky-200 hover:bg-sky-100 focus:ring-4 focus:outline-none focus:ring-sky-300/40 font-semibold rounded-2xl text-sm px-5 py-2.5 transition"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <FiltersSidebar
          value={filters}
          onChange={setFilters}
          onClearAll={() => setFilters(DEFAULT_FILTERS)}
          streamingProviders={streamingProviders}
        />

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-xs text-white/60">{countLabel}</p>
            </div>
          </div>

          {loading ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {skeletonKeys.map((k) => (
                <div key={k} className="animate-pulse">
                  <div className="aspect-[2/3] rounded-3xl bg-white/10" />
                  <div className="mt-3 h-4 w-4/5 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-2/5 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="mt-5">
              <EmptyState
                title="Nenhum filme para mostrar"
                description="Tente outro termo de busca ou ajuste os filtros."
                actionLabel="Limpar filtros"
                actionHref="/search?focus=1"
              />
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.results.map((movie: MovieSummary) => (
                <DiscoverCard
                  key={String(movie.id)}
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  release_date={movie.release_date}
                  vote_average={movie.vote_average}
                />
              ))}
            </div>
          )}

          {!loading && !isEmpty && (
            <Pagination
              page={searchResults.page}
              total_pages={searchResults.total_pages}
              total_results={searchResults.total_results}
              query={qParam.trim() || undefined}
            />
          )}
        </section>
      </div>
      </main>
    </>
  );
};

export default Search;
