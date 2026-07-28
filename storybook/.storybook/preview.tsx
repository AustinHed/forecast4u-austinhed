import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { Theme } from "@carbon/react";
import "../src/styles/carbon.scss";

type CarbonThemeName = "white" | "g10" | "g90" | "g100";

const CARBON_THEMES: CarbonThemeName[] = ["white", "g10", "g90", "g100"];

const WithCarbonTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as CarbonThemeName) ?? "white";

  useEffect(() => {
    document.body.className = `cds--${theme}`;
  }, [theme]);

  return (
    <Theme theme={theme} style={{ minHeight: "100vh", padding: "1rem" }}>
      <Story />
    </Theme>
  );
};

const preview: Preview = {
  tags: ["autodocs"],

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Carbon theme applied to the story canvas",
      defaultValue: "white",
      toolbar: {
        icon: "paintbrush",
        items: CARBON_THEMES.map((themeName) => ({
          value: themeName,
          title: themeName,
        })),
        dynamicTitle: true,
      },
    },
  },

  decorators: [WithCarbonTheme],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
