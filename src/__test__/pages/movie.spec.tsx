/* eslint-disable react/display-name */
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import Movie, { getStaticProps, MoviePageProps } from "@/pages/movie/[movieId]";
import { GetStaticPropsContext } from "next";
import {
  getMovieById,
  listSimilarMovies,
  getMovieCredits,
  getMovieVideos,
  getMovieReviews,
  getMovieWatchProviders,
} from "@/services/movies";
import { useRouter } from "next/router";

jest.mock("@/services/movies", () => ({
  getMovieById: jest.fn(),
  listSimilarMovies: jest.fn(),
  getMovieCredits: jest.fn(),
  getMovieVideos: jest.fn(),
  getMovieReviews: jest.fn(),
  getMovieWatchProviders: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/CardList", () => (props: Record<string, unknown> & { title?: string }) => (
  <div data-testid="card-list" {...props}>
    {props.title}
  </div>
));

jest.mock("@/utils/convertDate", () => ({
  convertDate: jest.fn((date) => date),
}));

describe("<Movie/>", () => {
  const movie = {
    id: "1",
    title: "Test Movie",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: "2023-01-01",
    overview: "Test overview",
    vote_average: 7.8,
    vote_count: 122000,
    genres: [{ id: 1, name: "Drama" }],
    runtime: 112,
  };

  const similarMovies = [
    {
      id: "2",
      title: "Similar Movie 1",
      poster_path: "/path1.jpg",
      release_date: "2023-02-01",
    },
    {
      id: "3",
      title: "Similar Movie 2",
      poster_path: "/path2.jpg",
      release_date: "2023-03-01",
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ isFallback: false });
    (getMovieById as jest.Mock).mockResolvedValue({ data: movie });
    (listSimilarMovies as jest.Mock).mockResolvedValue({
      data: { results: similarMovies },
    });
    (getMovieCredits as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        cast: [
          { id: 10, name: "Brie Larson", profile_path: "/brie.jpg", order: 0 },
          { id: 11, name: "Samuel L Jackson", profile_path: "/samuel.jpg", order: 1 },
          { id: 12, name: "Tom Hiddleston", profile_path: "/tom.jpg", order: 2 },
          { id: 13, name: "John Goodman", profile_path: "/john.jpg", order: 3 },
        ],
      },
    });
    (getMovieVideos as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        results: [
          { id: "v1", key: "abc123", name: "Trailer", site: "YouTube", type: "Trailer" },
        ],
      },
    });
    (getMovieReviews as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        page: 1,
        results: [
          {
            id: "r1",
            author: "Afreena Rosser",
            content: "Nice review",
            created_at: "2023-01-01",
            url: "x",
          },
        ],
        total_pages: 1,
        total_results: 1,
      },
    });

    (getMovieWatchProviders as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        results: {
          BR: {
            link: "https://example.com/watch",
            flatrate: [
              { provider_id: 8, provider_name: "Netflix", logo_path: "/netflix.png", display_priority: 1 },
              { provider_id: 9, provider_name: "Max", logo_path: "/max.png", display_priority: 2 },
            ],
          },
        },
      },
    });
  });

  it("renders the movie detail layout", async () => {
    const { props } = (await getStaticProps({
      params: { movieId: "1" },
    } as GetStaticPropsContext)) as { props: MoviePageProps };

    render(<Movie {...props} />);

    expect(screen.getByText("Back to Home")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: movie.title })).toBeInTheDocument();
    expect(screen.getByText(movie.overview)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recommended Movies" })).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("Cast")).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();

    expect(screen.getAllByText("7.8").length).toBeGreaterThan(0);
    expect(screen.getByText("122K Rated")).toBeInTheDocument();

    expect(screen.getByRole("img", { name: "Netflix" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Max" })).toBeInTheDocument();

    expect(screen.getByText("Brie Larson")).toBeInTheDocument();
    expect(screen.getByText("Afreena Rosser")).toBeInTheDocument();

    const trailerFrame = screen.getByTitle(/trailer/i);
    expect(trailerFrame).toBeInTheDocument();
    expect(trailerFrame).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/abc123"),
    );
  });

  it("handles image error and sets default image", async () => {
    const { props } = (await getStaticProps({
      params: { movieId: "1" },
    } as GetStaticPropsContext)) as { props: MoviePageProps };

    render(<Movie {...props} />);

    const imageElement = screen.getByRole("img", { name: /Test Movie/i });
    expect(imageElement).toBeInTheDocument();

    fireEvent.error(imageElement);

    expect(imageElement).toHaveAttribute(
      "src",
      "http://localhost/image-default-movie.svg"
    );
  });

  it("updates the poster when movie changes", async () => {
    const { props } = (await getStaticProps({
      params: { movieId: "1" },
    } as GetStaticPropsContext)) as { props: MoviePageProps };

    const { rerender } = render(<Movie {...props} />);

    const img = screen.getByRole("img", { name: /Test Movie/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("test-poster.jpg"));

    rerender(
      <Movie
        {...props}
        movie={{
          ...props.movie,
          poster_path: "/test-poster-2.jpg",
        }}
      />,
    );

    await waitFor(() => {
      expect(img).toHaveAttribute("src", expect.stringContaining("test-poster-2.jpg"));
    });
  });
});
