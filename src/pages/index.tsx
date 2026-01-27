import { useMemo, useState, type ComponentType } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";

import { CardProps } from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { listTrendingMovies, listPopularMovies } from "@/services/movies";
import Image from "next/image";
import Link from "next/link";
import {
  HiAdjustmentsHorizontal,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";
import {
  LuGhost,
  LuHeart,
  LuMoon,
  LuSparkles,
  LuStar,
  LuSwords,
  LuTrendingUp,
} from "react-icons/lu";
import { FaPlay } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

export interface HomeProps {
  trendingMovies: CardProps[];
  popularMovies: CardProps[];
}

const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w342";

function getYear(date?: string) {
  if (!date) return "";
  const year = new Date(date).getFullYear();
  return Number.isFinite(year) ? String(year) : "";
}

function formatRating(rating?: number) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return "";
  return rating.toFixed(1);
}

function getBackdropSrc(movie: Partial<CardProps> & { backdrop_path?: string }) {
  if (movie.backdrop_path) return `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`;
  if (movie.poster_path) return `${TMDB_POSTER_BASE}${movie.poster_path}`;
  return "/image-default-movie.svg";
}

function getPosterSrc(movie: Partial<CardProps>) {
  if (movie.poster_path) return `${TMDB_POSTER_BASE}${movie.poster_path}`;
  return "/image-default-movie.svg";
}

type GenreKey = "trending" | "action" | "romance" | "animation" | "horror" | "special" | "darker";

const GENRE_FILTERS: Array<{
  key: GenreKey;
  label: string;
  widthClass: string;
  genreIds?: number[];
  Icon: ComponentType<{ className?: string }>;
}> = [
  // Icons mapped to match the Figma SVGs (stroke-style).
  { key: "trending", label: "Trending", widthClass: "w-[134px]", Icon: LuTrendingUp },
  { key: "action", label: "Action", widthClass: "w-[118px]", genreIds: [28], Icon: LuSwords },
  { key: "romance", label: "Romance", widthClass: "w-[137px]", genreIds: [10749], Icon: LuHeart },
  { key: "animation", label: "Animation", widthClass: "w-[142px]", genreIds: [16], Icon: LuSparkles },
  { key: "horror", label: "Horror", widthClass: "w-[119px]", genreIds: [27], Icon: LuGhost },
  // These two labels exist in the Figma UI but aren't official TMDB genre names.
  // We map them to "fantasy/sci-fi" and "thriller/crime" so the chips still filter meaningfully.
  { key: "special", label: "Special", widthClass: "w-[124px]", genreIds: [14, 878], Icon: LuStar },
  { key: "darker", label: "Darker", widthClass: "w-[120px]", genreIds: [53, 80], Icon: LuMoon },
];

