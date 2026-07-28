import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tile } from "@carbon/react";
import "./story-layouts.scss";

const meta = {
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
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tile>
      <h4>Account summary</h4>
      <p>You have 3 saved locations.</p>
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
  render: () => (
    <Tile className="weather-summary-tile">
      <div className="weather-summary-tile__header">
        <h4>Today</h4>
        <span className="weather-summary-tile__temperature">72&deg;F</span>
      </div>
      <p>Partly cloudy</p>
      <div className="weather-summary-tile__details">
        <div className="weather-summary-tile__detail-row">
          <span>High</span>
          <span>76&deg;F</span>
        </div>
        <div className="weather-summary-tile__detail-row">
          <span>Low</span>
          <span>58&deg;F</span>
        </div>
        <div className="weather-summary-tile__detail-row">
          <span>Chance of rain</span>
          <span>10%</span>
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
