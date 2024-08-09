import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import Loading from "@/components/Loading";
import { searchMovies } from "@/services/movies";
import SearchCardListPagination, {
  SearchCardListProps,
} from "@/components/SearchCardListPagination";

const Search = () => {
  const { query: queryParams, push } = useRouter();
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<SearchCardListProps>(
    {} as any
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);

      const defaultQuery = String(queryParams?.q || "Wolverine");
      const defaultPage = Number(queryParams?.p || 1);

      try {
        const response = await searchMovies(defaultQuery, defaultPage);
        setQuery(defaultQuery);
        setPage(defaultPage);
        setSearchResults(response?.data);
      } catch (error) {
        console.error("Error fetching search movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [queryParams?.p, queryParams?.q]);

  const handleSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const search = new FormData(event.currentTarget).get("search") as string;
      setLoading(true);
      setQuery(search);
      setPage(1);

      push({
        pathname: "/search",
        query: { q: search, p: 1 },
      });

      try {
        const response = await searchMovies(search, page);
        setSearchResults(response?.data);
      } catch (error) {
        console.error("Error fetching search movies", error);
      } finally {
        setLoading(false);
      }
    },
    [page, push]
  );

  return (
    <main>
      <form
        role="form"
        className="max-w-md mx-auto p-3"
        onSubmit={handleSearch}
      >
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            data-testid="search-input"
            name="search"
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for movies"
            required
          />
          <button
            data-testid="search-button"
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      {loading && <Loading />}
      <SearchCardListPagination {...searchResults} query={query} page={page} />
    </main>
  );
};

export default Search;
