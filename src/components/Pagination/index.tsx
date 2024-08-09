import Link from "next/link";
import { useCallback, useMemo } from "react";

import PaginationItem from "./PaginationItem";

interface PaginationProps {
  total_results: number;
  page: number;
  total_pages: number;
  query?: string;
  onPageChange?: (pageNumber: number) => void;
}

const Pagination = ({
  page,
  total_pages,
  total_results = 0,
  query,
}: PaginationProps) => {
  const generatePageNumbers = useMemo(() => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(total_pages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }, [page, total_pages]);

  const onPageChange = useCallback(
    (pageNumber: number): string => {
      if (query && pageNumber) {
        return `/search?q=${query}&p=${pageNumber}`;
      }

      if (query && !pageNumber) {
        return `/search?q=${query}`;
      }

      return `/search?p=${pageNumber}`;
    },
    [query]
  );

  return (
    <div data-testid="pagination">
      <p className="text-center mt-3">Total results: {total_results}</p>
      <nav
        className="flex justify-center mt-3 mb-3"
        aria-label="Page navigation example"
      >
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <Link
              href={onPageChange(page - 1)}
              scroll
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </Link>
          </li>
          {generatePageNumbers.map((pageNumber) => (
            <PaginationItem
              key={pageNumber}
              onPageChange={onPageChange}
              page={page}
              pageNumber={pageNumber}
            />
          ))}
          <li>
            <Link
              href={onPageChange(page + 1)}
              className={
                "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
