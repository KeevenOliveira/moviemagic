import { format, parseISO } from "date-fns";

export const convertDate = (date: string, mask = "dd/MM/yyyy") => {
  if (!date) return "";
  const parsedDate = parseISO(date);
  if (isNaN(parsedDate?.getTime())) {
    throw new Error("Invalid date");
  }
  return format(parsedDate, mask);
};
