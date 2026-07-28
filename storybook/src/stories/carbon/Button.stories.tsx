import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@carbon/react";
import "./story-layouts.scss";

const meta = {
  title: "Carbon/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The primary control for triggering a single explicit action, such as submitting a ZIP code search. Choose a `kind` that matches how important the action is relative to other actions on the page.",
      },
    },
  },
  argTypes: {
    kind: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "danger",
        "ghost",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Get forecast",
    kind: "primary",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    kind: "primary",
    children: "Get Forecast"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use for the single most important action on a page, such as submitting a ZIP code search.",
      },
    },
  },
};

export const Secondary: Story = {
  args: { kind: "secondary" },
  parameters: {
    docs: {
      description: {
        story:
          "Use for a supporting action alongside a primary button, such as resetting a form.",
      },
    },
  },
};

export const Tertiary: Story = {
  args: { kind: "tertiary" },
  parameters: {
    docs: {
      description: {
        story:
          "Use for a low-emphasis action that still needs to read as an explicit button.",
      },
    },
  },
};

export const Danger: Story = {
  args: { kind: "danger", children: "Delete saved location" },
  parameters: {
    docs: {
      description: {
        story:
          "Use for destructive actions, such as removing a saved location from the forecast list.",
      },
    },
  },
};

export const Disabled: Story = {
  args: { kind: "primary", disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          "Use while an action is unavailable, such as before a valid ZIP code has been entered.",
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="xl">
        Extra large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Representative sizes. Choose a size that matches the density of the surrounding layout.",
      },
    },
  },
};
