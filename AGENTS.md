# Repository Guidelines

## Project Structure & Module Organization
- Root: CI/DevOps, repo metadata, and high‑level scripts.
- `kredit-app/`: Main Node.js app (Express server + static frontend).
  - `public/`: HTML/CSS/JS assets (`index.html`, `style.css`, `script.js`).
  - `__tests__/`: Jest tests (`*.test.js`).
  - Config: `jest.config.js`, `jest.setup.js`, `stryker.conf.js`, `Dockerfile`.
- `charts/kredit-app/`: Helm chart for Kubernetes deploy.

## Build, Test, and Development Commands
- Install deps: `cd kredit-app && npm install`
- Run locally: `npm start` (serves `public/` on `http://localhost:3000`).
- Unit tests: `npm test -- --coverage` (HTML report in `kredit-app/html-report`).
- Mutation tests: `npm run mutation` (Stryker report in `kredit-app/reports` or console).
- Update deps: from root `npm run update-deps` (delegates to `kredit-app`).
- Docker build: `docker build -t kredit-app:latest -f kredit-app/Dockerfile .`

## Coding Style & Naming Conventions
- Language: Node.js (CommonJS). Target Node 16+ (matches CI).
- Indentation: 2 spaces; include semicolons; prefer single quotes in JS.
- Filenames: lowercase with hyphens for assets (`public/`), `camelCase` for JS identifiers.
- Keep server code in `server.js`; browser code in `public/script.js`.
- No linter configured; format consistently with the existing style.

## Testing Guidelines
- Framework: Jest; environments `jsdom` (frontend) and `node` (server).
- Location: `kredit-app/__tests__/*.test.js` (avoid spaces in filenames).
- Write tests for new logic in `public/script.js` and routes/middleware in `server.js`.
- Run: `npm test -- --coverage`. CI publishes an HTML report.
- Optional: use Stryker (`npm run mutation`) to assess test effectiveness.

## Commit & Pull Request Guidelines
- Use Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `docs:`, etc. (CI uses conventional‑changelog).
- Reference issues: `Fixes #123` in the description when applicable.
- PRs should include: concise summary, rationale, screenshots/GIFs for UI changes, test coverage notes, and any dev/test steps.
- Keep changes scoped; update README or Helm values when behavior changes.

## Security & Configuration Tips
- Local config via `.env` (e.g., `PORT`); avoid committing secrets.
- CI runs CodeQL; address alerts before merging.
- For Kubernetes, update `charts/kredit-app/values.yaml` to match image/tag and service settings.
