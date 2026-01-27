"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HiChevronDown, HiOutlineBell, HiUserCircle } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";

const Header = () => {
  const pathName = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isMoviesActive = useMemo(() => {
    return pathName === "/";
  }, [pathName]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 pt-4 transition",
        isScrolled ? "backdrop-blur-xl bg-slate-950/35 border-b border-white/10" : "bg-transparent",
      ].join(" ")}
    >
      <div className="mm-container pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="logo">
              <h4 className="text-xl font-bold tracking-tight">Movie Magic</h4>
            </Link>

            <nav
              className="hidden sm:flex items-center rounded-full bg-black/40 p-1"
              aria-label="Primary navigation"
            >
              <Link
                href="/"
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isMoviesActive ? "bg-white text-black" : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                Movie
              </Link>
              <Link
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition"
              >
                Series
              </Link>
              <Link
                href="#"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition"
              >
                Originals
              </Link>
              <Link
                href="/search?focus=1"
                className="rounded-full p-2 text-white/70 hover:text-white transition"
                aria-label="Search"
                data-testid="to-search"
              >
                <IoSearch data-testid="search-icon" className="text-lg" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
              aria-label="Notifications"
            >
              <HiOutlineBell className="text-lg text-white/90" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <button
              type="button"
              className="mm-glass rounded-full pl-3 pr-2 py-2 flex items-center gap-2"
              aria-label="Account"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                <HiUserCircle className="h-7 w-7 text-white/80" aria-hidden="true" focusable="false" />
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-white">Sarah J</span>
                <span className="text-xs text-white/60">Premium</span>
              </span>
              <HiChevronDown className="text-white/70" />
            </button>

            <Link
              href="/search?focus=1"
              className="sm:hidden mm-iconButton p-3"
              aria-label="Search"
              data-testid="to-search-mobile"
            >
              <IoSearch data-testid="search-icon-mobile" className="text-xl text-slate-100" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
