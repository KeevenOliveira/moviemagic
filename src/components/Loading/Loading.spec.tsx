import { render, screen } from "@/test/test-utils";
import Loading from ".";

describe("<Loading/>", () => {
  it("renders the loading spinner", () => {
    render(<Loading />);
    const spinnerElement = screen.getByRole("status");
    expect(spinnerElement).toBeInTheDocument();
  });

  it("renders the SVG element with correct attributes", () => {
    render(<Loading />);
    const svgElement = screen.getByRole("status").querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute("aria-hidden", "true");
    expect(svgElement).toHaveClass(
      "w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
    );
  });

  it("renders the hidden loading text for screen readers", () => {
    render(<Loading />);
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass("sr-only");
  });
});
