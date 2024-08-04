import { render, screen } from "@/test/test-utils";

import ChangeHeaderPage from "./ActiveLink";

const renderChangeHeaderPage = (isSearch?: boolean) => {
  return render(<ChangeHeaderPage isSearch={isSearch} />);
};

describe("<ChangeHeaderPage/>", () => {
  it("should render ChangeHeaderPage", () => {
    renderChangeHeaderPage();

    const searchIcon = screen.getByTestId("search-icon");
    const linkToSearch = screen.getByTestId("to-search");

    expect(searchIcon).toBeVisible();
    expect(linkToSearch).toBeVisible();
  });

  it("should be able render home icon", () => {
    renderChangeHeaderPage(true);

    const homeIcon = screen.getByTestId("home-icon");
    const linkToHome = screen.getByTestId("to-home");

    expect(homeIcon).toHaveProperty("tagName", "svg");
    expect(homeIcon).toHaveClass("text-3xl text-white-500");

    expect(homeIcon).toBeInTheDocument();
    expect(linkToHome).toBeVisible();
  });
});
