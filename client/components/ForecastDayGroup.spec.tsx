import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ForecastDayGroup from "./ForecastDayGroup";
import type { ForecastDayGroup as ForecastDayGroupData } from "@/lib/forecastGrouping";
import type { ForecastPeriod } from "@/lib/weather";

function buildPeriod(hour: string): ForecastPeriod {
  return {
    timestamp: `2026-07-28T${hour}`,
    temperatureF: 70,
    apparentTemperatureF: 70,
    precipitationProbability: 0,
    weatherCode: 0,
    windSpeedMph: 5,
  };
}

const group: ForecastDayGroupData = {
  dayNumber: 1,
  firstTimestamp: "2026-07-28T12:00",
  lastTimestamp: "2026-07-29T09:00",
  periods: [buildPeriod("12:00"), buildPeriod("15:00")],
};

describe("ForecastDayGroup", () => {
  it("renders a labelled section heading with the day range", () => {
    render(<ForecastDayGroup group={group} />);

    expect(
      screen.getByRole("heading", {
        name: "Day 1 \u00b7 Tue, Jul 28, 12 PM\u2013Wed, Jul 29, 9 AM",
      }),
    ).toBeInTheDocument();
  });

  it("renders every period within the group as a list item", () => {
    render(<ForecastDayGroup group={group} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
