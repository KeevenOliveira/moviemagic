import { render, screen, fireEvent } from "@/test/test-utils";
import Card, { CardProps } from ".";
import { convertDate } from "@/utils/convertDate";

jest.mock("@/utils/convertDate", () => ({
  convertDate: jest.fn((date) => date),
}));

describe("<Card/>", () => {
  const defaultProps: CardProps = {
    id: "1",
    title: "Test Movie",
    poster_path: "/test-poster.jpg",
    release_date: "2023-01-01",
  };

  it("renders the card with the correct details", () => {
    render(<Card {...defaultProps} />);

    const linkElement = screen.getByTestId("card");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", `/movie/${defaultProps.id}`);

    const imageElement = screen.getByRole("img", { name: /Test Movie/i });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", expect.stringContaining("test-poster.jpg"));

    const titleElement = screen.getByText(defaultProps.title);
    expect(titleElement).toBeInTheDocument();

    const releaseDateElement = screen.getByText(defaultProps.release_date);
    expect(releaseDateElement).toBeInTheDocument();
  });

  it("handles image error and sets default image", () => {
    render(<Card {...defaultProps} />);

    const imageElement = screen.getByRole("img", { name: /Test Movie/i });
    expect(imageElement).toBeInTheDocument();

    fireEvent.error(imageElement);

    expect(imageElement).toHaveAttribute(
      "src",
      "http://localhost/image-default-movie.svg"
    );
  });

  it("correctly formats the release date using convertDate", () => {
    render(<Card {...defaultProps} />);

    expect(convertDate).toHaveBeenCalledWith(defaultProps.release_date);
    const releaseDateElement = screen.getByText(defaultProps.release_date);
    expect(releaseDateElement).toBeInTheDocument();
  });
});
