import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";

import { getMovieById, listSimilarMovies } from "@/services/movies";
import { Movie as MovieProps } from "@/types/movies";
import { convertDate } from "@/utils/convertDate";
import CardList from "@/components/CardList";
import type { CardProps } from "@/components/Card";

export interface MoviePageProps {
  movie: MovieProps;
  similarMovies: CardProps[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<MoviePageProps> = async ({
  params,
}) => {
  const movieId = params?.movieId as string;
  const response = await getMovieById(movieId);
  const movie = response.data;

  if (!movie) {
    return {
      notFound: true,
    };
  }

  let similarMovies: CardProps[] = [];

  try {
    const similarResponse = await listSimilarMovies(movieId);
    similarMovies = similarResponse.data.results;
  } catch (error) {
    console.error("Error fetching similar movies", error);
  }

  return {
    props: {
      movie,
      similarMovies,
    },
    revalidate: 60 * 60 * 24, // 24 hours,
  };
};

const Movie = ({ movie, similarMovies }: MoviePageProps) => {
  const [image, setImage] = useState(
    process.env.NEXT_PUBLIC_THE_MOVIE_URL_IMAGES + movie?.poster_path
  );

  const onErrorImage = () => {
    setImage("/image-default-movie.svg");
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src={image}
          alt={movie?.title}
          width={160}
          height={240}
          onError={onErrorImage}
          loading="lazy"
          className="rounded-xl"
        />
        <h1 className="text-center">{movie?.title} </h1>
        <p className="text-gray-500">
          {convertDate(movie?.release_date, "yyyy")}
        </p>
      </div>
      <div className="p-4">
        <h2>Overview</h2>
        <p className="font-light text-gray-300 bold text-[0.9rem]">
          {movie?.overview}
        </p>
      </div>
      {!!similarMovies?.length && (
        <CardList title="Similar Movies" cards={similarMovies} />
      )}
    </main>
  );
};

export default Movie;
