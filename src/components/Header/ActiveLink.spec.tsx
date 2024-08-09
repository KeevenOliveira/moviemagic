import { render, screen } from "@/test/test-utils";

import ChangeHeaderPage from "./ActiveLink";

const renderChangeHeaderPage = (isSearch?: boolean) => {
  return render(<ChangeHeaderPage isSearch={isSearch} />);
};

describe("<ActiveLink/>", () => {
  it("renders the home icon when isSearch is true", () => {
    renderChangeHeaderPage(true);
    const homeLink = screen.getByTestId("to-home");
    const homeIcon = screen.getByTestId("home-icon");

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeIcon).toBeInTheDocument();
    expect(homeIcon).toHaveClass("text-3xl text-white-500");
  });

  it("renders the search icon when isSearch is false", () => {
    renderChangeHeaderPage(false);
    const searchLink = screen.getByTestId("to-search");
    const searchIcon = screen.getByTestId("search-icon");

    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/search");
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass("text-3xl text-white-500");
  });

  it("renders the search icon when isSearch is undefined", () => {
    renderChangeHeaderPage();
    const searchLink = screen.getByTestId("to-search");
    const searchIcon = screen.getByTestId("search-icon");

    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/search");
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon).toHaveClass("text-3xl text-white-500");
  });
});
