/* eslint-disable react/display-name */
import { render, screen, fireEvent } from "@/test/test-utils";
import Movie, { getStaticProps, MoviePageProps } from "@/pages/movie/[movieId]";
import { GetStaticPropsContext } from "next";
import { getMovieById, listSimilarMovies } from "@/services/movies";

jest.mock("@/services/movies", () => ({
  getMovieById: jest.fn(),
  listSimilarMovies: jest.fn(),
}));

jest.mock("@/components/CardList", () => (props: any) => (
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
    release_date: "2023-01-01",
    overview: "Test overview",
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
    (getMovieById as jest.Mock).mockResolvedValue({ data: movie });
    (listSimilarMovies as jest.Mock).mockResolvedValue({
      data: { results: similarMovies },
    });
  });

  it("renders the movie details and similar movies", async () => {
    const { props } = (await getStaticProps({
      params: { movieId: "1" },
    } as GetStaticPropsContext)) as { props: MoviePageProps };

    render(<Movie {...props} />);

    const titleElement = screen.getByText(movie.title);
    expect(titleElement).toBeInTheDocument();

    const releaseDateElement = screen.getByText(movie.release_date);
    expect(releaseDateElement).toBeInTheDocument();

    const overviewElement = screen.getByText(movie.overview);
    expect(overviewElement).toBeInTheDocument();

    const cardListElement = screen.getByTestId("card-list");
    expect(cardListElement).toBeInTheDocument();
    expect(cardListElement).toHaveTextContent("Similar Movies");
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
});
