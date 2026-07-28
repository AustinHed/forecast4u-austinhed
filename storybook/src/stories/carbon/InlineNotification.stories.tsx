import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineNotification } from "@carbon/react";

const meta = {
  title: "Carbon/Feedback/InlineNotification",
  component: InlineNotification,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dismissible message tied to a specific section of a page, such as forecast load status. Prefer it over a toast when the message relates to content the user is actively looking at.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    lowContrast: { control: "boolean" },
  },
  args: {
    title: "Forecast updated",
    subtitle: "Showing the latest five-day forecast.",
  },
} satisfies Meta<typeof InlineNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Informational: Story = {
  args: {
    kind: "info",
    title: "Forecast updated",
    subtitle: "Showing the latest five-day forecast.",
  },
  parameters: {
    docs: {
      description: {
        story: "Use for neutral, non-urgent status updates.",
      },
    },
  },
};

export const Success: Story = {
  args: {
    kind: "success",
    title: "Location saved",
    subtitle: "This ZIP code has been added to your saved locations.",
  },
  parameters: {
    docs: {
      description: {
        story: "Use to confirm that an action completed successfully.",
      },
    },
  },
};

export const Warning: Story = {
  args: {
    kind: "warning",
    title: "Forecast data may be delayed",
    subtitle: "The weather provider last updated this data over an hour ago.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use to flag a condition that isn't an error but the user should be aware of.",
      },
    },
  },
};

export const Error: Story = {
  args: {
    kind: "error",
    title: "Unable to load forecast",
    subtitle: "Check the ZIP code and try again.",
  },
  parameters: {
    docs: {
      description: {
        story: "Use when an action or request has failed.",
      },
    },
  },
};
