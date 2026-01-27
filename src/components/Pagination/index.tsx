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
    [query],
  );

  return (
    <div data-testid="pagination" className="mt-6">
      <p className="text-center text-sm text-slate-200/70">
        Total results: {total_results}
      </p>
      <nav
        className="flex justify-center mt-4 mb-3"
        aria-label="Page navigation example"
      >
        <ul className="mm-glass rounded-xl flex items-center h-10 text-sm overflow-hidden">
          <li>
            <Link
              href={onPageChange(page - 1)}
              scroll
              className="flex items-center justify-center px-4 h-10 leading-tight text-slate-100/80 hover:text-slate-100 hover:bg-white/10 transition"
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
              className="flex items-center justify-center px-4 h-10 leading-tight text-slate-100/80 hover:text-slate-100 hover:bg-white/10 transition"
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
