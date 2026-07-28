import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ForecastPeriodItem from "./ForecastPeriodItem";
import type { ForecastPeriod } from "@/lib/weather";

const period: ForecastPeriod = {
  timestamp: "2026-07-28T12:00",
  temperatureF: 71.6,
  apparentTemperatureF: 73.4,
  precipitationProbability: 24.6,
  weatherCode: 61,
  windSpeedMph: 8.2,
};

describe("ForecastPeriodItem", () => {
  it("renders the local time, condition, and rounded measurements", () => {
    render(
      <ul>
        <ForecastPeriodItem period={period} />
      </ul>,
    );

    expect(screen.getByText("12 PM")).toBeInTheDocument();
    expect(screen.getByText(/slight rain/i)).toBeInTheDocument();
    expect(screen.getByText("72\u00b0F")).toBeInTheDocument();
    expect(screen.getByText(/feels like 73\u00b0f/i)).toBeInTheDocument();
    expect(screen.getByText(/25% precip/i)).toBeInTheDocument();
    expect(screen.getByText(/8 mph wind/i)).toBeInTheDocument();
  });

  it("hides the decorative condition icon from assistive technology", () => {
    const { container } = render(
      <ul>
        <ForecastPeriodItem period={period} />
      </ul>,
    );

    const icon = container.querySelector(".forecast-period__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
