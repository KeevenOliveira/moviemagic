"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { MdMovieFilter } from "react-icons/md";

import ActiveLink from "./ActiveLink";

const Header = () => {
  const pathName = usePathname();

  const isSearch = useMemo(() => {
    return pathName === "/search";
  }, [pathName]);

  return (
    <header className="flex justify-between pt-2 p-3">
      <Link href="/" className="flex items-center" data-testid="logo">
        <MdMovieFilter className="text-2xl text-blue-400 mr-2" />
        <h4>Movie Magic</h4>
      </Link>

      <ActiveLink isSearch={isSearch} />
    </header>
  );
};

export default Header;
