import type { ForecastPeriod } from "./weather";
import { getLocalDateKey } from "./forecastTime";

export const DAY_GROUP_COUNT = 5;

export interface ForecastDayGroup {
  dayNumber: number;
  dateKey: string;
  firstTimestamp: string;
  lastTimestamp: string;
  periods: ForecastPeriod[];
}

/**
 * Groups forecast periods by their location-local calendar date, showing
 * only the first five distinct dates. The first group may be partial when
 * the forecast begins after midnight on its date; later groups follow the
 * next calendar-date boundary rather than a fixed period count.
 */
export function groupForecastIntoDays(periods: ForecastPeriod[]): ForecastDayGroup[] {
  const groups: ForecastDayGroup[] = [];
  const groupIndexByDateKey = new Map<string, number>();

  for (const period of periods) {
    const dateKey = getLocalDateKey(period.timestamp);
    let groupIndex = groupIndexByDateKey.get(dateKey);

    if (groupIndex === undefined) {
      if (groups.length >= DAY_GROUP_COUNT) {
        break;
      }
      groupIndex = groups.length;
      groupIndexByDateKey.set(dateKey, groupIndex);
      groups.push({
        dayNumber: groupIndex + 1,
        dateKey,
        firstTimestamp: period.timestamp,
        lastTimestamp: period.timestamp,
        periods: [],
      });
    }

    const group = groups[groupIndex];
    group.periods.push(period);
    group.lastTimestamp = period.timestamp;
  }

  return groups;
}
