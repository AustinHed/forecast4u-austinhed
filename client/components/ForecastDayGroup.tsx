import { AccordionItem } from "@carbon/react";
import ForecastPeriodItem from "./ForecastPeriodItem";
import type { ForecastDayGroup as ForecastDayGroupData } from "@/lib/forecastGrouping";
import { formatDayRangeLabel } from "@/lib/forecastTime";

export interface ForecastDayGroupProps {
  group: ForecastDayGroupData;
}

export default function ForecastDayGroup({ group }: ForecastDayGroupProps) {
  const label = formatDayRangeLabel(group.dayNumber, group.firstTimestamp, group.lastTimestamp);

  return (
    <AccordionItem title={label}>
      <ul
        className="forecast-day__periods"
        aria-label={`Three-hour forecast periods for ${label}`}
      >
        {group.periods.map((period) => (
          <ForecastPeriodItem key={period.timestamp} period={period} />
        ))}
      </ul>
    </AccordionItem>
  );
}
