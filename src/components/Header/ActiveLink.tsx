import { IoSearch } from "react-icons/io5";
import { HiHome } from "react-icons/hi2";
import Link from "next/link";

interface ChangeHeaderIconProps {
  isSearch?: boolean;
}

const ChangeHeaderIcon = ({ isSearch }: ChangeHeaderIconProps) => {
  if (isSearch) {
    return (
      <Link href="/" data-testid="to-home">
        <span className="mm-iconButton">
          <HiHome data-testid="home-icon" className="text-xl text-slate-100" />
        </span>
      </Link>
    );
  }

  return (
    <Link href="/search?focus=1" data-testid="to-search">
      <span className="mm-iconButton">
        <IoSearch
          data-testid="search-icon"
          className="text-xl text-slate-100"
        />
      </span>
    </Link>
  );
};

export default ChangeHeaderIcon;
