/* eslint-disable react/display-name */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Search from "@/pages/search";
import { useRouter } from "next/router";
import { searchMovies } from "@/services/movies";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/movies", () => ({
  searchMovies: jest.fn(),
}));

jest.mock("@/components/Loading", () => () => (
  <div data-testid="loading">Loading...</div>
));

jest.mock("@/components/SearchCardListPagination", () => (props: any) => (
  <div data-testid="search-card-list-pagination" {...props}>
    Search Card List
  </div>
));

describe("<Search/>", () => {
  const mockPush = jest.fn();
  const mockQuery = { q: "Wolverine", p: "1" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: mockQuery,
      push: mockPush,
    });

    (searchMovies as jest.Mock).mockResolvedValue({
      data: {
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
        total_pages: 1,
        total_results: 2,
      },
    });
  });

  it("renders the search form and initial results", async () => {
    await act(async () => {
      render(<Search />);
    });

    const searchInput = screen.getByPlaceholderText("Search for movies");
    expect(searchInput).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByTestId("search-card-list-pagination")
      ).toBeInTheDocument();
    });
  });

  it("handles search form submission", async () => {
    await act(async () => {
      render(<Search />);
    });

    const searchInput = screen.getByPlaceholderText("Search for movies");
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "Batman" } });

    fireEvent.click(searchButton);

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/search",
        query: { q: "Batman", p: 1 },
      });
      expect(searchMovies).toHaveBeenCalledWith("Batman", 1);
      expect(
        screen.getByTestId("search-card-list-pagination")
      ).toBeInTheDocument();
    });
  });

  it("displays loading indicator while fetching search results", async () => {
    await act(async () => {
      render(<Search />);
    });

    fireEvent.submit(screen.getByRole("form"));

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  });
});
