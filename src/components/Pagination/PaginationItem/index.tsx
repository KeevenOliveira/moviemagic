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
      className={`flex items-center justify-center px-4 h-10 leading-tight transition ${
        page === pageNumber
          ? "bg-white/14 text-slate-100"
          : "text-slate-100/75 hover:text-slate-100 hover:bg-white/10"
      }`}
    >
      {pageNumber}
    </Link>
  );
};

export default PaginationItem;
