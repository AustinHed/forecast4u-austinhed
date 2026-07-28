import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tile } from "@carbon/react";
import "./story-layouts.scss";

type TileStoryArgs = Omit<ComponentProps<typeof Tile>, "children"> & {
  heading: string;
  body: string;
  dayLabel: string;
  temperatureF: number;
  condition: string;
  highF: number;
  lowF: number;
  chanceOfRainPercent: number;
};

const meta: Meta<TileStoryArgs> = {
  title: "Carbon/Content/Tile",
  component: Tile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A bounded surface for grouping related, read-only content so it stands out from the page background, such as a single day's weather summary.",
      },
    },
  },
  argTypes: {
    heading: { control: "text" },
    body: { control: "text" },
    dayLabel: { control: "text" },
    temperatureF: { control: { type: "number", min: -20, max: 130, step: 1 } },
    condition: { control: "text" },
    highF: { control: { type: "number", min: -20, max: 130, step: 1 } },
    lowF: { control: { type: "number", min: -20, max: 130, step: 1 } },
    chanceOfRainPercent: {
      control: { type: "number", min: 0, max: 100, step: 1 },
    },
  },
  args: {
    heading: "Account summary",
    body: "You have 3 saved locations.",
    dayLabel: "Today",
    temperatureF: 72,
    condition: "Partly cloudy",
    highF: 76,
    lowF: 58,
    chanceOfRainPercent: 10,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    dayLabel: { table: { disable: true } },
    temperatureF: { table: { disable: true } },
    condition: { table: { disable: true } },
    highF: { table: { disable: true } },
    lowF: { table: { disable: true } },
    chanceOfRainPercent: { table: { disable: true } },
  },
  render: (args) => (
    <Tile>
      <h4>{args.heading}</h4>
      <p>{args.body}</p>
    </Tile>
  ),
  parameters: {
    docs: {
      description: {
        story: "A static tile grouping unrelated-to-forecast, read-only content.",
      },
    },
  },
};

export const WeatherSummary: Story = {
  argTypes: {
    heading: { table: { disable: true } },
    body: { table: { disable: true } },
  },
  render: (args) => (
    <Tile className="weather-summary-tile">
      <div className="weather-summary-tile__header">
        <h4>{args.dayLabel}</h4>
        <span className="weather-summary-tile__temperature">
          {args.temperatureF}&deg;F
        </span>
      </div>
      <p>{args.condition}</p>
      <div className="weather-summary-tile__details">
        <div className="weather-summary-tile__detail-row">
          <span>High</span>
          <span>{args.highF}&deg;F</span>
        </div>
        <div className="weather-summary-tile__detail-row">
          <span>Low</span>
          <span>{args.lowF}&deg;F</span>
        </div>
        <div className="weather-summary-tile__detail-row">
          <span>Chance of rain</span>
          <span>{args.chanceOfRainPercent}%</span>
        </div>
      </div>
    </Tile>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A representative weather-summary composition built only from the installed Tile primitive and layout tokens.",
      },
    },
  },
};
