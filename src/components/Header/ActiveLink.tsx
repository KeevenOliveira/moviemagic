import { IoSearch } from "react-icons/io5";
import { HiHome } from "react-icons/hi2";
import Link from "next/link";

interface ChangeHeaderIconProps {
  isSearch?: boolean;
}

const ChangeHeaderIcon = ({ isSearch }: ChangeHeaderIconProps) => {
  console.log(isSearch);
  if (isSearch) {
    return (
      <Link href="/" data-testid="to-home">
        <HiHome data-testid="home-icon" className="text-3xl text-white-500" />
      </Link>
    );
  }

  return (
    <Link href="/search" data-testid="to-search">
      <IoSearch data-testid="search-icon" className="text-3xl text-white-500" />
    </Link>
  );
};

export default ChangeHeaderIcon;
