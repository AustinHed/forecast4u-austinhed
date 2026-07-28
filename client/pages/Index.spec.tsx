import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "./Index";

describe("Index page", () => {
  it("renders one primary heading and explains the rolling five-day, three-hour forecast", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Forecast4U" })).toBeInTheDocument();
    expect(screen.getByText(/rolling five-day forecast in\s+three-hour increments/i)).toBeInTheDocument();
    expect(screen.getByLabelText("US ZIP code")).toBeInTheDocument();
  });

  it("sets a descriptive document title", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(document.title).toBe("Forecast4U \u2013 Five-day weather forecast");
  });
});
