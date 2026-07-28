import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem } from "@carbon/react";
import "./story-layouts.scss";

type AccordionStoryArgs = Omit<ComponentProps<typeof Accordion>, "children"> & {
  firstItemOpen: boolean;
  firstItemTitle: string;
  secondItemTitle: string;
  thirdItemTitle: string;
};

const forecastDay = () => (
  <div className="forecast-day">
    <div className="forecast-day__slot">
      <span>9 AM</span>
      <span>58&deg;F, sunny</span>
    </div>
    <div className="forecast-day__slot">
      <span>12 PM</span>
      <span>65&deg;F, sunny</span>
    </div>
    <div className="forecast-day__slot">
      <span>3 PM</span>
      <span>68&deg;F, partly cloudy</span>
    </div>
    <div className="forecast-day__slot">
      <span>6 PM</span>
      <span>61&deg;F, partly cloudy</span>
    </div>
  </div>
);

const meta = {
  title: "Carbon/Disclosure/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Progressively discloses a set of related sections, such as each day in a five-day forecast, without showing every detail at once.",
      },
    },
  },
  argTypes: {
    firstItemOpen: { control: "boolean" },
    firstItemTitle: { control: "text" },
    secondItemTitle: { control: "text" },
    thirdItemTitle: { control: "text" },
  },
  args: {
    firstItemOpen: false,
    firstItemTitle: "Monday",
    secondItemTitle: "Tuesday",
    thirdItemTitle: "Wednesday",
  },
  render: (args) => (
    // AccordionItem's `open` prop only sets the initial state, so the group is
    // remounted (via `key`) whenever `firstItemOpen` changes so the control
    // takes effect immediately instead of being ignored on update.
    <Accordion className="forecast-accordion" key={String(args.firstItemOpen)}>
      <AccordionItem title={args.firstItemTitle} open={args.firstItemOpen}>
        {forecastDay()}
      </AccordionItem>
      <AccordionItem title={args.secondItemTitle}>{forecastDay()}</AccordionItem>
      <AccordionItem title={args.thirdItemTitle}>{forecastDay()}</AccordionItem>
    </Accordion>
  ),
} satisfies Meta<AccordionStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CollapsedGroup: Story = {
  args: {
    firstItemOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use when every section should start collapsed, such as a forecast list a viewer scans and expands on demand.",
      },
    },
  },
};

export const OpenByDefault: Story = {
  args: {
    firstItemOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the `open` prop to expand the most relevant section by default, such as today's forecast.",
      },
    },
  },
};
