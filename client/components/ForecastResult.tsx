import type { ReactNode } from "react";
import { Accordion, Link, Stack } from "@carbon/react";
import ForecastDayGroup from "./ForecastDayGroup";
import { groupForecastIntoDays } from "@/lib/forecastGrouping";
import type { WeatherForecast } from "@/lib/weather";

export interface ForecastResultProps {
  forecast: WeatherForecast;
  children?: ReactNode;
}

export default function ForecastResult({ forecast, children }: ForecastResultProps) {
  const dayGroups = groupForecastIntoDays(forecast.periods);

  return (
    <Stack gap={6} className="forecast-result">
      <p className="forecast-result__metadata">
        {forecast.location.state ? `${forecast.location.state} · ` : ""}
        ZIP {forecast.location.zip} · {forecast.timezone} time · Three-hour forecast
      </p>

      {children}

      {dayGroups.length === 0 ? (
        <p role="status">No forecast data is available for this location right now.</p>
      ) : (
        <Accordion className="forecast-result__accordion">
          {dayGroups.map((group) => (
            <ForecastDayGroup key={group.dayNumber} group={group} />
          ))}
        </Accordion>
      )}

      <p className="forecast-result__attribution">
        Weather data from{" "}
        <Link href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
          <span className="visually-hidden"> (opens in a new tab)</span>
        </Link>
      </p>
    </Stack>
  );
}
