import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppShell from "./AppShell";

function renderShell() {
  return render(
    <MemoryRouter>
      <AppShell>
        <p>Page content</p>
      </AppShell>
    </MemoryRouter>,
  );
}

describe("AppShell", () => {
  it("renders a skip link targeting the main content landmark", () => {
    renderShell();

    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("renders a Forecast4U brand link back to the home page", () => {
    renderShell();

    const brandLink = screen.getByRole("link", { name: /forecast4u/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("renders children inside a focusable main content landmark", () => {
    renderShell();

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });
});
