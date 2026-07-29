# Forecast4U Storybook

This is the independently managed Storybook component catalog for
Forecast4U. It lives in its own nested project and is not part of the root
Forecast4U application's build, tests, or deployment.

## Purpose

This catalog documents and tests IBM Carbon components and Forecast4U-specific
design-system components in isolation, outside of the main application's
routing and data-fetching context.

## Technologies

- React
- TypeScript
- Storybook
- Vite
- IBM Carbon (`@carbon/react`, `@carbon/charts-react`)
- Vitest
- Playwright
- Storybook accessibility addon (`@storybook/addon-a11y`)

## Prerequisites

- Node 24
- pnpm 10.14

## Setup and commands

Run all commands from this `storybook/` directory.

```bash
pnpm install         # Install dependencies
pnpm storybook       # Start Storybook on port 6006
pnpm test            # Run Storybook interaction tests
pnpm build-storybook # Produce the static build in storybook-static
```

## Catalog

- Carbon Accordion
- Carbon Button
- Carbon InlineNotification
- Carbon TextInput
- Carbon Tile
- Forecast4U WeatherAlertCard
- Forecast4U WeatherTrendChart

Each story can be viewed under any of the four supported Carbon themes
(`white`, `g10`, `g90`, `g100`) using the theme toolbar in Storybook.

## Testing

Stories contain interaction tests defined alongside each component. These are
executed through Vitest in headless Chromium via `@storybook/addon-vitest`.
Accessibility checks run through `@storybook/addon-a11y` and currently report
violations in the test UI (`test: "todo"`) rather than failing the run.

## Deployment

`storybook/netlify.toml` configures this project as its own Netlify site,
separate from the root Forecast4U deployment:

```toml
[build]
command = "pnpm build-storybook"
publish = "storybook-static"
```

When configuring the Netlify site, set the base directory to `storybook/` so
the build runs against this project's `package.json` and lockfile.

## Directory overview

- `.storybook/` — Storybook configuration, including the Carbon theme
  decorator and addon setup
- `src/stories/carbon/` — Stories for the Carbon components in the catalog
- `src/components/` — Forecast4U-specific components (`WeatherAlertCard`,
  `WeatherTrendChart`) and their stories
- `src/styles/` — Shared Carbon styles imported by Storybook

## Independence from the root application

This nested project has its own `package.json` and `pnpm-lock.yaml`. It is
installed, built, tested, and deployed independently of the root Forecast4U
application.
