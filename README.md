# Forecast4U

A five-day, three-hour-increment weather forecast application built as a technical demonstration.

## Overview

Forecast4U lets a user enter a US ZIP code and view a five-day weather forecast broken into three-hour periods per day, grouped and formatted for quick scanning. It is implemented as a client-only React single-page application.

## Challenge objectives

- Accept a US ZIP code as input.
- Resolve the ZIP code to a location and geographic coordinates.
- Fetch and display five days of forecast data in three-hour increments.
- Provide a shareable, directly-linkable route per ZIP code.
- Handle loading, invalid input, empty, and failure states gracefully.
- Build on an accessible, consistent design system suitable for a production-quality demo.

## Implemented features

- ZIP code search form with client-side validation (`client/components/ZipSearchForm.tsx`).
- Direct-linkable forecast route at `/weather/:zip` (`client/pages/Weather.tsx`).
- Five-day forecast grouped into day sections, each containing three-hour periods (`client/components/ForecastDayGroup.tsx`, `client/components/ForecastPeriodItem.tsx`).
- Loading, not-found, invalid-ZIP, and request-failure states.
- Weather condition code mapping to human-readable descriptions (`client/lib/weatherConditions.ts`).
- Runtime validation of external API responses with Zod, so malformed responses fail predictably instead of crashing the UI.
- Carbon-based, accessible UI shell (`client/components/AppShell.tsx`).
- A nested Storybook application documenting components in isolation (`storybook/`).

## Architecture and data flow

Forecast4U is a client-only single-page application. There is no backend server; all requests go directly from the browser to public, keyless APIs.

1. The user submits a ZIP code through `ZipSearchForm`, which normalizes and validates it (`client/lib/zip.ts`).
2. The app navigates to `/weather/:zip`.
3. `client/pages/Weather.tsx` calls `getWeatherForZip` (`client/lib/weather.ts`), which:
   - Resolves the ZIP code to coordinates and a timezone via the Open-Meteo Geocoding API.
   - Fetches an hourly forecast for those coordinates from the Open-Meteo Forecast API, requesting Fahrenheit/mph units.
   - Validates both responses with Zod schemas and raises a typed `WeatherError` on failure.
4. `client/lib/forecastGrouping.ts` reduces the returned hourly periods into three-hour increments grouped by day.
5. `ForecastResult`, `ForecastDayGroup`, and `ForecastPeriodItem` render the grouped forecast using Carbon components.

## Technology choices

- **React 18 + TypeScript + Vite**: fast dev server, static SPA build, strong typing.
- **React Router 6**: client-side routing, including the direct-linkable `/weather/:zip` route.
- **IBM Carbon Design System**: the application's only UI library, for accessible, consistent components.
- **Zod**: runtime validation of third-party API responses, since Open-Meteo's shape is not guaranteed at compile time.
- **Vitest + React Testing Library**: unit and component testing without hitting live services.
- **Open-Meteo**: free, keyless geocoding and weather APIs, avoiding the need for API keys or secrets.

## Prerequisites

- Node 24
- pnpm 10.14

## Local installation and development

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:8080`.

### Route examples

- `/` – ZIP code search
- `/weather/90210` – five-day forecast for ZIP 90210
- Any other path – not-found page

## Root commands

```bash
pnpm test        # Run unit tests with Vitest
pnpm typecheck   # Run TypeScript validation
pnpm build       # Build the production SPA to dist/spa
pnpm preview     # Preview the production build locally
```

## Storybook

A separate, independently managed Storybook application lives in `storybook/` and documents UI components in isolation. It has its own `package.json` and lockfile.

```bash
cd storybook
pnpm install
pnpm storybook         # Start Storybook dev server on port 6006
pnpm test              # Run Storybook's Vitest project
pnpm build-storybook   # Build the static Storybook site
```

### Carbon design-system index

The project has a connected Carbon design-system index used to look up components, tokens, and icons during development (see `design-system-docs/`). All new UI is built exclusively from Carbon components and tokens rather than custom or competing libraries.

## Automatic-testing rules

This repository enforces a standing rule (see `AGENTS.md`) that every behavioral code change must include or update relevant unit tests, even when not explicitly requested:

- New utilities in `client/lib/` require a colocated `*.spec.ts` file.
- New or changed components with behavior require a colocated `*.spec.tsx` file.
- External services (ZIP lookup, weather forecast) are always mocked in tests; no test depends on a live network call.
- `pnpm test` and `pnpm typecheck` are run after every behavioral change.

## Open-Meteo usage

Forecast4U uses the [Open-Meteo](https://open-meteo.com) Geocoding and Forecast APIs, which are free and require no API key for non-commercial use. Per Open-Meteo's terms, this free tier is limited to non-commercial use; commercial use requires a paid plan. No API key or environment variable is required to run this application.

## Project structure

```text
client/                   # React SPA
├── pages/                # Route-level components (Index, Weather, NotFound)
├── components/           # Reusable application components
├── lib/                  # ZIP validation, weather API client, forecast grouping, utilities
├── App.tsx               # Application routes and React entry point
└── global.scss           # Global and design-system style entry point

storybook/                # Independently managed Storybook application
design-system-docs/       # Carbon design-system reference documentation
public/                   # Static assets
```

## Deployment

Forecast4U builds to a static single-page app and can be hosted on any static host.

```bash
pnpm build
```

This produces `dist/spa`. Because this is a client-side-routed SPA, the host must rewrite all unknown paths to `index.html` with a `200` status so that direct navigation or refreshes at routes like `/weather/90210` work correctly. `netlify.toml` is configured for this:

```toml
[build]
command = "pnpm build"
publish = "dist/spa"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

No API key or environment variable is required for deployment.
