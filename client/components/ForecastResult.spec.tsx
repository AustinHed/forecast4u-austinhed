import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading, Section } from "@carbon/react";
import ForecastResult from "./ForecastResult";
import type { WeatherForecast } from "@/lib/weather";

function buildForecast(periodCount: number): WeatherForecast {
  return {
    location: {
      zip: "90210",
      name: "Beverly Hills",
      state: "California",
      latitude: 34.0736,
      longitude: -118.4004,
      timezone: "America/Los_Angeles",
    },
    timezone: "America/Los_Angeles",
    periods: Array.from({ length: periodCount }, (_, index) => {
      const hour = index * 3;
      const dayOffset = Math.floor(hour / 24);
      const hourOfDay = hour % 24;
      return {
        timestamp: `2026-07-${String(28 + dayOffset).padStart(2, "0")}T${String(hourOfDay).padStart(2, "0")}:00`,
        temperatureF: 70,
        apparentTemperatureF: 70,
        precipitationProbability: 10,
        weatherCode: 0,
        windSpeedMph: 5,
      };
    }),
  };
}

function renderResult(forecast: WeatherForecast) {
  return render(
    <Section level={1}>
      <Heading>{forecast.location.name}</Heading>
      <ForecastResult forecast={forecast} />
    </Section>,
  );
}

describe("ForecastResult", () => {
  it("renders the state, ZIP, timezone, and three-hour forecast metadata, plus five day groups and attribution", () => {
    renderResult(buildForecast(40));

    expect(screen.getByText(/california/i)).toBeInTheDocument();
    expect(screen.getByText(/zip 90210/i)).toBeInTheDocument();
    expect(screen.getByText(/america\/los_angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/three-hour forecast/i)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2, name: /^day \d/i })).toHaveLength(5);
    expect(screen.getByRole("link", { name: /open-meteo/i })).toHaveAttribute(
      "href",
      "https://open-meteo.com/",
    );
  });

  it("renders fewer day groups when partial data is returned", () => {
    renderResult(buildForecast(10));

    expect(screen.getAllByRole("heading", { level: 2, name: /^day \d/i })).toHaveLength(2);
  });

  it("shows an empty-data message when no periods are available", () => {
    renderResult(buildForecast(0));

    expect(
      screen.getByText(/no forecast data is available for this location/i),
    ).toBeInTheDocument();
  });
});
