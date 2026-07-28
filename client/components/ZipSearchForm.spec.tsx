import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import ZipSearchForm from "./ZipSearchForm";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderForm(initialZip?: string) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <ZipSearchForm initialZip={initialZip} />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ZipSearchForm", () => {
  it("renders a labeled input with helper instructions", () => {
    renderForm();
    expect(screen.getByLabelText("US ZIP code")).toBeInTheDocument();
    expect(
      screen.getByText(/enter a 5-digit zip code/i),
    ).toBeInTheDocument();
  });

  it("prefills the input from the initialZip prop", () => {
    renderForm("90210");
    expect(screen.getByLabelText("US ZIP code")).toHaveValue("90210");
  });

  it("shows inline validation and does not navigate for an invalid ZIP", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("US ZIP code"), "abc");
    await user.click(screen.getByRole("button", { name: /get forecast/i }));

    expect(
      screen.getByText(/enter a valid 5-digit zip code/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });

  it("navigates to the canonical five-digit route for a plain ZIP", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("US ZIP code"), "90210");
    await user.click(screen.getByRole("button", { name: /get forecast/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("/weather/90210");
  });

  it("navigates to the canonical five-digit route for a ZIP+4", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("US ZIP code"), "90210-1234");
    await user.click(screen.getByRole("button", { name: /get forecast/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("/weather/90210");
  });
});
