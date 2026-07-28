import {
  Fog,
  MixedRainHail,
  Rain,
  RainDrizzle,
  RainHeavy,
  Snow,
  SnowHeavy,
  Sun,
  Cloudy,
  PartlyCloudy,
  Thunderstorm,
  ThunderstormSevere,
  Unknown,
  type CarbonIconType,
} from "@carbon/icons-react";

export interface WeatherCondition {
  label: string;
  Icon: CarbonIconType;
}

const UNKNOWN_CONDITION: WeatherCondition = { label: "Unknown conditions", Icon: Unknown };

const WEATHER_CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: "Clear sky", Icon: Sun },
  1: { label: "Mainly clear", Icon: Sun },
  2: { label: "Partly cloudy", Icon: PartlyCloudy },
  3: { label: "Overcast", Icon: Cloudy },
  45: { label: "Fog", Icon: Fog },
  48: { label: "Fog", Icon: Fog },
  51: { label: "Light drizzle", Icon: RainDrizzle },
  53: { label: "Drizzle", Icon: RainDrizzle },
  55: { label: "Dense drizzle", Icon: RainDrizzle },
  56: { label: "Freezing drizzle", Icon: MixedRainHail },
  57: { label: "Freezing drizzle", Icon: MixedRainHail },
  61: { label: "Slight rain", Icon: Rain },
  63: { label: "Rain", Icon: Rain },
  65: { label: "Heavy rain", Icon: RainHeavy },
  66: { label: "Freezing rain", Icon: MixedRainHail },
  67: { label: "Freezing rain", Icon: MixedRainHail },
  71: { label: "Slight snow", Icon: Snow },
  73: { label: "Snow", Icon: Snow },
  75: { label: "Heavy snow", Icon: SnowHeavy },
  77: { label: "Snow grains", Icon: Snow },
  80: { label: "Slight rain showers", Icon: Rain },
  81: { label: "Rain showers", Icon: Rain },
  82: { label: "Violent rain showers", Icon: RainHeavy },
  85: { label: "Slight snow showers", Icon: Snow },
  86: { label: "Heavy snow showers", Icon: SnowHeavy },
  95: { label: "Thunderstorm", Icon: Thunderstorm },
  96: { label: "Thunderstorm with hail", Icon: ThunderstormSevere },
  99: { label: "Thunderstorm with heavy hail", Icon: ThunderstormSevere },
};

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  return WEATHER_CONDITIONS[weatherCode] ?? UNKNOWN_CONDITION;
}
