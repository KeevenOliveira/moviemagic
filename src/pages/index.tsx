import { GetStaticProps } from "next";

import CardList from "@/components/CardList";
import { CardProps } from "@/components/Card";
import { listTrendingMovies, listPopularMovies } from "@/services/movies";

export interface HomeProps {
  trendingMovies: CardProps[];
  popularMovies: CardProps[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const trendingResponse = await listTrendingMovies();
  const popularResponse = await listPopularMovies();

  return {
    props: {
      trendingMovies: trendingResponse?.data?.results,
      popularMovies: popularResponse?.data?.results,
    },
    revalidate: 60 * 60 * 24, // 24 hours,
  };
};

export default function Home({ trendingMovies, popularMovies }: HomeProps) {
  return (
    <main>
      <CardList cards={trendingMovies} title="Trending" />
      <CardList cards={popularMovies} title="Popular" />
    </main>
  );
}
