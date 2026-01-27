import { render, screen } from "@/test/test-utils";

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

  it("should render search link (mobile)", () => {
    render(<Header />);

    const searchIcon = screen.getByTestId("search-icon-mobile");
    const linkToSearch = screen.getByTestId("to-search-mobile");

    expect(searchIcon).toBeVisible();
    expect(linkToSearch).toBeVisible();
  });
});
