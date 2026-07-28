import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Weather from "./Weather";
import { WeatherError, type WeatherForecast } from "@/lib/weather";

vi.mock("@/lib/weather", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/weather")>();
  return {
    ...actual,
    getWeatherForZip: vi.fn(),
  };
});

import { getWeatherForZip } from "@/lib/weather";

const mockedGetWeatherForZip = vi.mocked(getWeatherForZip);

const forecast: WeatherForecast = {
  location: {
    zip: "90210",
    name: "Beverly Hills",
    state: "California",
    latitude: 34.0736,
    longitude: -118.4004,
    timezone: "America/Los_Angeles",
  },
  timezone: "America/Los_Angeles",
  periods: [
    {
      timestamp: "2024-06-01T00:00",
      temperatureF: 60,
      apparentTemperatureF: 58,
      precipitationProbability: 10,
      weatherCode: 0,
      windSpeedMph: 5,
    },
    {
      timestamp: "2024-06-01T03:00",
      temperatureF: 62,
      apparentTemperatureF: 61,
      precipitationProbability: 20,
      weatherCode: 1,
      windSpeedMph: 6,
    },
  ],
};

function renderWeather(zip: string) {
  return render(
    <MemoryRouter initialEntries={[`/weather/${zip}`]}>
      <Routes>
        <Route path="/weather/:zip" element={<Weather />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockedGetWeatherForZip.mockReset();
});

describe("Weather page", () => {
  it("shows an inline error and the search form for an invalid ZIP without requesting weather", async () => {
    renderWeather("abcde");

    expect(await screen.findByText(/isn't a valid 5-digit us zip code/i)).toBeInTheDocument();
    expect(screen.getByLabelText("US ZIP code")).toBeInTheDocument();
    expect(mockedGetWeatherForZip).not.toHaveBeenCalled();
  });

  it("shows a loading indicator while the request is pending", async () => {
    mockedGetWeatherForZip.mockReturnValue(new Promise(() => {}));

    renderWeather("90210");

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading the forecast for 90210/i)).toBeInTheDocument();
  });

  it("shows a location summary on success", async () => {
    mockedGetWeatherForZip.mockResolvedValue(forecast);

    renderWeather("90210");

    expect(await screen.findByText(/beverly hills, california/i)).toBeInTheDocument();
    expect(screen.getByText(/\(90210\)/)).toBeInTheDocument();
    expect(screen.getByText(/forecast loaded successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/2 three-hour periods returned/i)).toBeInTheDocument();
  });

  it("shows a not-found message for a not_found error", async () => {
    mockedGetWeatherForZip.mockRejectedValue(
      new WeatherError("not_found", "No location was found for ZIP code 99999."),
    );

    renderWeather("99999");

    expect(await screen.findByText(/no location found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we couldn't find a location for zip code 99999/i),
    ).toBeInTheDocument();
  });

  it("shows a generic message and retry action for a service error, and retries on click", async () => {
    mockedGetWeatherForZip.mockRejectedValueOnce(
      new WeatherError("http_error", "Weather service responded with status 500."),
    );
    mockedGetWeatherForZip.mockResolvedValueOnce(forecast);

    const user = userEvent.setup();
    renderWeather("90210");

    expect(await screen.findByText(/forecast unavailable/i)).toBeInTheDocument();
    expect(screen.queryByText(/status 500/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(await screen.findByText(/forecast loaded successfully/i)).toBeInTheDocument();
    expect(mockedGetWeatherForZip).toHaveBeenCalledTimes(2);
  });

  it("redirects a ZIP+4 route to its canonical five-digit route before fetching", async () => {
    mockedGetWeatherForZip.mockResolvedValue(forecast);

    renderWeather("90210-1234");

    await waitFor(() => {
      expect(mockedGetWeatherForZip).toHaveBeenCalledWith("90210", expect.any(AbortSignal));
    });
  });

  it("passes an AbortSignal to the weather request", async () => {
    mockedGetWeatherForZip.mockResolvedValue(forecast);

    renderWeather("90210");

    await waitFor(() => {
      expect(mockedGetWeatherForZip).toHaveBeenCalledWith("90210", expect.any(AbortSignal));
    });
  });
});
