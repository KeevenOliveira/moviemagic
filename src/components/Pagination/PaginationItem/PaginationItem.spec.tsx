import { render, screen } from "@/test/test-utils";
import PaginationItem from ".";

describe("<PaginationItem/>", () => {
  const defaultProps = {
    total_results: 100,
    page: 1,
    pageNumber: 1,
    onPageChange: (pageNumber: number) => `/page/${pageNumber}`,
  };

  it("renders the PaginationItem component", () => {
    render(<PaginationItem {...defaultProps} />);
    const linkElement = screen.getByRole("link", { name: /1/i });
    expect(linkElement).toBeInTheDocument();
  });

  it("applies active styles when the current page matches pageNumber", () => {
    render(<PaginationItem {...defaultProps} />);
    const linkElement = screen.getByRole("link", { name: /1/i });
    expect(linkElement).toHaveClass(
      "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
    );
  });

  it("applies inactive styles when the current page does not match pageNumber", () => {
    render(<PaginationItem {...defaultProps} page={2} />);
    const linkElement = screen.getByRole("link", { name: /1/i });
    expect(linkElement).toHaveClass(
      "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    );
  });

  it("calls onPageChange with the correct pageNumber", () => {
    const customOnPageChange = jest.fn(
      (pageNumber: number) => `/page/${pageNumber}`
    );
    render(
      <PaginationItem {...defaultProps} onPageChange={customOnPageChange} />
    );
    const linkElement = screen.getByRole("link", { name: /1/i });
    linkElement.click();
    expect(customOnPageChange).toHaveBeenCalledWith(1);
  });
});
