import { render, screen } from "@/test/test-utils";
import CircularRating from ".";

describe("<CircularRating />", () => {
  it("renders rating and caption", () => {
    render(<CircularRating rating={7.8} caption="122K Rated" />);

    expect(screen.getByText("7.8")).toBeInTheDocument();
    expect(screen.getByText("122K Rated")).toBeInTheDocument();
    expect(screen.getAllByLabelText("7.8 de 10").length).toBeGreaterThan(0);
  });

  it("clamps invalid ratings safely", () => {
    render(<CircularRating rating={Number.NaN} />);
    expect(screen.getByText("0.0")).toBeInTheDocument();
  });
});

