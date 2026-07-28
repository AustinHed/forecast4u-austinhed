import { describe, it, expect } from "vitest";
import { groupForecastIntoDays } from "./forecastGrouping";
import type { ForecastPeriod } from "./weather";

function buildPeriods(count: number): ForecastPeriod[] {
  return Array.from({ length: count }, (_, index) => {
    const hour = index * 3;
    const day = 1 + Math.floor(hour / 24);
    const hourOfDay = hour % 24;
    return {
      timestamp: `2026-07-${String(27 + day).padStart(2, "0")}T${String(hourOfDay).padStart(2, "0")}:00`,
      temperatureF: 60 + index,
      apparentTemperatureF: 58 + index,
      precipitationProbability: 10,
      weatherCode: 0,
      windSpeedMph: 5,
    };
  });
}

describe("groupForecastIntoDays", () => {
  it("splits 40 periods into five groups of eight", () => {
    const groups = groupForecastIntoDays(buildPeriods(40));

    expect(groups).toHaveLength(5);
    groups.forEach((group, index) => {
      expect(group.dayNumber).toBe(index + 1);
      expect(group.periods).toHaveLength(8);
      expect(group.firstTimestamp).toBe(group.periods[0].timestamp);
      expect(group.lastTimestamp).toBe(group.periods[7].timestamp);
    });
  });

  it("ignores periods beyond the first 40", () => {
    const groups = groupForecastIntoDays(buildPeriods(48));

    expect(groups).toHaveLength(5);
    expect(groups.reduce((total, group) => total + group.periods.length, 0)).toBe(40);
  });

  it("produces a partial final group when fewer than 40 periods are available", () => {
    const groups = groupForecastIntoDays(buildPeriods(20));

    expect(groups).toHaveLength(3);
    expect(groups[0].periods).toHaveLength(8);
    expect(groups[1].periods).toHaveLength(8);
    expect(groups[2].periods).toHaveLength(4);
    expect(groups[2].firstTimestamp).toBe(groups[2].periods[0].timestamp);
    expect(groups[2].lastTimestamp).toBe(
      groups[2].periods[groups[2].periods.length - 1].timestamp,
    );
  });

  it("returns an empty array when there are no periods", () => {
    expect(groupForecastIntoDays([])).toEqual([]);
  });
});