function movieMatchesGenre(movie: Partial<CardProps>, genreIds?: number[]) {
  if (!genreIds || genreIds.length === 0) return true;
  const ids = (movie.genre_ids || []) as number[];
  return ids.some((id) => genreIds.includes(id));
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
  const [activeGenre, setActiveGenre] = useState<GenreKey>("trending");

  const hero = (trendingMovies || []).slice(0, 2);
  const mostPopular = (popularMovies || []).slice(0, 4);

  const activeFilter = useMemo(() => {
    return GENRE_FILTERS.find((f) => f.key === activeGenre) || GENRE_FILTERS[0];
  }, [activeGenre]);

  const filteredTrending = useMemo(() => {
    const source = trendingMovies || [];
    if (activeGenre === "trending") return source;
    return source.filter((m) => movieMatchesGenre(m, activeFilter.genreIds));
  }, [activeFilter.genreIds, activeGenre, trendingMovies]);

  const trendingRow = filteredTrending.slice(0, 6);

  const isEmpty = hero.length === 0 && mostPopular.length === 0 && trendingRow.length === 0;

  return (
    <>
      <Head>
        <title>Movie Magic — Home</title>
        <meta
          name="description"
          content="Discover trending and popular movies with Movie Magic."
        />
        <meta property="og:title" content="Movie Magic — Home" />
        <meta
          property="og:description"
          content="Discover trending and popular movies with Movie Magic."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="pt-6 sm:pt-8">
      {isEmpty ? (
        <EmptyState
          title="Não foi possível carregar os filmes agora"
          description="Parece que estamos com instabilidade para buscar os filmes. Tente novamente em instantes."
          actionLabel="Ir para busca"
          actionHref="/search"
        />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            {hero.map((movie) => (
              <Link
                key={String(movie.id)}
                href={`/movie/${String(movie.id)}`}
                className="group relative h-[220px] sm:h-[280px] overflow-hidden rounded-3xl"
                aria-label={`Open ${movie.title}`}
              >
                <Image
                  src={getBackdropSrc(movie)}
                  alt={movie.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                <div className="absolute left-6 top-1/2 -translate-y-[10%] max-w-[28rem]">
                  <h2 className="text-balance text-2xl sm:text-4xl font-bold leading-tight tracking-tight">
                    {movie.title}
                  </h2>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/10">
                    <FaPlay className="text-sm" />
                    Let Play Moview
                  </span>
                </div>
              </Link>
            ))}
          </section>

          <section className="mt-10">
            <div className="flex items-center gap-3">
              <LuTrendingUp className="text-lg text-white/80" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Most Popular</h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mostPopular.map((movie) => (
                <Link
                  key={String(movie.id)}
                  href={`/movie/${String(movie.id)}`}
                  className="group relative h-[220px] overflow-hidden rounded-3xl"
                >
                  <Image
                    src={getBackdropSrc(movie)}
                    alt={movie.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  {!!formatRating(movie.vote_average) && (
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-2xl bg-black/80 px-3 py-2 text-sm font-semibold text-white">
                      <IoStar className="text-amber-300" />
                      {formatRating(movie.vote_average)}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-medium text-amber-300/90">
                      Movie • Popular
                    </p>
                    <h3 className="mt-1 text-lg font-bold tracking-tight">{movie.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
                      <span>{getYear(movie.release_date)}</span>
                      {!!formatRating(movie.vote_average) && (
                        <span className="inline-flex items-center gap-1">
                          <IoStar className="text-amber-300" />
                          {formatRating(movie.vote_average)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {GENRE_FILTERS.map(({ key, label, widthClass, Icon }) => {
                const isActive = key === activeGenre;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveGenre(key)}
                    className={[
                      "h-11 rounded-2xl transition",
                      widthClass,
                      isActive ? "bg-white/30" : "bg-white/10 hover:bg-white/15",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    <span className="h-full w-full inline-flex items-center justify-center gap-2 px-6">
                      <Icon
                        className={["h-5 w-5 shrink-0", isActive ? "text-white" : "text-white/70"].join(" ")}
                      />
                      <span
                        className={[
                          "text-sm font-medium",
                          isActive ? "text-white" : "text-white/70",
                        ].join(" ")}
                      >
                        {label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {activeGenre === "trending" ? "Trending" : `Trending in ${activeFilter.label}`}
              </h2>

              <div className="flex items-center gap-2">
                <button type="button" className="mm-iconButton p-2.5" aria-label="Filter">
                  <HiAdjustmentsHorizontal className="text-lg text-white/90" />
                </button>
                <button type="button" className="mm-iconButton p-2.5" aria-label="Sort">
                  <HiMiniArrowsUpDown className="text-lg text-white/90" />
                </button>
              </div>
            </div>

            <div className="mt-5 w-full overflow-x-auto scrollbar scrollbar-thumb-slate-500/70 scrollbar-track-transparent">
              <div className="flex gap-4 pr-2">
                {trendingRow.map((movie) => (
                  <Link
                    key={String(movie.id)}
                    href={`/movie/${String(movie.id)}`}
                    className="group shrink-0 w-[170px] sm:w-[220px]"
                  >
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-3xl bg-black/20 ring-1 ring-white/10">
                      <Image
                        src={getPosterSrc(movie)}
                        alt={movie.title}
                        fill
                        sizes="220px"
                        className="object-contain"
                      />
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-semibold tracking-tight truncate">
                        {movie.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                        <span>{getYear(movie.release_date)}</span>
                        {!!formatRating(movie.vote_average) && (
                          <span className="inline-flex items-center gap-1 text-white/70">
                            <IoStar className="text-amber-300" />
                            {formatRating(movie.vote_average)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      </main>
    </>
  );
}
