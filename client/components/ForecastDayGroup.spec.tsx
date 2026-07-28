import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "@carbon/react";
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

function renderInAccordion() {
  return render(
    <Accordion>
      <ForecastDayGroup group={group} />
    </Accordion>,
  );
}

describe("ForecastDayGroup", () => {
  it("renders the day range label in the accordion item's toggle button", () => {
    renderInAccordion();

    expect(
      screen.getByRole("button", {
        name: "Day 1 \u00b7 Tue, Jul 28, 12 PM\u2013Wed, Jul 29, 9 AM",
      }),
    ).toBeInTheDocument();
  });

  it("starts collapsed and expands independently when its toggle is clicked", async () => {
    renderInAccordion();

    const user = userEvent.setup();
    const toggle = screen.getByRole("button", { name: /^day 1/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("renders every period within the group as a list item", () => {
    renderInAccordion();

    const periodList = screen.getByRole("list", {
      name: /three-hour forecast periods for day 1/i,
    });

    expect(within(periodList).getAllByRole("listitem")).toHaveLength(2);
  });

  it("labels the periods list for assistive technology without a scroll region", () => {
    renderInAccordion();

    const periodList = screen.getByRole("list", {
      name: /three-hour forecast periods for day 1/i,
    });

    expect(periodList).not.toHaveAttribute("tabIndex");
  });
});
