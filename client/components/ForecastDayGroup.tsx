import ForecastPeriodItem from "./ForecastPeriodItem";
import type { ForecastDayGroup as ForecastDayGroupData } from "@/lib/forecastGrouping";
import { formatDayRangeLabel } from "@/lib/forecastTime";

export interface ForecastDayGroupProps {
  group: ForecastDayGroupData;
}

export default function ForecastDayGroup({ group }: ForecastDayGroupProps) {
  const headingId = `forecast-day-${group.dayNumber}-heading`;

  return (
    <section className="forecast-day" aria-labelledby={headingId}>
      <h3 id={headingId} className="forecast-day__heading">
        {formatDayRangeLabel(group.dayNumber, group.firstTimestamp, group.lastTimestamp)}
      </h3>
      <ul className="forecast-day__periods">
        {group.periods.map((period) => (
          <ForecastPeriodItem key={period.timestamp} period={period} />
        ))}
      </ul>
    </section>
  );
}
