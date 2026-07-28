import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound page", () => {
  it("renders a primary heading and a clear route back to the ZIP search", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search for a zip code/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("sets a descriptive document title", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>,
    );

    expect(document.title).toBe("Page not found \u2013 Forecast4U");
  });
});
