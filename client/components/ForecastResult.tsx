import { Link, Stack } from "@carbon/react";
import ForecastDayGroup from "./ForecastDayGroup";
import { groupForecastIntoDays } from "@/lib/forecastGrouping";
import type { WeatherForecast } from "@/lib/weather";

export interface ForecastResultProps {
  forecast: WeatherForecast;
}

export default function ForecastResult({ forecast }: ForecastResultProps) {
  const dayGroups = groupForecastIntoDays(forecast.periods);

  return (
    <Stack gap={6} className="forecast-result">
      <div>
        <p className="forecast-result__location">
          <strong>
            {forecast.location.name}
            {forecast.location.state ? `, ${forecast.location.state}` : ""}
          </strong>{" "}
          ({forecast.location.zip})
        </p>
        <p className="forecast-result__timezone">
          Times shown are local to the forecast location ({forecast.timezone}).
        </p>
      </div>

      {dayGroups.length === 0 ? (
        <p role="status">No forecast data is available for this location right now.</p>
      ) : (
        <div className="forecast-result__days">
          {dayGroups.map((group) => (
            <ForecastDayGroup key={group.dayNumber} group={group} />
          ))}
        </div>
      )}

      <p className="forecast-result__attribution">
        Weather data by{" "}
        <Link href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </Link>
      </p>
    </Stack>
  );
}
