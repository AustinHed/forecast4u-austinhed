import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem } from "@carbon/react";
import "./story-layouts.scss";

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
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const CollapsedGroup: Story = {
  render: () => (
    <Accordion className="forecast-accordion">
      <AccordionItem title="Monday">{forecastDay()}</AccordionItem>
      <AccordionItem title="Tuesday">{forecastDay()}</AccordionItem>
      <AccordionItem title="Wednesday">{forecastDay()}</AccordionItem>
    </Accordion>
  ),
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
  render: () => (
    <Accordion className="forecast-accordion">
      <AccordionItem title="Monday" open>
        {forecastDay()}
      </AccordionItem>
      <AccordionItem title="Tuesday">{forecastDay()}</AccordionItem>
      <AccordionItem title="Wednesday">{forecastDay()}</AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the `open` prop to expand the most relevant section by default, such as today's forecast.",
      },
    },
  },
};
