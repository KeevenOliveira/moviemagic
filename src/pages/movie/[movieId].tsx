import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";

import {
  getMovieById,
  listSimilarMovies,
  getMovieCredits,
  getMovieVideos,
  getMovieReviews,
  getMovieWatchProviders,
  type MovieCreditsResponse,
  type MovieReviewsResponse,
  type MovieVideosResponse,
  type WatchProvider,
} from "@/services/movies";
import { Movie as MovieProps } from "@/types/movies";
import { convertDate } from "@/utils/convertDate";
import CardList from "@/components/CardList";
import type { CardProps } from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import CircularRating from "@/components/CircularRating";
import { HiChevronLeft, HiEllipsisHorizontal, HiOutlineBookmark, HiOutlineShare } from "react-icons/hi2";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export interface MoviePageProps {
  movie: MovieProps;
  similarMovies: CardProps[];
  credits: MovieCreditsResponse;
  videos: MovieVideosResponse;
  reviews: MovieReviewsResponse;
  watchProviders: WatchProvider[];
  watchProvidersLink?: string;
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
  const movie = response.data as MovieProps | null;

  if (!movie) {
    return {
      notFound: true,
    };
  }

  const [similarRes, creditsRes, videosRes, reviewsRes] = await Promise.all([
    listSimilarMovies(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getMovieReviews(movieId, 1),
  ]);

  const similarMovies = (similarRes?.data?.results || []) as CardProps[];
  const credits = (creditsRes?.data || { id: Number(movieId), cast: [] }) as MovieCreditsResponse;
  const videos = (videosRes?.data || { id: Number(movieId), results: [] }) as MovieVideosResponse;
  const reviews = (reviewsRes?.data || {
    id: Number(movieId),
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  }) as MovieReviewsResponse;

  const watchProvidersRes = await getMovieWatchProviders(movieId);
  const watchResults = (watchProvidersRes?.data?.results || {}) as Record<
    string,
    { link?: string; flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] }
  >;

  const regionPreference = ["BR", "US"];
  const regionKey =
    regionPreference.find((k) => Boolean(watchResults[k])) ||
    Object.keys(watchResults)[0];
  const region = (regionKey && watchResults[regionKey]) || undefined;
  const list = [
    ...(region?.flatrate || []),
    ...(region?.rent || []),
    ...(region?.buy || []),
  ];
  const uniqueById = new Map<number, WatchProvider>();
  for (const p of list) {
    if (typeof p?.provider_id !== "number") continue;
    if (!uniqueById.has(p.provider_id)) uniqueById.set(p.provider_id, p);
  }
  const watchProviders = Array.from(uniqueById.values())
    .sort((a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999))
    .slice(0, 8);
  const watchProvidersLink = region?.link;

  return {
    props: {
      movie,
      similarMovies,
      credits,
      videos,
      reviews,
      watchProviders,
      watchProvidersLink,
    },
    revalidate: 60 * 60 * 24,
  };
};

function joinUrl(base: string, path?: string | null) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = (path || "").replace(/^\/+/, "");
  return trimmedPath ? `${trimmedBase}/${trimmedPath}` : "/image-default-movie.svg";
}

const TMDB_POSTER_LARGE = "https://image.tmdb.org/t/p/w780";
const TMDB_BACKDROP_LARGE = "https://image.tmdb.org/t/p/w1280";
const TMDB_LOGO = "https://image.tmdb.org/t/p/w154";

