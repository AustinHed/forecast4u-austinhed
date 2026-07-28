# Forecast4U Agent Instructions

## Project objective

Forecast4U is a proof-of-value weather application built with React, TypeScript, and Vite. It displays five days of forecast data in three-hour increments at `/weather/:zip`.

Keep the implementation focused, maintainable, accessible, and suitable for a technical demonstration.

## Existing architecture

This repository uses Builder's full-stack Fusion starter:

- Frontend: React 18, React Router 6, TypeScript, and Vite
- Backend: Express integrated with the Vite development server
- Validation: Zod where runtime validation is appropriate
- Testing: Vitest
- Package manager: pnpm
- Development port: 8080

Use the dependency versions already declared in `package.json`. Do not upgrade frameworks or replace the existing architecture unless explicitly requested.

## Project structure

```text
client/                   # React SPA
├── pages/                # Route-level components
├── components/           # Reusable application components
├── lib/                  # Utilities, API clients, and data transformations
├── App.tsx               # Application routes and React entry point
└── global.css            # Global and design-system style entry point

server/                   # Express server
├── index.ts              # Server setup and route registration
└── routes/               # Server-side API handlers

shared/                   # Types shared between client and server
```

Existing aliases:

- `@/*` maps to `client/*`
- `@shared/*` maps to `shared/*`

Preserve this structure unless a change provides a clear architectural benefit.

## Routing

- Use React Router for application routing.
- Define routes in `client/App.tsx`.
- Put route-level components in `client/pages/`.
- Add all application routes before the catch-all `*` route.
- The required forecast route is `/weather/:zip`.
- Direct navigation and browser refreshes must work for `/weather/:zip`.

## Server usage

The starter includes an Express server, but do not create server endpoints unless server-side execution is genuinely necessary.

Appropriate reasons include:

- Protecting private API keys or credentials
- Performing operations that must not run in the browser
- Encapsulating server-only business logic

Server API endpoints must:

- Live under `server/routes/`
- Use the `/api/` prefix
- Define shared request or response types in `shared/` when useful
- Validate untrusted inputs at the server boundary

Do not add an Express endpoint merely to proxy a public API that can be called safely from the browser.

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
- Until Carbon is installed and indexed, do not introduce a new visual component library.

## Application organization

- Use React functional components and TypeScript.
- Put reusable application components in `client/components/`.
- Put reusable utilities in `client/lib/`.
- Keep API access, forecast transformation, and UI rendering separated.
- Keep components small and focused.
- Use shared types rather than duplicating compatible client/server types.
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
- Put private credentials behind the Express server if private credentials become necessary.
- Document required environment variables in `.env.example`.

## Development commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Start client and server on port 8080
pnpm test          # Run Vitest
pnpm typecheck     # Run TypeScript validation
pnpm build         # Create the production build
pnpm start         # Run the production server
```

After behavioral changes, run at minimum:

1. `pnpm test`
2. `pnpm typecheck`

Run `pnpm build` after changes to routing, dependencies, configuration, server behavior, or deployment behavior.

## Change quality

- Prefer small, focused changes.
- Preserve existing behavior unless the task explicitly changes it.
- Do not edit unrelated files.
- Explain significant architectural decisions.
- Do not claim a command passed unless it was actually run.
- Do not ignore failing tests, type errors, or build failures.