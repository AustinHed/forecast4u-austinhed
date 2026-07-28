import type { ForecastPeriod } from "./weather";

export const PERIODS_PER_DAY = 8;
export const DAY_GROUP_COUNT = 5;

export interface ForecastDayGroup {
  dayNumber: number;
  firstTimestamp: string;
  lastTimestamp: string;
  periods: ForecastPeriod[];
}

/**
 * Splits the rolling 120-hour, 3-hour-increment forecast into five
 * consecutive 24-hour groups of eight periods each. Stops early (rather than
 * producing a partial or undefined-filled group) when fewer periods than
 * expected are available.
 */
export function groupForecastIntoDays(periods: ForecastPeriod[]): ForecastDayGroup[] {
  const relevantPeriods = periods.slice(0, PERIODS_PER_DAY * DAY_GROUP_COUNT);
  const groups: ForecastDayGroup[] = [];

  for (let dayIndex = 0; dayIndex < DAY_GROUP_COUNT; dayIndex++) {
    const start = dayIndex * PERIODS_PER_DAY;
    const dayPeriods = relevantPeriods.slice(start, start + PERIODS_PER_DAY);

    if (dayPeriods.length === 0) {
      break;
    }

    groups.push({
      dayNumber: dayIndex + 1,
      firstTimestamp: dayPeriods[0].timestamp,
      lastTimestamp: dayPeriods[dayPeriods.length - 1].timestamp,
      periods: dayPeriods,
    });
  }

  return groups;
}
