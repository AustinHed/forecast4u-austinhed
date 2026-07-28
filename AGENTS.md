# Forecast4U Agent Instructions

## Project objective

Forecast4U is a proof-of-value weather application built with React, TypeScript, and Vite. It displays five days of forecast data in three-hour increments at `/weather/:zip`.

Keep the implementation focused, maintainable, accessible, and suitable for a technical demonstration.

## Existing architecture

This repository is a client-only single-page application:

- Frontend: React 18, React Router 6, TypeScript, and Vite
- Validation: Zod for validating external API responses
- Testing: Vitest and React Testing Library
- Package manager: pnpm
- Development port: 8080

There is no server. All data fetching (ZIP-to-coordinates lookup and weather forecasts) happens directly from the browser against public APIs.

Use the dependency versions already declared in `package.json`. Do not upgrade frameworks or replace the existing architecture unless explicitly requested.

## Project structure

```text
client/                   # React SPA
├── pages/                # Route-level components
├── components/           # Reusable application components
├── lib/                  # Utilities, API clients, and data transformations
├── App.tsx               # Application routes and React entry point
└── global.scss           # Global and design-system style entry point

storybook/                # Nested Storybook application documenting UI components
```

Existing alias:

- `@/*` maps to `client/*`

Preserve this structure unless a change provides a clear architectural benefit.

## Routing

- Use React Router for application routing.
- Define routes in `client/App.tsx`.
- Put route-level components in `client/pages/`.
- Add all application routes before the catch-all `*` route.
- The required forecast route is `/weather/:zip`.
- Direct navigation and browser refreshes must work for `/weather/:zip`.

## Server usage

This application does not have a server and should not gain one. All external calls (ZIP lookup, weather forecast) are made directly from the browser using public, keyless APIs.

Do not introduce a server, serverless function, or API route unless a genuine need arises to protect a private credential or run logic that cannot execute in the browser. If that ever happens, explain the reasoning before adding the infrastructure.

## Package management

- Use pnpm for all dependency and script commands.
- Do not create npm or Yarn lockfiles.
- Do not add dependencies unless they are necessary.
- Do not replace existing packages without explaining why.

## Design system

- Use IBM Carbon as the application's only UI design system.
- Use approved Carbon React components, icons, styles, and design tokens.
- Do not add or use Tailwind CSS, shadcn/ui, Radix UI, Lucide, Material UI, Chakra UI, Bootstrap, or another competing UI library.
- Do not recreate a component already available through Carbon.
- Avoid hard-coded color, typography, and spacing values when an appropriate Carbon token exists.
- Keep custom CSS limited to application-specific layout or behavior that Carbon does not provide.

## Application organization

- Use React functional components and TypeScript.
- Put reusable application components in `client/components/`.
- Put reusable utilities in `client/lib/`.
- Keep API access, forecast transformation, and UI rendering separated.
- Keep components small and focused.
- Keep external-service details out of presentation components.

## Testing requirements

- For every code change that adds or modifies behavior, automatically add or update relevant unit tests even when the user does not request tests.
- Use Vitest and React Testing Library.
- Mock external ZIP-code and weather API requests. Unit tests must not depend on live services.
- Test success, loading, invalid-input, empty, and failure behavior when those states apply.
- Run relevant tests after every behavioral change.
- Do not consider a behavioral task complete until its tests pass.
- Fix test and type errors introduced by a change.

Documentation-only and formatting-only changes do not require new tests.

## Security and environment variables

- Never commit real secrets.
- Values exposed through `VITE_*` variables are public browser values and must not be treated as secrets.
- This application currently requires no environment variables. If one becomes necessary, document it in `.env.example`.

## Development commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Start the client on port 8080
pnpm test          # Run Vitest
pnpm typecheck     # Run TypeScript validation
pnpm build         # Create the production build (dist/spa)
pnpm preview       # Preview the production build locally
```

After behavioral changes, run at minimum:

1. `pnpm test`
2. `pnpm typecheck`

Run `pnpm build` after changes to routing, dependencies, configuration, or deployment behavior.

## Nested Storybook application

The `storybook/` directory is a separate, independently managed Storybook application used to document and test UI components in isolation. It has its own `package.json` and lockfile.

```bash
cd storybook
pnpm install           # Install Storybook dependencies
pnpm storybook         # Start Storybook dev server on port 6006
pnpm test              # Run Storybook's Vitest project
pnpm build-storybook   # Build the static Storybook site
```

Changes inside `storybook/` do not affect the root application's build or tests, and vice versa.

## Change quality

- Prefer small, focused changes.
- Preserve existing behavior unless the task explicitly changes it.
- Do not edit unrelated files.
- Explain significant architectural decisions.
- Do not claim a command passed unless it was actually run.
- Do not ignore failing tests, type errors, or build failures.
