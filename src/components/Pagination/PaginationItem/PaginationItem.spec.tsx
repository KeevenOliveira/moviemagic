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
      "bg-white/14 text-slate-100"
    );
  });

  it("applies inactive styles when the current page does not match pageNumber", () => {
    render(<PaginationItem {...defaultProps} page={2} />);
    const linkElement = screen.getByRole("link", { name: /1/i });
    expect(linkElement).toHaveClass(
      "text-slate-100/75 hover:text-slate-100 hover:bg-white/10"
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
