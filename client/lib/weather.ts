import { z } from "zod";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

const HOURLY_VARIABLES = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation_probability",
  "weather_code",
  "wind_speed_10m",
].join(",");

export type WeatherErrorKind = "not_found" | "http_error" | "invalid_response";

export class WeatherError extends Error {
  readonly kind: WeatherErrorKind;
  readonly cause?: unknown;

  constructor(kind: WeatherErrorKind, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "WeatherError";
    this.kind = kind;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export interface ResolvedLocation {
  zip: string;
  name: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ForecastPeriod {
  timestamp: string;
  temperatureF: number;
  apparentTemperatureF: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeedMph: number;
}

export interface WeatherForecast {
  location: ResolvedLocation;
  timezone: string;
  periods: ForecastPeriod[];
}

export function buildGeocodingUrl(zip: string): string {
  const url = new URL(GEOCODING_ENDPOINT);
  url.searchParams.set("name", zip);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("countryCode", "US");
  return url.toString();
}

export function buildForecastUrl(latitude: number, longitude: number): string {
  const url = new URL(FORECAST_ENDPOINT);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("hourly", HOURLY_VARIABLES);
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_hours", "120");
  url.searchParams.set("temporal_resolution", "hourly_3");
  return url.toString();
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new WeatherError("http_error", "Failed to reach the weather service.", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new WeatherError(
      "http_error",
      `Weather service responded with status ${response.status}.`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new WeatherError("invalid_response", "Weather service returned invalid JSON.", {
      cause: error,
    });
  }
}

const geocodingResultSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  admin1: z.string().optional(),
});

const geocodingResponseSchema = z.object({
  results: z.array(geocodingResultSchema).optional(),
});

export function parseGeocodingResponse(
  data: unknown,
): z.infer<typeof geocodingResponseSchema> {
  const result = geocodingResponseSchema.safeParse(data);
  if (!result.success) {
    throw new WeatherError(
      "invalid_response",
      "Geocoding service returned an unexpected response.",
      { cause: result.error },
    );
  }
  return result.data;
}

export function toResolvedLocation(
  zip: string,
  data: z.infer<typeof geocodingResponseSchema>,
): ResolvedLocation {
  const first = data.results?.[0];
  if (!first) {
    throw new WeatherError("not_found", `No location was found for ZIP code ${zip}.`);
  }
  return {
    zip,
    name: first.name,
    state: first.admin1,
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone,
  };
}

export async function resolveZipLocation(
  zip: string,
  signal?: AbortSignal,
): Promise<ResolvedLocation> {
  const data = await fetchJson(buildGeocodingUrl(zip), signal);
  return toResolvedLocation(zip, parseGeocodingResponse(data));
}

const forecastResponseSchema = z.object({
  timezone: z.string(),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    apparent_temperature: z.array(z.number()),
    precipitation_probability: z.array(z.number()),
    weather_code: z.array(z.number()),
    wind_speed_10m: z.array(z.number()),
  }),
});

export function parseForecastResponse(
  data: unknown,
): z.infer<typeof forecastResponseSchema> {
  const result = forecastResponseSchema.safeParse(data);
  if (!result.success) {
    throw new WeatherError(
      "invalid_response",
      "Forecast service returned an unexpected response.",
      { cause: result.error },
    );
  }
  return result.data;
}

export function toForecastPeriods(
  hourly: z.infer<typeof forecastResponseSchema>["hourly"],
): ForecastPeriod[] {
  const length = hourly.time.length;
  const arrays = [
    hourly.temperature_2m,
    hourly.apparent_temperature,
    hourly.precipitation_probability,
    hourly.weather_code,
    hourly.wind_speed_10m,
  ];
  if (arrays.some((array) => array.length !== length)) {
    throw new WeatherError(
      "invalid_response",
      "Forecast service returned mismatched data lengths.",
    );
  }

  return hourly.time.map((timestamp, index) => ({
    timestamp,
    temperatureF: hourly.temperature_2m[index],
    apparentTemperatureF: hourly.apparent_temperature[index],
    precipitationProbability: hourly.precipitation_probability[index],
    weatherCode: hourly.weather_code[index],
    windSpeedMph: hourly.wind_speed_10m[index],
  }));
}

export async function fetchForecastForLocation(
  location: ResolvedLocation,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const data = await fetchJson(buildForecastUrl(location.latitude, location.longitude), signal);
  const parsed = parseForecastResponse(data);
  return {
    location,
    timezone: parsed.timezone,
    periods: toForecastPeriods(parsed.hourly),
  };
}

export async function getWeatherForZip(
  zip: string,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const location = await resolveZipLocation(zip, signal);
  return fetchForecastForLocation(location, signal);
}
