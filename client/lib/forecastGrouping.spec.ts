import { describe, it, expect } from "vitest";
import { groupForecastIntoDays } from "./forecastGrouping";
import type { ForecastPeriod } from "./weather";

function buildPeriod(timestamp: string, index: number): ForecastPeriod {
  return {
    timestamp,
    temperatureF: 60 + index,
    apparentTemperatureF: 58 + index,
    precipitationProbability: 10,
    weatherCode: 0,
    windSpeedMph: 5,
  };
}

function buildPeriodsFrom(startTimestamp: string, count: number): ForecastPeriod[] {
  const [datePart, timePart] = startTimestamp.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const startHour = Number(timePart.slice(0, 2));

  return Array.from({ length: count }, (_, index) => {
    const totalHours = startHour + index * 3;
    const dayOffset = Math.floor(totalHours / 24);
    const hourOfDay = totalHours % 24;
    const date = new Date(Date.UTC(year, month - 1, day + dayOffset));
    const timestamp = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}T${String(hourOfDay).padStart(2, "0")}:00`;
    return buildPeriod(timestamp, index);
  });
}

describe("groupForecastIntoDays", () => {
  it("puts only the remaining periods of the first calendar date in day 1, then starts day 2 at midnight", () => {
    const periods = buildPeriodsFrom("2026-07-28T18:00", 4);

    const groups = groupForecastIntoDays(periods);

    expect(groups[0].dayNumber).toBe(1);
    expect(groups[0].dateKey).toBe("2026-07-28");
    expect(groups[0].periods.map((period) => period.timestamp)).toEqual([
      "2026-07-28T18:00",
      "2026-07-28T21:00",
    ]);

    expect(groups[1].dayNumber).toBe(2);
    expect(groups[1].dateKey).toBe("2026-07-29");
    expect(groups[1].periods[0].timestamp).toBe("2026-07-29T00:00");
  });

  it("gives a full calendar date all eight three-hour periods", () => {
    const periods = buildPeriodsFrom("2026-07-28T00:00", 8);

    const groups = groupForecastIntoDays(periods);

    expect(groups).toHaveLength(1);
    expect(groups[0].periods).toHaveLength(8);
    expect(groups[0].firstTimestamp).toBe("2026-07-28T00:00");
    expect(groups[0].lastTimestamp).toBe("2026-07-28T21:00");
  });

  it("shows only the first five distinct calendar dates and drops the sixth", () => {
    const periods = buildPeriodsFrom("2026-07-28T00:00", 8 * 6);

    const groups = groupForecastIntoDays(periods);

    expect(groups).toHaveLength(5);
    expect(groups.map((group) => group.dateKey)).toEqual([
      "2026-07-28",
      "2026-07-29",
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
    ]);
    expect(groups.reduce((total, group) => total + group.periods.length, 0)).toBe(40);
  });

  it("renders fewer than five groups without empty or undefined groups when fewer dates are available", () => {
    const periods = buildPeriodsFrom("2026-07-28T00:00", 8 * 2);

    const groups = groupForecastIntoDays(periods);

    expect(groups).toHaveLength(2);
    groups.forEach((group) => {
      expect(group.periods.length).toBeGreaterThan(0);
    });
  });

  it("preserves chronological ordering of groups and periods", () => {
    const periods = buildPeriodsFrom("2026-07-28T18:00", 10);

    const groups = groupForecastIntoDays(periods);
    const dayNumbers = groups.map((group) => group.dayNumber);
    expect(dayNumbers).toEqual([...dayNumbers].sort((a, b) => a - b));

    groups.forEach((group) => {
      const timestamps = group.periods.map((period) => period.timestamp);
      expect(timestamps).toEqual([...timestamps].sort());
    });
  });

  it("returns an empty array when there are no periods", () => {
    expect(groupForecastIntoDays([])).toEqual([]);
  });
});
