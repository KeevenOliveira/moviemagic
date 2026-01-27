import Image from "next/image";
import Link from "next/link";
import { IoStar } from "react-icons/io5";

export type DiscoverCardProps = {
  id: string | number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
};

function joinUrl(base: string, path?: string | null) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = (path || "").replace(/^\/+/, "");
  if (!trimmedBase) return "/image-default-movie.svg";
  if (!trimmedPath) return "/image-default-movie.svg";
  return `${trimmedBase}/${trimmedPath}`;
}

function getYear(date?: string) {
  if (!date) return "";
  const year = new Date(date).getFullYear();
  return Number.isFinite(year) ? String(year) : "";
}

function formatRating(rating?: number) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return "";
  return rating.toFixed(1);
}

export default function DiscoverCard({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
}: DiscoverCardProps) {
  const baseImageUrl = process.env.NEXT_PUBLIC_THE_MOVIE_URL_IMAGES ?? "";
  const posterSrc = poster_path
    ? joinUrl(baseImageUrl, poster_path)
    : "/image-default-movie.svg";
  const year = getYear(release_date);
  const rating = formatRating(vote_average);

  return (
    <Link
      href={`/movie/${String(id)}`}
      className="group"
      aria-label={`Open ${title}`}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transition group-hover:bg-white/8">
        <div className="relative aspect-[2/3]">
          <Image
            src={posterSrc}
            alt={title}
            fill
            sizes="(min-width: 1024px) 220px, 45vw"
            className="object-contain"
          />
        </div>

        {!!rating && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
            <IoStar className="text-amber-300" />
            {rating}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="truncate text-sm font-semibold tracking-tight text-white/95">
          {title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
          {!!year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
}

