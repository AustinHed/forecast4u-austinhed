import { describe, it, expect } from "vitest";
import {
  formatDayRangeLabel,
  formatLocalDate,
  formatLocalTime,
  parseLocalTimestamp,
} from "./forecastTime";

describe("parseLocalTimestamp", () => {
  it("extracts date and time parts without using the Date constructor's timezone handling", () => {
    expect(parseLocalTimestamp("2026-07-28T12:00")).toEqual({
      year: 2026,
      month: 7,
      day: 28,
      hour: 12,
      minute: 0,
    });
  });

  it("throws for a malformed timestamp", () => {
    expect(() => parseLocalTimestamp("not-a-timestamp")).toThrow();
  });
});

describe("formatLocalDate", () => {
  it("formats the location-local date regardless of the host timezone", () => {
    expect(formatLocalDate("2026-07-28T12:00")).toBe("Tue, Jul 28");
  });
});

describe("formatLocalTime", () => {
  it("formats a noon timestamp as 12 PM", () => {
    expect(formatLocalTime("2026-07-28T12:00")).toBe("12 PM");
  });

  it("formats a morning timestamp as AM", () => {
    expect(formatLocalTime("2026-07-29T09:00")).toBe("9 AM");
  });
});

describe("formatDayRangeLabel", () => {
  it("includes both dates when the range spans two calendar days", () => {
    expect(formatDayRangeLabel(1, "2026-07-28T12:00", "2026-07-29T09:00")).toBe(
      "Day 1 \u00b7 Tue, Jul 28, 12 PM\u2013Wed, Jul 29, 9 AM",
    );
  });

  it("avoids repeating the date when the range stays on the same calendar day", () => {
    expect(formatDayRangeLabel(2, "2026-07-28T00:00", "2026-07-28T21:00")).toBe(
      "Day 2 \u00b7 Tue, Jul 28, 12 AM\u20139 PM",
    );
  });
});
