import { Heading, Section } from "@carbon/react";
import ForecastPeriodItem from "./ForecastPeriodItem";
import type { ForecastDayGroup as ForecastDayGroupData } from "@/lib/forecastGrouping";
import { formatDayRangeLabel } from "@/lib/forecastTime";

export interface ForecastDayGroupProps {
  group: ForecastDayGroupData;
}

export default function ForecastDayGroup({ group }: ForecastDayGroupProps) {
  const label = formatDayRangeLabel(group.dayNumber, group.firstTimestamp, group.lastTimestamp);

  return (
    <Section className="forecast-day">
      <Heading className="forecast-day__heading">{label}</Heading>
      <ul
        className="forecast-day__periods"
        tabIndex={0}
        aria-label={`Three-hour forecast periods for ${label}`}
      >
        {group.periods.map((period) => (
          <ForecastPeriodItem key={period.timestamp} period={period} />
        ))}
      </ul>
    </Section>
  );
}
