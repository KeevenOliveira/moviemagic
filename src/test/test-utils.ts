import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import fs from "fs";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const view = render(ui, { ...options });

  const style = document.createElement("style");
  style.innerHTML = fs.readFileSync("src/styles/index.css", "utf8");
  document.head.appendChild(style);

  return view;
};

export * from "@testing-library/react";
export { customRender as render };
