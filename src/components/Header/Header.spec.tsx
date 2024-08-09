import { render, screen } from "@/test/test-utils";
import { usePathname } from "next/navigation";

import Header from ".";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("<Header/>", () => {
  it("should render Header", () => {
    render(<Header />);

    const text = screen.getByText("Movie Magic");
    const logo = screen.getByTestId("logo");

    expect(logo).toBeVisible();
    expect(text).toBeInTheDocument();
  });

  it("should render ActiveLink", () => {
    render(<Header />);

    const searchIcon = screen.getByTestId("search-icon");
    const linkToSearch = screen.getByTestId("to-search");

    expect(searchIcon).toBeVisible();
    expect(linkToSearch).toBeVisible();
  });

  it("should be able render home icon", () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/search");

    render(<Header />);

    const homeIcon = screen.getByTestId("home-icon");
    const linkToHome = screen.getByTestId("to-home");
    const text = screen.getByText("Movie Magic");

    expect(homeIcon).toHaveProperty("tagName", "svg");
    expect(homeIcon).toHaveClass("text-3xl text-white-500");
    expect(text).toBeVisible();
    expect(homeIcon).toBeInTheDocument();
    expect(linkToHome).toBeVisible();
  });
});
