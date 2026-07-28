import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "@carbon/react";

const meta = {
  title: "Carbon/Forms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single-line text field used to collect free-form input, such as a ZIP code. Prefer it over a custom `<input>` for any single-line value.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    warn: { control: "boolean" },
  },
  args: {
    id: "zip-code",
    labelText: "ZIP code",
    placeholder: "Enter a 5-digit ZIP code",
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use for a standard, unvalidated text field.",
      },
    },
  },
};

export const HelperText: Story = {
  args: {
    helperText: "Used to look up the five-day forecast for your area.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Add helper text when the field's purpose or format isn't obvious from the label alone.",
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    invalidText: "Enter a valid 5-digit ZIP code.",
    defaultValue: "941",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use to surface validation errors, such as an incomplete or malformed ZIP code.",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "94103",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use while the field is not editable, such as when a ZIP code is locked in during a search.",
      },
    },
  },
};
