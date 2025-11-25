# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds all runtime code; key areas include `components/` for reusable UI, `context/` for global providers, `store/` for Redux Toolkit slices, and `__tests__/` for Jest suites.
- `public/` exposes static assets served by Vite; `assets/` under `app/` stores module-scoped media.
- Build artifacts emit to `dist/`; coverage data lands in `coverage/`. Scripts such as `scripts/extract-translations.js` support localization updates.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite dev server at `http://localhost:5173` with HMR.
- `npm run build` creates a production bundle; the `postbuild` hook auto-runs lint, format check, and full tests.
- `npm run preview` serves the built output locally; `npm run start` uses `serve` for deployment previews (honors `$PORT`).
- `npm run extract-translations` refreshes `translation.json` when copy changes land in components.

## Coding Style & Naming Conventions
- TypeScript + React function components are the default; place shared types in `app/types/`.
- Prettier enforces two-space indentation and single quotes; run `npm run format` before large refactors.
- ESLint (Airbnb + React + TypeScript configs) powers `npm run lint`; fix warnings prior to review or commit.
- Name tests `<Component>.test.tsx` and colocate helpers in `app/test-utils/`; keep file names kebab- or camel-case to match existing modules.

## Testing Guidelines
- Jest with React Testing Library lives in this repo; `app/setupTests.ts` registers custom matchers.
- Coverage thresholds (50% lines, 45% functions, 35% branches) are enforced by `jest.config.ts`; failing coverage blocks builds.
- Use `npm run test` for local runs, `npm run test:ci` in pipelines, and `npm run test:update` only when snapshot intent is documented.

## Commit & Pull Request Guidelines
- Follow Conventional Commits seen in history (`feat:`, `chore:`, `fix:`). Scope optional but recommended (`feat(layout):`).
- Each PR should describe motivation, summarize UI changes (include screenshots for visual updates), and link Jira/GitHub issues.
- Ensure `npm run lint`, `npm run format:check`, and `npm run test` pass before opening a PR; attach coverage reports when thresholds are close.

## Environment & Configuration
- Copy `.env.local.example` to `.env.local` for dev secrets; never commit populated `.env` files.
- Authentication to GitHub Packages requires exporting `GH_FE_COMMON_TOKEN` before `npm install`.
- When working with `@kivunova/kivufrontendcommon`, either keep the sibling repo at `../kivufrontendcommon` (file dependency) or use `npm link` as documented in `README.md`.
