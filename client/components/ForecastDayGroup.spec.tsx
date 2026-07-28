import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading, Section } from "@carbon/react";
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

function renderWithPageHeading() {
  return render(
    <Section level={1}>
      <Heading>Beverly Hills</Heading>
      <ForecastDayGroup group={group} />
    </Section>,
  );
}

describe("ForecastDayGroup", () => {
  it("renders the day range as a heading nested below the page heading", () => {
    renderWithPageHeading();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Day 1 \u00b7 Tue, Jul 28, 12 PM\u2013Wed, Jul 29, 9 AM",
      }),
    ).toBeInTheDocument();
  });

  it("renders every period within the group as a list item", () => {
    renderWithPageHeading();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("exposes the period row as a keyboard-focusable, labelled scroll region", () => {
    renderWithPageHeading();

    const periodList = screen.getByRole("list", {
      name: /three-hour forecast periods for day 1/i,
    });

    expect(periodList).toHaveAttribute("tabIndex", "0");
  });
});
