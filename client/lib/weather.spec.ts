import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  WeatherError,
  buildGeocodingUrl,
  buildForecastUrl,
  getWeatherForZip,
} from "./weather";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

const validGeocodingResponse = {
  results: [
    {
      name: "Beverly Hills",
      admin1: "California",
      latitude: 34.0736,
      longitude: -118.4004,
      timezone: "America/Los_Angeles",
    },
  ],
};

const validForecastResponse = {
  timezone: "America/Los_Angeles",
  hourly: {
    time: ["2024-06-01T00:00", "2024-06-01T03:00"],
    temperature_2m: [60, 62],
    apparent_temperature: [58, 61],
    precipitation_probability: [10, 20],
    weather_code: [0, 1],
    wind_speed_10m: [5, 6],
  },
};

describe("buildGeocodingUrl", () => {
  it("includes the required query parameters", () => {
    const url = new URL(buildGeocodingUrl("90210"));
    expect(url.origin + url.pathname).toBe(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    expect(url.searchParams.get("name")).toBe("90210");
    expect(url.searchParams.get("count")).toBe("1");
    expect(url.searchParams.get("language")).toBe("en");
    expect(url.searchParams.get("format")).toBe("json");
    expect(url.searchParams.get("countryCode")).toBe("US");
  });
});

describe("buildForecastUrl", () => {
  it("includes the required query parameters", () => {
    const url = new URL(buildForecastUrl(34.0736, -118.4004));
    expect(url.origin + url.pathname).toBe(
      "https://api.open-meteo.com/v1/forecast",
    );
    expect(url.searchParams.get("latitude")).toBe("34.0736");
    expect(url.searchParams.get("longitude")).toBe("-118.4004");
    expect(url.searchParams.get("hourly")).toBe(
      "temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m",
    );
    expect(url.searchParams.get("temperature_unit")).toBe("fahrenheit");
    expect(url.searchParams.get("wind_speed_unit")).toBe("mph");
    expect(url.searchParams.get("timezone")).toBe("auto");
    expect(url.searchParams.get("forecast_hours")).toBe("120");
    expect(url.searchParams.get("temporal_resolution")).toBe("hourly_3");
  });
});

describe("getWeatherForZip", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves a ZIP code and transforms the forecast into the app model", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(validGeocodingResponse))
      .mockResolvedValueOnce(jsonResponse(validForecastResponse));

    const result = await getWeatherForZip("90210");

    expect(result.location).toEqual({
      zip: "90210",
      name: "Beverly Hills",
      state: "California",
      latitude: 34.0736,
      longitude: -118.4004,
      timezone: "America/Los_Angeles",
    });
    expect(result.timezone).toBe("America/Los_Angeles");
    expect(result.periods).toEqual([
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
    ]);
  });

  it("throws a not_found error when geocoding returns no results", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(jsonResponse({ results: [] }));

    await expect(getWeatherForZip("00000")).rejects.toMatchObject({
      kind: "not_found",
    } satisfies Partial<WeatherError>);
  });

  it("throws an http_error when the geocoding request fails", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(jsonResponse({}, false, 500));

    await expect(getWeatherForZip("90210")).rejects.toMatchObject({
      kind: "http_error",
    } satisfies Partial<WeatherError>);
  });

  it("throws an http_error when the forecast request fails", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(validGeocodingResponse))
      .mockResolvedValueOnce(jsonResponse({}, false, 503));

    await expect(getWeatherForZip("90210")).rejects.toMatchObject({
      kind: "http_error",
    } satisfies Partial<WeatherError>);
  });

  it("throws an invalid_response error for a malformed geocoding response", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(jsonResponse({ results: [{ name: 123 }] }));

    await expect(getWeatherForZip("90210")).rejects.toMatchObject({
      kind: "invalid_response",
    } satisfies Partial<WeatherError>);
  });

  it("throws an invalid_response error for a malformed forecast response", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(validGeocodingResponse))
      .mockResolvedValueOnce(jsonResponse({ timezone: "America/Los_Angeles" }));

    await expect(getWeatherForZip("90210")).rejects.toMatchObject({
      kind: "invalid_response",
    } satisfies Partial<WeatherError>);
  });

  it("throws an invalid_response error when forecast arrays have mismatched lengths", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(jsonResponse(validGeocodingResponse)).mockResolvedValueOnce(
      jsonResponse({
        timezone: "America/Los_Angeles",
        hourly: {
          time: ["2024-06-01T00:00", "2024-06-01T03:00"],
          temperature_2m: [60],
          apparent_temperature: [58, 61],
          precipitation_probability: [10, 20],
          weather_code: [0, 1],
          wind_speed_10m: [5, 6],
        },
      }),
    );

    await expect(getWeatherForZip("90210")).rejects.toMatchObject({
      kind: "invalid_response",
    } satisfies Partial<WeatherError>);
  });

  it("forwards the AbortSignal to every fetch call", async () => {
    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(validGeocodingResponse))
      .mockResolvedValueOnce(jsonResponse(validForecastResponse));

    const controller = new AbortController();
    await getWeatherForZip("90210", controller.signal);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toEqual({ signal: controller.signal });
    expect(fetchMock.mock.calls[1][1]).toEqual({ signal: controller.signal });
  });
});
