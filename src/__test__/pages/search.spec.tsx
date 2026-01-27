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
import { discoverMovies, searchMovies } from "@/services/movies";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/movies", () => ({
  searchMovies: jest.fn(),
  discoverMovies: jest.fn(),
  listMovieWatchProviders: jest.fn(),
}));

describe("<Search/>", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
    });

    const { listMovieWatchProviders } = jest.requireMock("@/services/movies");
    (listMovieWatchProviders as jest.Mock).mockResolvedValue({
      data: { results: [] },
    });

    (discoverMovies as jest.Mock).mockResolvedValue({
      data: {
        page: 1,
        results: [
          {
            id: "1",
            title: "Movie 1",
            poster_path: "/path1.jpg",
            release_date: "2023-01-01",
            vote_average: 8.1,
          },
          {
            id: "2",
            title: "Movie 2",
            poster_path: "/path2.jpg",
            release_date: "2023-02-01",
            vote_average: 7.9,
          },
        ],
        total_pages: 1,
        total_results: 2,
      },
    });

    (searchMovies as jest.Mock).mockResolvedValue({
      data: {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      },
    });
  });

  it("renders the search form and discover results by default", async () => {
    await act(async () => {
      render(<Search />);
    });

    const searchInput = screen.getByPlaceholderText(
      "Search for movies, TV shows, people..."
    );
    expect(searchInput).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    await waitFor(() => {
      expect(discoverMovies).toHaveBeenCalled();
    });
  });

  it("handles search form submission", async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: mockPush,
    });

    await act(async () => {
      render(<Search />);
    });

    const searchInput = screen.getByPlaceholderText(
      "Search for movies, TV shows, people..."
    );
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "Batman" } });

    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/search",
        query: { q: "Batman", p: 1 },
      });
    });
  });

  it("focuses the input when focus=1 is present", async () => {
    jest.useFakeTimers();

    (useRouter as jest.Mock).mockReturnValue({
      query: { focus: "1" },
      push: mockPush,
    });

    await act(async () => {
      render(<Search />);
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toHaveFocus();
    });

    jest.useRealTimers();
  });
});
