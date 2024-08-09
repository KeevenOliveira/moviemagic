import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { convertDate } from "@/utils/convertDate";

export interface CardProps {
  title: string;
  poster_path: string;
  release_date: string;
  id: string;
  className?: string;
}

const Card = ({ poster_path, release_date, title, id }: CardProps) => {
  const [image, setImage] = useState(
    "https://media.themoviedb.org/t/p/w220_and_h330_face" + poster_path
  );

  const url = useMemo(() => {
    return `/movie/${id}`;
  }, [id]);

  const onError = () => {
    setImage("/image-default-movie.svg");
  };

  return (
    <Link
      data-testid="card"
      href={url}
      className="inline-block w-auto h-96 ml-4 text-center"
    >
      <Image
        src={image}
        alt={title}
        width={160}
        onError={onError}
        height={240}
        className="rounded-xl"
      />
      <div className="w-[10rem] text-center">
        <h4 className="mt-2 text-wrap">{title}</h4>
        <p className="text-slate-400 font-light">{convertDate(release_date)}</p>
      </div>
    </Link>
  );
};

export default Card;
