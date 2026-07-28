export interface WeatherCondition {
  label: string;
  icon: string;
}

const UNKNOWN_CONDITION: WeatherCondition = { label: "Unknown conditions", icon: "\u2753" };

const WEATHER_CONDITIONS: Record<number, WeatherCondition> = {
  0: { label: "Clear sky", icon: "\u2600\ufe0f" },
  1: { label: "Mainly clear", icon: "\ud83c\udf24\ufe0f" },
  2: { label: "Partly cloudy", icon: "\u26c5" },
  3: { label: "Overcast", icon: "\u2601\ufe0f" },
  45: { label: "Fog", icon: "\ud83c\udf2b\ufe0f" },
  48: { label: "Fog", icon: "\ud83c\udf2b\ufe0f" },
  51: { label: "Light drizzle", icon: "\ud83c\udf26\ufe0f" },
  53: { label: "Drizzle", icon: "\ud83c\udf26\ufe0f" },
  55: { label: "Dense drizzle", icon: "\ud83c\udf26\ufe0f" },
  56: { label: "Freezing drizzle", icon: "\ud83c\udf28\ufe0f" },
  57: { label: "Freezing drizzle", icon: "\ud83c\udf28\ufe0f" },
  61: { label: "Slight rain", icon: "\ud83c\udf27\ufe0f" },
  63: { label: "Rain", icon: "\ud83c\udf27\ufe0f" },
  65: { label: "Heavy rain", icon: "\ud83c\udf27\ufe0f" },
  66: { label: "Freezing rain", icon: "\ud83c\udf28\ufe0f" },
  67: { label: "Freezing rain", icon: "\ud83c\udf28\ufe0f" },
  71: { label: "Slight snow", icon: "\ud83c\udf28\ufe0f" },
  73: { label: "Snow", icon: "\ud83c\udf28\ufe0f" },
  75: { label: "Heavy snow", icon: "\ud83c\udf28\ufe0f" },
  77: { label: "Snow grains", icon: "\ud83c\udf28\ufe0f" },
  80: { label: "Slight rain showers", icon: "\ud83c\udf26\ufe0f" },
  81: { label: "Rain showers", icon: "\ud83c\udf26\ufe0f" },
  82: { label: "Violent rain showers", icon: "\ud83c\udf26\ufe0f" },
  85: { label: "Slight snow showers", icon: "\ud83c\udf28\ufe0f" },
  86: { label: "Heavy snow showers", icon: "\ud83c\udf28\ufe0f" },
  95: { label: "Thunderstorm", icon: "\u26c8\ufe0f" },
  96: { label: "Thunderstorm with hail", icon: "\u26c8\ufe0f" },
  99: { label: "Thunderstorm with heavy hail", icon: "\u26c8\ufe0f" },
};

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  return WEATHER_CONDITIONS[weatherCode] ?? UNKNOWN_CONDITION;
}
