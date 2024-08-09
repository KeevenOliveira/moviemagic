import Link from "next/link";

interface PaginationProps {
  page: number;
  pageNumber: number;
  onPageChange: (pageNumber: number) => string;
}

const PaginationItem = ({
  page,
  pageNumber,
  onPageChange,
}: PaginationProps) => {
  return (
    <Link
      key={pageNumber}
      href={onPageChange(pageNumber)}
      aria-current="page"
      className={`z-10
        
      flex items-center justify-center px-3 h-8 leading-tight ${
        page === pageNumber
          ? "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      }`}
    >
      {pageNumber}
    </Link>
  );
};

export default PaginationItem;
