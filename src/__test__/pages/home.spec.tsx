/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import Home, { getStaticProps, HomeProps } from "@/pages";
import { listTrendingMovies, listPopularMovies } from "@/services/movies";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";

jest.mock("@/services/movies", () => ({
  listTrendingMovies: jest.fn(),
  listPopularMovies: jest.fn(),
}));

describe("<Home/>", () => {
  const trendingMovies = [
    {
      id: "1",
      title: "Trending Movie 1",
      poster_path: "/path1.jpg",
      backdrop_path: "/backdrop1.jpg",
      release_date: "2023-01-01",
      vote_average: 8.1,
    },
    {
      id: "2",
      title: "Trending Movie 2",
      poster_path: "/path2.jpg",
      backdrop_path: "/backdrop2.jpg",
      release_date: "2023-02-01",
      vote_average: 7.9,
    },
  ];

  const popularMovies = [
    {
      id: "3",
      title: "Popular Movie 1",
      poster_path: "/path3.jpg",
      backdrop_path: "/backdrop3.jpg",
      release_date: "2023-03-01",
      vote_average: 8.8,
    },
    {
      id: "4",
      title: "Popular Movie 2",
      poster_path: "/path4.jpg",
      backdrop_path: "/backdrop4.jpg",
      release_date: "2023-04-01",
      vote_average: 8.3,
    },
  ];
  beforeEach(() => {
    (listTrendingMovies as jest.Mock).mockResolvedValue({
      data: { results: trendingMovies },
    });

    (listPopularMovies as jest.Mock).mockResolvedValue({
      data: { results: popularMovies },
    });
  });

  it("renders the Home component sections", async () => {
    const context: GetStaticPropsContext = {};
    const result = await getStaticProps(context);
    const props = (result as GetStaticPropsResult<HomeProps>)?.props;

    render(<Home {...props} />);

    expect(screen.getByText("Most Popular")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Trending( in .+)?$/ })
    ).toBeInTheDocument();

    expect(screen.getAllByText("Trending Movie 1").length).toBeGreaterThan(0);
    expect(screen.getByText("Popular Movie 1")).toBeInTheDocument();
  });

  it("fetches trending and popular movies in getStaticProps", async () => {
    (listTrendingMovies as jest.Mock).mockResolvedValue(trendingMovies);
    (listPopularMovies as jest.Mock).mockResolvedValue(popularMovies);

    const context: GetStaticPropsContext = {};
    const result = await getStaticProps(context);
    const props = (result as GetStaticPropsResult<HomeProps>)?.props;

    expect(listTrendingMovies).toHaveBeenCalled();
    expect(listPopularMovies).toHaveBeenCalled();

    expect((result as GetStaticPropsResult<HomeProps>).revalidate).toBe(
      60 * 60 * 24
    );
  });
});
