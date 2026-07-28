import { useId, useMemo, useState, type ReactElement } from "react";
import { ContentSwitcher, InlineNotification, Switch } from "@carbon/react";
import { LineChart, ScaleTypes, SimpleBarChart } from "@carbon/charts-react";
import "./WeatherTrendChart.scss";

export interface WeatherTrendPoint {
  /** Already-formatted, location-local three-hour time label, e.g. "3 PM". */
  time: string;
  temperatureF: number;
  apparentTemperatureF: number;
  precipitationProbability: number;
  windSpeedMph: number;
}

export type WeatherTrendMetric = "temperature" | "precipitation" | "wind";

export interface WeatherTrendChartProps {
  /** Title shown above the chart and used for its accessible name. */
  title: string;
  /** Optional supporting text shown below the title. */
  subtitle?: string;
  /** Normalized three-hour forecast points, in chronological order. */
  points: WeatherTrendPoint[];
  /** Metric view shown initially. */
  defaultMetric: WeatherTrendMetric;
  /** Chart height in pixels. Defaults to 320. */
  height?: number;
}

const METRIC_OPTIONS: { metric: WeatherTrendMetric; text: string }[] = [
  { metric: "temperature", text: "Temperature" },
  { metric: "precipitation", text: "Precipitation" },
  { metric: "wind", text: "Wind" },
];

const TEMPERATURE_GROUP = "Temperature";
const APPARENT_TEMPERATURE_GROUP = "Feels like";
const PRECIPITATION_GROUP = "Chance of precipitation";
const WIND_GROUP = "Wind speed";

export function WeatherTrendChart({
  title,
  subtitle,
  points,
  defaultMetric,
  height = 320,
}: WeatherTrendChartProps): ReactElement {
  const [metric, setMetric] = useState<WeatherTrendMetric>(defaultMetric);
  const headingId = useId();
  const selectedIndex = METRIC_OPTIONS.findIndex(
    (option) => option.metric === metric,
  );

  const temperatureData = useMemo(
    () =>
      points.flatMap((point) => [
        { group: TEMPERATURE_GROUP, key: point.time, value: point.temperatureF },
        {
          group: APPARENT_TEMPERATURE_GROUP,
          key: point.time,
          value: point.apparentTemperatureF,
        },
      ]),
    [points],
  );

  const precipitationData = useMemo(
    () =>
      points.map((point) => ({
        group: PRECIPITATION_GROUP,
        key: point.time,
        value: point.precipitationProbability,
      })),
    [points],
  );

  const windData = useMemo(
    () =>
      points.map((point) => ({
        group: WIND_GROUP,
        key: point.time,
        value: point.windSpeedMph,
      })),
    [points],
  );

  const chartHeight = `${height}px`;

  return (
    <div className="weather-trend-chart">
      <div className="weather-trend-chart__header">
        <h3 id={headingId} className="weather-trend-chart__title">
          {title}
        </h3>
        {subtitle ? (
          <p className="weather-trend-chart__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <ContentSwitcher
        selectedIndex={selectedIndex}
        onChange={({ index }) =>
          setMetric(METRIC_OPTIONS[index as number].metric)
        }
        aria-labelledby={headingId}
        className="weather-trend-chart__switcher"
      >
        {METRIC_OPTIONS.map((option) => (
          <Switch key={option.metric} name={option.metric} text={option.text} />
        ))}
      </ContentSwitcher>
      <div className="weather-trend-chart__body">
        {points.length === 0 ? (
          <InlineNotification
            kind="info"
            lowContrast
            hideCloseButton
            title="No trend data is available."
            className="weather-trend-chart__empty-state"
          />
        ) : metric === "temperature" ? (
          <LineChart
            data={temperatureData}
            options={{
              title: `${title} \u2013 Temperature`,
              accessibility: {
                svgAriaLabel: `Line chart of temperature and feels-like temperature by three-hour interval for ${title}`,
              },
              height: chartHeight,
              resizable: true,
              axes: {
                bottom: {
                  mapsTo: "key",
                  scaleType: ScaleTypes.LABELS,
                },
                left: {
                  mapsTo: "value",
                  scaleType: ScaleTypes.LINEAR,
                  title: "Temperature (\u00b0F)",
                },
              },
              legend: {
                alignment: "left",
              },
              tooltip: {
                valueFormatter: (value) => `${value}\u00b0F`,
              },
            }}
          />
        ) : metric === "precipitation" ? (
          <SimpleBarChart
            data={precipitationData}
            options={{
              title: `${title} \u2013 Precipitation`,
              accessibility: {
                svgAriaLabel: `Bar chart of chance of precipitation by three-hour interval for ${title}`,
              },
              height: chartHeight,
              resizable: true,
              axes: {
                bottom: {
                  mapsTo: "key",
                  scaleType: ScaleTypes.LABELS,
                },
                left: {
                  mapsTo: "value",
                  scaleType: ScaleTypes.LINEAR,
                  title: "Chance of precipitation (%)",
                  domain: [0, 100],
                  includeZero: true,
                },
              },
              legend: {
                enabled: false,
              },
              tooltip: {
                valueFormatter: (value) => `${value}%`,
              },
            }}
          />
        ) : (
          <LineChart
            data={windData}
            options={{
              title: `${title} \u2013 Wind`,
              accessibility: {
                svgAriaLabel: `Line chart of wind speed by three-hour interval for ${title}`,
              },
              height: chartHeight,
              resizable: true,
              axes: {
                bottom: {
                  mapsTo: "key",
                  scaleType: ScaleTypes.LABELS,
                },
                left: {
                  mapsTo: "value",
                  scaleType: ScaleTypes.LINEAR,
                  title: "Wind speed (mph)",
                  includeZero: true,
                },
              },
              legend: {
                enabled: false,
              },
              tooltip: {
                valueFormatter: (value) => `${value} mph`,
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
