/* eslint-disable react/display-name */
import { render, screen } from "@/test/test-utils";
import SearchCardListPagination, { SearchCardListProps } from ".";

jest.mock("../Card", () => (props: any) => (
  <div data-testid="card" {...props}>
    {props.title}
  </div>
));

jest.mock("../Pagination", () => (props: any) => (
  <div data-testid="pagination" {...props}>
    Pagination Component
  </div>
));

describe("<SearchCardListPagination/>", () => {
  const defaultProps: SearchCardListProps = {
    page: 1,
    results: [
      {
        id: "1",
        title: "Movie 1",
        poster_path: "/path1.jpg",
        release_date: "2023-01-01",
      },
      {
        id: "2",
        title: "Movie 2",
        poster_path: "/path2.jpg",
        release_date: "2023-02-01",
      },
    ],
    total_pages: 5,
    total_results: 100,
    query: "test",
  };

  it("renders the SearchCardListPagination component with cards and pagination", () => {
    render(<SearchCardListPagination {...defaultProps} />);

    const cardElements = screen.getAllByTestId("card");
    expect(cardElements).toHaveLength(2);
    expect(cardElements[0]).toHaveTextContent("Movie 1");
    expect(cardElements[1]).toHaveTextContent("Movie 2");

    const paginationElement = screen.getByTestId("pagination");
    expect(paginationElement).toBeInTheDocument();
    expect(paginationElement).toHaveTextContent("Pagination Component");
  });

  it("renders no cards when results are empty", () => {
    render(<SearchCardListPagination {...defaultProps} results={[]} />);

    const cardElements = screen.queryAllByTestId("card");
    expect(cardElements).toHaveLength(0);

    const paginationElement = screen.getByTestId("pagination");
    expect(paginationElement).toBeInTheDocument();
  });

  it("passes the correct props to the Pagination component", () => {
    render(<SearchCardListPagination {...defaultProps} />);

    const paginationElement = screen.getByTestId("pagination");
    expect(paginationElement).toHaveAttribute("page", "1");
    expect(paginationElement).toHaveAttribute("total_pages", "5");
    expect(paginationElement).toHaveAttribute("total_results", "100");
    expect(paginationElement).toHaveAttribute("query", "test");
  });
});