const Movie = ({ movie, similarMovies, credits, videos, reviews, watchProviders, watchProvidersLink }: MoviePageProps) => {
  const router = useRouter();

  const baseImageUrl = process.env.NEXT_PUBLIC_THE_MOVIE_URL_IMAGES ?? "";
  const initialPoster = movie?.poster_path
    ? joinUrl(TMDB_POSTER_LARGE, movie.poster_path)
    : "/image-default-movie.svg";
  const [posterSrc, setPosterSrc] = useState(initialPoster);

  useEffect(() => {
    setPosterSrc(
      movie?.poster_path
        ? joinUrl(TMDB_POSTER_LARGE, movie.poster_path)
        : "/image-default-movie.svg",
    );
  }, [movie?.poster_path]);

  const trailer = useMemo(() => {
    const candidates = (videos?.results || []).filter((v) => v?.site === "YouTube");
    const trailerLike =
      candidates.find((v) => String(v.type).toLowerCase() === "trailer") ||
      candidates.find((v) => String(v.type).toLowerCase() === "teaser") ||
      candidates[0];
    return trailerLike?.key ? `https://www.youtube.com/embed/${trailerLike.key}` : null;
  }, [videos?.results]);

  const topCast = useMemo(() => {
    return (credits?.cast || [])
      .slice()
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .slice(0, 4);
  }, [credits?.cast]);

  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>Loading movie… — Movie Magic</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main className="pt-6">
          <div className="mm-glass rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-sm text-slate-200/70">Carregando filme…</p>
          </div>
        </main>
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Head>
          <title>Movie not found — Movie Magic</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main className="pt-6">
          <EmptyState
            title="Não foi possível carregar este filme"
            description="Pode ser instabilidade na API ou o filme não existe mais. Tente novamente."
            actionLabel="Voltar para a home"
            actionHref="/"
          />
        </main>
      </>
    );
  }

  const year = movie?.release_date ? convertDate(movie.release_date, "yyyy") : "";
  const genresLabel = (movie?.genres || []).map((g) => g.name).filter(Boolean).join(" • ");
  const rating = Number.isFinite(movie?.vote_average) ? movie.vote_average : 0;
  const ratedLabel = movie?.vote_count
    ? `${Math.round(movie.vote_count / 1000)}K Rated`
    : "Rated";

  const onPosterError = () => setPosterSrc("/image-default-movie.svg");
  const pageTitle = `${movie.title}${year ? ` (${year})` : ""} — Movie Magic`;
  const description =
    (movie.overview || "").trim().slice(0, 180) ||
    "Movie details, trailer, cast, reviews, and recommended movies.";
  const ogImage = movie.backdrop_path
    ? joinUrl(TMDB_BACKDROP_LARGE, movie.backdrop_path)
    : movie.poster_path
      ? joinUrl(TMDB_POSTER_LARGE, movie.poster_path)
      : undefined;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="video.movie" />
        {!!ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="pt-6">
      <div className="mb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm text-white/90 hover:bg-black/45 transition"
        >
          <HiChevronLeft className="text-lg" />
          Back to Home
        </Link>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="mm-glass rounded-3xl p-4 sm:p-5">
            <div className="flex justify-center">
              <Image
                src={posterSrc}
                alt={movie?.title || "Movie poster"}
                width={320}
                height={480}
                quality={90}
                onError={onPosterError}
                loading="lazy"
                className="rounded-3xl ring-1 ring-white/10 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.9)]"
              />
            </div>

            <div className="mt-5">
              <h1 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight">
                {movie?.title}
              </h1>
              <p className="mt-2 text-center text-sm text-white/60">
                {[year, genresLabel].filter(Boolean).join(" • ")}
              </p>
              {!!movie?.runtime && (
                <p className="mt-1 text-center text-xs text-white/45">
                  {movie.runtime} min
                </p>
              )}

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-white/90 transition"
                >
                  Watch
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white/85 hover:bg-white/15 transition"
                >
                  + Add to watch later
                </button>
              </div>

              {!!watchProviders?.length && (
                <div className="mt-5">
                  <div className="text-center text-xs text-white/55">
                    Available on
                  </div>
                  <div className="mt-3 w-full overflow-x-auto scrollbar scrollbar-thumb-slate-500/70 scrollbar-track-transparent">
                    <div className="flex justify-center gap-3 min-w-max px-1 pb-1">
                    {watchProviders.map((p) => (
                      <a
                        key={p.provider_id}
                        href={watchProvidersLink || "#"}
                        target={watchProvidersLink ? "_blank" : undefined}
                        rel={watchProvidersLink ? "noreferrer" : undefined}
                        className="relative h-11 w-11 overflow-hidden rounded-2xl bg-black/25 ring-1 ring-white/10 hover:bg-white/10 transition"
                        aria-label={p.provider_name}
                        title={p.provider_name}
                      >
                        <Image
                          src={p.logo_path ? joinUrl(TMDB_LOGO, p.logo_path) : "/image-default-movie.svg"}
                          alt={p.provider_name}
                          width={44}
                          height={44}
                          sizes="44px"
                          quality={90}
                          className="h-full w-full object-contain p-2"
                        />
                      </a>
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="mm-glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Recommended Movies
              </h2>
              <span className="mm-chip">Explore</span>
            </div>
            <div className="mt-2">
              <CardList title="Recommended Movies" cards={similarMovies} variant="embedded" />
            </div>
          </div>

          <div className="mm-glass rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
              <div className="flex items-center gap-2 text-white/75">
                <button type="button" className="mm-iconButton p-2" aria-label="Share">
                  <HiOutlineShare />
                </button>
                <button type="button" className="mm-iconButton p-2" aria-label="Bookmark">
                  <HiOutlineBookmark />
                </button>
                <button type="button" className="mm-iconButton p-2" aria-label="More">
                  <HiEllipsisHorizontal />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center">
              <CircularRating rating={rating} caption={ratedLabel} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/15 grid place-items-center">
                  <span className="h-5 w-5 rounded-full bg-rose-500" />
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  {Math.round(rating * 10)}%
                </div>
                <div className="mt-1 text-sm text-white/55">Likes</div>
              </div>

              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-400/20 grid place-items-center">
                  <div className="text-[0.95rem] font-extrabold tracking-tight text-amber-300">
                    IMDb
                  </div>
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  {rating.toFixed(1)}
                </div>
                <div className="mt-1 text-sm text-white/55">Rating</div>
              </div>

              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-400/15 grid place-items-center">
                  <HiMiniArrowTrendingUp className="text-2xl text-emerald-300" />
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  {Math.round(rating * 10)}%
                </div>
                <div className="mt-1 text-sm text-white/55">Fresh</div>
              </div>
            </div>

            {!!reviews?.results?.length && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white/90">
                    Critic Reviews
                  </h3>
                  <span className="text-xs text-white/55">See all</span>
                </div>

                <div className="mt-3 space-y-3">
                  {reviews.results.slice(0, 2).map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl bg-white/6 border border-white/10 p-4"
                    >
                      <div className="text-sm font-semibold text-white/90">
                        {r.author}
                      </div>
                      <div className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-3">
                        {r.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="mm-glass rounded-3xl overflow-hidden">
            <div className="relative">
              {trailer ? (
                <div className="aspect-video bg-black">
                  <iframe
                    title={`${movie?.title || "Movie"} trailer`}
                    src={trailer}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <Image
                    src={movie?.backdrop_path ? joinUrl(TMDB_BACKDROP_LARGE, movie.backdrop_path) : "/image-default-movie.svg"}
                    alt={movie?.title || "Movie"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="text-sm font-semibold text-white/90">
                {movie?.title}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {genresLabel || " "}
              </div>
              <p className="mt-3 text-xs text-white/60 leading-relaxed line-clamp-4">
                {movie?.overview}
              </p>
            </div>
          </div>

          <div className="mm-glass rounded-3xl p-5">
            <h2 className="text-lg font-semibold tracking-tight">Cast</h2>
            {!topCast.length ? (
              <div className="mt-6 text-sm text-white/60">No cast information.</div>
            ) : (
              <div className="mt-6 w-full overflow-x-auto scrollbar scrollbar-thumb-slate-500/70 scrollbar-track-transparent">
                <div className="flex gap-6 pr-2">
                  {topCast.map((person) => (
                    <div key={person.id} className="shrink-0 w-[118px]">
                      <div className="relative mx-auto h-[72px] w-[72px] overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5">
                        <Image
                          src={
                            person.profile_path
                              ? joinUrl(baseImageUrl, person.profile_path)
                              : "/image-default-movie.svg"
                          }
                          alt={person.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 text-center text-sm font-semibold text-white/90 leading-tight line-clamp-2">
                        {person.name}
                      </div>
                      {!!person.character && (
                        <div className="mt-2 text-center text-xs text-white/55 leading-snug line-clamp-2">
                          {person.character}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mm-glass rounded-3xl p-5">
            <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-white/90 transition"
              >
                App Settings
              </button>
              {["Account", "Notification", "Help", "Log out"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full rounded-xl bg-white/6 px-4 py-3 text-left text-sm font-medium text-white/80 hover:bg-white/10 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
};

export default Movie;
