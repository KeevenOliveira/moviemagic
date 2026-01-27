import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { convertDate } from "@/utils/convertDate";

function joinUrl(base: string, path?: string | null) {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = (path || "").replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
}

export interface CardProps {
  title: string;
  poster_path: string | null;
  release_date: string;
  id: string | number;
  className?: string;
  vote_average?: number;
  backdrop_path?: string;
  genre_ids?: number[];
}

const Card = ({ poster_path, release_date, title, id, className, vote_average }: CardProps) => {
  const baseImageUrl = process.env.NEXT_PUBLIC_THE_MOVIE_URL_IMAGES ?? "";
  const initialImage = poster_path ? joinUrl(baseImageUrl, poster_path) : "/image-default-movie.svg";
  const [image, setImage] = useState(
    initialImage
  );

  const url = useMemo(() => {
    return `/movie/${String(id)}`;
  }, [id]);

  const onError = () => {
    setImage("/image-default-movie.svg");
  };

  const rating =
    typeof vote_average === "number" && Number.isFinite(vote_average)
      ? vote_average.toFixed(1)
      : "";

  return (
    <Link
      data-testid="card"
      href={url}
      className={[
        "group shrink-0 w-[170px] sm:w-[190px]",
        className,
      ].filter(Boolean).join(" ")}
    >
      <div className="mm-surface rounded-3xl p-3 transition group-hover:bg-white/12 group-hover:-translate-y-0.5">
        <div className="relative h-[220px] sm:h-[240px] overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5">
          <Image
            src={image}
            alt={title}
            fill
            sizes="190px"
            onError={onError}
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />

          {!!rating && (
            <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/10">
              {rating}
            </div>
          )}
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-semibold tracking-tight text-slate-100/95 truncate">
            {title}
          </h4>
          <p className="mt-1 text-xs text-slate-200/60 font-light truncate">
            {convertDate(release_date)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
