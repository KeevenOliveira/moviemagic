/* eslint-disable react/display-name */
import { render, screen } from "@testing-library/react";
import CardList, { CardListProps } from ".";

jest.mock("@/components/Card", () => (props: any) => (
  <div data-testid="card" {...props}>
    {props.title}
  </div>
));

describe("<CardList/>", () => {
  const defaultProps: CardListProps = {
    title: "Test Card List",
    cards: [
      {
        id: "1",
        title: "Card 1",
        poster_path: "/path1.jpg",
        release_date: "2023-01-01",
      },
      {
        id: "2",
        title: "Card 2",
        poster_path: "/path2.jpg",
        release_date: "2023-02-01",
      },
    ],
  };

  it("renders the title", () => {
    render(<CardList {...defaultProps} />);

    const titleElement = screen.getByText(defaultProps.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the list of cards", () => {
    render(<CardList {...defaultProps} />);

    const cardListElement = screen.getByTestId("card-list");
    expect(cardListElement).toBeInTheDocument();

    const cardElements = screen.getAllByTestId("card");
    expect(cardElements).toHaveLength(defaultProps.cards.length);
    expect(cardElements[0]).toHaveTextContent("Card 1");
    expect(cardElements[1]).toHaveTextContent("Card 2");
  });

  it("renders an empty list when there are no cards", () => {
    const emptyProps: CardListProps = {
      title: "Empty Card List",
      cards: [],
    };

    render(<CardList {...emptyProps} />);

    const titleElement = screen.getByText(emptyProps.title);
    expect(titleElement).toBeInTheDocument();

    const cardListElement = screen.getByTestId("card-list");
    expect(cardListElement).toBeInTheDocument();

    const cardElements = screen.queryAllByTestId("card");
    expect(cardElements).toHaveLength(0);
  });
});
