import { Tile } from "@carbon/react";
import type { ForecastPeriod } from "@/lib/weather";
import { formatLocalTime } from "@/lib/forecastTime";
import { getWeatherCondition } from "@/lib/weatherConditions";

export interface ForecastPeriodItemProps {
  period: ForecastPeriod;
}

export default function ForecastPeriodItem({ period }: ForecastPeriodItemProps) {
  const condition = getWeatherCondition(period.weatherCode);
  const { Icon } = condition;

  return (
    <li className="forecast-period">
      <Tile className="forecast-period__tile">
        <p className="forecast-period__time">{formatLocalTime(period.timestamp)}</p>
        <p className="forecast-period__temp">{Math.round(period.temperatureF)}°F</p>
        <p className="forecast-period__condition">
          <Icon aria-hidden="true" className="forecast-period__icon" size={20} />
          {condition.label}
        </p>
        <p className="forecast-period__detail">
          Feels like {Math.round(period.apparentTemperatureF)}°F
        </p>
        <p className="forecast-period__detail">
          {Math.round(period.precipitationProbability)}% precip
        </p>
        <p className="forecast-period__detail">{Math.round(period.windSpeedMph)} mph wind</p>
      </Tile>
    </li>
  );
}
