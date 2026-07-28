import { describe, it, expect } from "vitest";
import { getWeatherCondition } from "./weatherConditions";

describe("getWeatherCondition", () => {
  it.each([
    [0, "Clear sky"],
    [1, "Mainly clear"],
    [2, "Partly cloudy"],
    [3, "Overcast"],
    [45, "Fog"],
    [51, "Light drizzle"],
    [56, "Freezing drizzle"],
    [61, "Slight rain"],
    [66, "Freezing rain"],
    [71, "Slight snow"],
    [80, "Slight rain showers"],
    [95, "Thunderstorm"],
    [96, "Thunderstorm with hail"],
  ])("maps WMO code %i to %s", (code, label) => {
    expect(getWeatherCondition(code).label).toBe(label);
  });

  it("provides a Carbon icon component alongside the accessible label for every mapped code", () => {
    const condition = getWeatherCondition(0);
    expect(condition.Icon).toBeTruthy();
    expect(condition.label).toBeTruthy();
  });

  it("falls back to an unknown condition for an unmapped code", () => {
    const condition = getWeatherCondition(-1);
    expect(condition.label).toBe("Unknown conditions");
    expect(condition.Icon).toBeTruthy();
  });
});
