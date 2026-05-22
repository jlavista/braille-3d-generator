# braille-3d-generator Copilot instructions

## Build, lint, and run commands

- Use Node 20 to match `.github/workflows/deploy-pages.yml`.
- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Build the production bundle with `npm run build`.
- Preview the production build with `npm run preview`.
- Lint with `npm run lint`. The script runs `eslint .`, but there is no checked-in ESLint config yet, so expect lint work to include adding or restoring that config first.
- There is currently no test runner, test script, or checked-in `*.test.*` / `*.spec.*` suite, so there is no single-test command yet.

## High-level architecture

- `src/main.tsx` is the application entry point. It boots the Spark runtime, mounts the React tree, and wraps the app in `react-error-boundary` with `ErrorFallback`.
- `src/App.tsx` is the orchestration layer. It owns the text input, selected braille mode, generated `THREE.BufferGeometry`, and STL dialog state.
- `src/lib/braille.ts` is the source of truth for braille behavior. It defines the Grade 1, Grade 2, UEB, and numeric mappings, handles contractions and indicators, converts dot patterns to Unicode braille, and exposes `getDotPositions()` for geometry generation.
- `src/components/BrailleDisplay.tsx` and `src/components/BrailleViewer3D.tsx` both consume the same `BrailleChar[]` output from `textToBraille()`. The 3D viewer builds the base plate and dots with Three.js, merges world-space meshes into one geometry, and returns that geometry to `App` through `onGeometryUpdate`.
- `src/lib/stl-export.ts` turns the merged geometry into ASCII STL and handles the browser download flow. STL export depends on the geometry produced by `BrailleViewer3D`, not on a separate model layer.
- Deployment is tied to GitHub Pages. `vite.config.ts` sets `base: "/braille-3d-generator/"`, and `.github/workflows/deploy-pages.yml` builds `dist` and publishes it on pushes to `main`.

## Key repository conventions

- Keep braille translation logic centralized in `src/lib/braille.ts`. If you add a new braille rule, punctuation mapping, contraction, or fallback, update it there so the text display, 3D preview, and STL export all stay consistent.
- Preserve the `BrailleChar[] -> BrailleViewer3D -> onGeometryUpdate -> generateSTL()` pipeline. If you change dot dimensions, spacing, or mesh generation in `BrailleViewer3D`, verify the exported STL still reflects the same geometry.
- Unsupported characters currently map to a full-cell fallback (`U+283F`) in the translation helpers. Change that behavior consistently across all braille modes if you touch it.
- Use the `@` path alias for imports from `src`. The alias is defined in both `vite.config.ts` and `tsconfig.json`.
- Reuse the existing shadcn/Radix primitives in `src/components/ui` before introducing new base components. `components.json` is configured for the `new-york` style and points shared helpers at `@/components`, `@/components/ui`, `@/hooks`, and `@/lib`.
- Prefer theme-token changes over hard-coded colors or spacing. App-specific tokens live in `src/index.css`, broader Spark/Tailwind token scaffolding lives in `src/styles/theme.css`, and `tailwind.config.js` can merge overrides from `theme.json`.
- Keep the Spark integration intact unless the platform is being intentionally removed or replaced. The important pieces are `import "@github/spark/spark"` in `src/main.tsx` and the Spark Vite plugins in `vite.config.ts`.
