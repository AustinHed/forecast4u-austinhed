import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { WeatherAlertCard } from "./WeatherAlertCard";

const meta = {
  title: "Forecast4U/WeatherAlertCard",
  component: WeatherAlertCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a single weather alert for a location, such as a heat advisory or flood watch. Use it to surface actionable, time-bounded conditions alongside the five-day forecast, not for general status messages about the app itself (use InlineNotification for that).\n\n" +
          "Severity levels are ordered by urgency and map to distinct visual treatments:\n" +
          "- **advisory**: informational — conditions that may cause inconvenience.\n" +
          "- **watch**: caution — conditions are favorable for a hazardous event to develop.\n" +
          "- **warning**: urgent — a hazardous event is occurring or imminent.\n\n" +
          "Every alert should include a concrete `effectivePeriod` so the reader knows when the alert applies, since alerts should always contain time-bounded information rather than open-ended warnings.",
      },
    },
  },
  argTypes: {
    severity: {
      control: "select",
      options: ["advisory", "watch", "warning"],
    },
    title: { control: "text" },
    description: { control: "text" },
    effectivePeriod: { control: "text" },
    actionLabel: { control: "text" },
    onAction: { action: "action" },
    className: { control: false },
  },
  args: {
    severity: "advisory",
    title: "Heat advisory",
    description:
      "Temperatures up to 102°F expected. Drink plenty of fluids and stay in an air-conditioned room.",
    effectivePeriod: "Today, 12:00 PM \u2013 8:00 PM",
    actionLabel: "View safety tips",
    onAction: fn(),
  },
} satisfies Meta<typeof WeatherAlertCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeatAdvisory: Story = {
  args: {
    severity: "advisory",
    title: "Heat advisory",
    description:
      "Temperatures up to 102°F expected. Drink plenty of fluids and stay in an air-conditioned room.",
    effectivePeriod: "Today, 12:00 PM \u2013 8:00 PM",
    actionLabel: "View safety tips",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `advisory` for conditions that may cause inconvenience but are not expected to be hazardous.",
      },
    },
  },
};

export const FloodWatch: Story = {
  args: {
    severity: "watch",
    title: "Flood watch",
    description:
      "Heavy rain may cause flooding of low-lying areas and roads near creeks and streams.",
    effectivePeriod: "Tonight, 8:00 PM \u2013 Tomorrow, 6:00 AM",
    actionLabel: "View flood map",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `watch` when conditions are favorable for a hazardous event, but one has not yet occurred.",
      },
    },
  },
};

export const SevereThunderstormWarning: Story = {
  args: {
    severity: "warning",
    title: "Severe thunderstorm warning",
    description:
      "A severe thunderstorm with damaging winds and quarter-size hail was located near downtown, moving east at 35 mph.",
    effectivePeriod: "Until 4:45 PM",
    actionLabel: "View shelter guidance",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `warning` when a hazardous event is occurring, imminent, or highly likely, and immediate action may be needed.",
      },
    },
  },
};

export const WithoutAction: Story = {
  args: {
    severity: "advisory",
    title: "Frost advisory",
    description:
      "Temperatures as low as 34°F expected overnight. Sensitive outdoor plants may be damaged.",
    effectivePeriod: "Tonight, 1:00 AM \u2013 8:00 AM",
    actionLabel: undefined,
    onAction: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The action button is only rendered when both `actionLabel` and `onAction` are supplied. Omit either to render an informational alert with no action.",
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    severity: "watch",
    title:
      "Winter storm watch for the greater metro area and surrounding mountain communities",
    description:
      "A winter storm system moving in from the west is expected to bring a mix of heavy snow, sleet, and freezing rain to the region. Total snow accumulations of 8 to 14 inches are possible above 3,000 feet, with lower accumulations and a greater chance of ice at lower elevations. Travel could be very difficult, particularly during the Tuesday morning and evening commutes.",
    effectivePeriod: "Tuesday, 4:00 AM \u2013 Wednesday, 10:00 PM",
    actionLabel: "View travel advisory",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Confirms the card stays readable with a long title and description, wrapping within the fixed card width rather than overflowing.",
      },
    },
  },
};

export const ActionInteraction: Story = {
  args: {
    severity: "warning",
    title: "Severe thunderstorm warning",
    description:
      "A severe thunderstorm with damaging winds was located near downtown, moving east at 35 mph.",
    effectivePeriod: "Until 4:45 PM",
    actionLabel: "View shelter guidance",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Clicking the action button calls the `onAction` callback exactly once, demonstrated here with Storybook's interaction testing.",
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const actionButton = await canvas.findByRole("button", {
      name: args.actionLabel,
    });

    await userEvent.click(actionButton);

    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};
