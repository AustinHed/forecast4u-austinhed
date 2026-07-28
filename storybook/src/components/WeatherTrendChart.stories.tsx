import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  WeatherTrendChart,
  type WeatherTrendPoint,
} from "./WeatherTrendChart";

const TYPICAL_DAY_POINTS: WeatherTrendPoint[] = [
  {
    time: "12 AM",
    temperatureF: 58,
    apparentTemperatureF: 57,
    precipitationProbability: 0,
    windSpeedMph: 4,
  },
  {
    time: "3 AM",
    temperatureF: 55,
    apparentTemperatureF: 54,
    precipitationProbability: 0,
    windSpeedMph: 3,
  },
  {
    time: "6 AM",
    temperatureF: 54,
    apparentTemperatureF: 52,
    precipitationProbability: 0,
    windSpeedMph: 5,
  },
  {
    time: "9 AM",
    temperatureF: 63,
    apparentTemperatureF: 62,
    precipitationProbability: 5,
    windSpeedMph: 7,
  },
  {
    time: "12 PM",
    temperatureF: 72,
    apparentTemperatureF: 73,
    precipitationProbability: 10,
    windSpeedMph: 9,
  },
  {
    time: "3 PM",
    temperatureF: 76,
    apparentTemperatureF: 78,
    precipitationProbability: 15,
    windSpeedMph: 11,
  },
  {
    time: "6 PM",
    temperatureF: 70,
    apparentTemperatureF: 71,
    precipitationProbability: 5,
    windSpeedMph: 8,
  },
  {
    time: "9 PM",
    temperatureF: 62,
    apparentTemperatureF: 61,
    precipitationProbability: 0,
    windSpeedMph: 6,
  },
];

const RAINY_DAY_POINTS: WeatherTrendPoint[] = [
  {
    time: "12 AM",
    temperatureF: 52,
    apparentTemperatureF: 50,
    precipitationProbability: 20,
    windSpeedMph: 10,
  },
  {
    time: "3 AM",
    temperatureF: 51,
    apparentTemperatureF: 49,
    precipitationProbability: 35,
    windSpeedMph: 12,
  },
  {
    time: "6 AM",
    temperatureF: 50,
    apparentTemperatureF: 47,
    precipitationProbability: 55,
    windSpeedMph: 14,
  },
  {
    time: "9 AM",
    temperatureF: 53,
    apparentTemperatureF: 51,
    precipitationProbability: 80,
    windSpeedMph: 16,
  },
  {
    time: "12 PM",
    temperatureF: 56,
    apparentTemperatureF: 54,
    precipitationProbability: 95,
    windSpeedMph: 18,
  },
  {
    time: "3 PM",
    temperatureF: 55,
    apparentTemperatureF: 52,
    precipitationProbability: 90,
    windSpeedMph: 15,
  },
  {
    time: "6 PM",
    temperatureF: 54,
    apparentTemperatureF: 51,
    precipitationProbability: 60,
    windSpeedMph: 11,
  },
  {
    time: "9 PM",
    temperatureF: 52,
    apparentTemperatureF: 49,
    precipitationProbability: 30,
    windSpeedMph: 9,
  },
];

const WINDY_DAY_POINTS: WeatherTrendPoint[] = [
  {
    time: "12 AM",
    temperatureF: 48,
    apparentTemperatureF: 42,
    precipitationProbability: 0,
    windSpeedMph: 18,
  },
  {
    time: "3 AM",
    temperatureF: 46,
    apparentTemperatureF: 39,
    precipitationProbability: 0,
    windSpeedMph: 22,
  },
  {
    time: "6 AM",
    temperatureF: 45,
    apparentTemperatureF: 37,
    precipitationProbability: 0,
    windSpeedMph: 28,
  },
  {
    time: "9 AM",
    temperatureF: 49,
    apparentTemperatureF: 41,
    precipitationProbability: 5,
    windSpeedMph: 34,
  },
  {
    time: "12 PM",
    temperatureF: 54,
    apparentTemperatureF: 46,
    precipitationProbability: 5,
    windSpeedMph: 39,
  },
  {
    time: "3 PM",
    temperatureF: 55,
    apparentTemperatureF: 47,
    precipitationProbability: 0,
    windSpeedMph: 36,
  },
  {
    time: "6 PM",
    temperatureF: 51,
    apparentTemperatureF: 43,
    precipitationProbability: 0,
    windSpeedMph: 27,
  },
  {
    time: "9 PM",
    temperatureF: 48,
    apparentTemperatureF: 41,
    precipitationProbability: 0,
    windSpeedMph: 20,
  },
];

const meta = {
  title: "Forecast4U/WeatherTrendChart",
  component: WeatherTrendChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visualizes normalized three-hour weather data for a location as a switchable Carbon Charts line or bar chart. It is provider-independent: it accepts already-normalized `WeatherTrendPoint` data and never fetches from a weather API itself, so it can be reused wherever three-hour forecast trends need to be shown for temperature, precipitation, or wind.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    defaultMetric: {
      control: "select",
      options: ["temperature", "precipitation", "wind"],
    },
    height: { control: { type: "range", min: 240, max: 480, step: 10 } },
    points: { control: "object" },
  },
  args: {
    title: "3-hour forecast",
    subtitle: "Today, local time",
    defaultMetric: "temperature",
    height: 320,
    points: TYPICAL_DAY_POINTS,
  },
  render: (args) => <WeatherTrendChart {...args} />,
} satisfies Meta<typeof WeatherTrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypicalDay: Story = {
  args: {
    title: "3-hour forecast",
    subtitle: "Today, local time",
    defaultMetric: "temperature",
    height: 320,
    points: TYPICAL_DAY_POINTS,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a typical day, initially on the temperature view with realistic Temperature and Feels like series.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("tab", { name: "Temperature" }),
    ).toHaveAttribute("aria-selected", "true");

    const windTab = await canvas.findByRole("tab", { name: "Wind" });
    await userEvent.click(windTab);

    await expect(windTab).toHaveAttribute("aria-selected", "true");
  },
};

export const RainyDay: Story = {
  args: {
    title: "3-hour forecast",
    subtitle: "Today, local time",
    defaultMetric: "precipitation",
    height: 320,
    points: RAINY_DAY_POINTS,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a rainy day, initially on the precipitation view with varied probability values.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("tab", { name: "Precipitation" }),
    ).toHaveAttribute("aria-selected", "true");
  },
};

export const WindyDay: Story = {
  args: {
    title: "3-hour forecast",
    subtitle: "Today, local time",
    defaultMetric: "wind",
    height: 320,
    points: WINDY_DAY_POINTS,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a windy day, initially on the wind view with varied mph values.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("tab", { name: "Wind" }),
    ).toHaveAttribute("aria-selected", "true");
  },
};

export const EmptyData: Story = {
  args: {
    title: "3-hour forecast",
    subtitle: "Today, local time",
    defaultMetric: "temperature",
    height: 320,
    points: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the empty state shown when no trend data is available yet.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("No trend data is available."),
    ).toBeInTheDocument();
  },
};
