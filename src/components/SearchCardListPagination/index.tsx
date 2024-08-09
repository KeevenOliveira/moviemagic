import { useCallback } from "react";
import Card, { CardProps } from "../Card";
import Pagination from "../Pagination";

export interface SearchCardListProps {
  page: number;
  results: CardProps[];
  total_pages: number;
  total_results: number;
  query: string;
}

const SearchCardListPagination = ({
  results,
  ...rest
}: SearchCardListProps) => {
  return (
    <div>
      <div data-testid="card-list-pagination" className="mt-4">
        <div className="flex flex-wrap justify-center">
          {results?.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      </div>
      <Pagination {...rest} />
    </div>
  );
};

export default SearchCardListPagination;
