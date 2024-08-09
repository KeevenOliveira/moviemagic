import { render, screen } from "@/test/test-utils";
import Pagination from ".";
import userEvent from "@testing-library/user-event";

describe("<Pagination/>", () => {
  const defaultProps = {
    total_results: 100,
    page: 1,
    total_pages: 5,
    query: "test",
  };

  it("renders the total results correctly", () => {
    render(<Pagination {...defaultProps} />);
    const totalResultsElement = screen.getByText(/Total results: 100/i);
    expect(totalResultsElement).toBeInTheDocument();
  });

  it("renders the correct number of PaginationItems", () => {
    render(<Pagination {...defaultProps} />);
    const paginationItems = screen.getAllByRole("link");
    expect(paginationItems.length).toBe(5);
  });

  it("calls onPageChange with the correct page number when a page number is clicked", () => {
    render(<Pagination {...defaultProps} />);
    const pageNumberLink = screen.getByRole("link", { name: /2/i });
    userEvent.click(pageNumberLink);
    expect(pageNumberLink).toHaveAttribute("href", "/search?q=test&p=2");
  });

  it("calls onPageChange with the correct page number when the next button is clicked", () => {
    render(<Pagination {...defaultProps} />);
    const nextButton = screen.getByRole("link", { name: /Next/i });
    userEvent.click(nextButton);
    expect(nextButton).toHaveAttribute("href", "/search?q=test&p=2");
  });

  it("calls onPageChange with the correct page number when the previous button is clicked", () => {
    render(<Pagination {...defaultProps} page={2} />);
    const previousButton = screen.getByRole("link", { name: /Previous/i });
    userEvent.click(previousButton);
    expect(previousButton).toHaveAttribute("href", "/search?q=test&p=1");
  });

  it("should possible to navigate just p params", () => {
    render(<Pagination {...defaultProps} query={undefined} />);
    const pageNumberLink = screen.getByRole("link", { name: /2/i });
    userEvent.click(pageNumberLink);
    expect(pageNumberLink).toHaveAttribute("href", "/search?p=2");
  });
});
