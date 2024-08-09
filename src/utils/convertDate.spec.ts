import { convertDate } from "./convertDate";
import { format } from "date-fns";

describe("convertDate", () => {
  it("returns an empty string if the date is not provided", () => {
    expect(convertDate("")).toBe("");
  });

  it("formats the date correctly with the default mask", () => {
    const date = "2023-08-08T00:00:00.000Z";
    const formattedDate = format(new Date(date), "dd/MM/yyyy");
    expect(convertDate(date)).toBe(formattedDate);
  });

  it("formats the date correctly with a custom mask", () => {
    const date = "2023-08-08T00:00:00.000Z";
    const customMask = "yyyy-MM-dd";
    const formattedDate = format(new Date(date), customMask);
    expect(convertDate(date, customMask)).toBe(formattedDate);
  });

  it("formats the date correctly with a custom mask", () => {
    const date = "2023-08-08T00:00:00.000Z";
    const customMask = "yyyy";
    const dateExpected = "2023";
    expect(convertDate(date, customMask)).toBe(dateExpected);
  });

  it("throws an error if the date is invalid", () => {
    const invalidDate = "invalid-date";
    expect(() => convertDate(invalidDate)).toThrow();
  });
});
