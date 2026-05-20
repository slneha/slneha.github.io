# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run format     # Prettier
```

There is no test suite.

## Architecture

Single-page portfolio site for Neha L. Senthil. Stack: **React 19 + TypeScript + Vite + TanStack Router (file-based) + Tailwind CSS v4 + Three.js**.

### Routing

TanStack Router with file-based routing. `src/routeTree.gen.ts` is **auto-generated** — never edit it manually; Vite regenerates it on save. The only route is `/` (`src/routes/index.tsx`), which assembles portfolio sections in sequence. `src/routes/__root.tsx` is the root layout (just `<Outlet />`).

### Portfolio sections

All content lives in `src/components/portfolio/`. The page order is defined in `src/routes/index.tsx`:

```
Nav → Hero → Experience → Projects → Research → Skills → Contact
```

Each section uses two shared primitives:
- **`<Section>`** — provides `id`, section label, ghost number watermark, and `alt` background toggle
- **`<Reveal>`** — wraps any element in an `IntersectionObserver`-driven fade+slide-in animation (adds `.reveal` + `.is-visible` CSS classes)

### Design system

Defined entirely in `src/styles.css`. The portfolio uses a fixed dark theme regardless of OS preference. Key CSS custom properties:

| Token | Value | Use |
|---|---|---|
| `--accent-primary` | `#00e5c3` (teal) | Highlights, glows, active states |
| `--bg-primary` | `#080c10` | Page background |
| `--bg-secondary` | `#0d1117` | Card/alt-section background |
| `--text-primary` | `#e8f0f5` | Body text |
| `--text-secondary` | `#7a8fa6` | Muted text |

Three typefaces (loaded from Google Fonts):
- `font-display` → Syne (headings)
- `font-mono` → DM Mono (body, labels)
- `font-data` → Syne Mono (metrics, chips)

Tailwind v4 is configured via `@theme inline` in `styles.css`, mapping CSS vars to Tailwind utilities — no `tailwind.config.js`.

### 3D Terminal Cube

`src/components/portfolio/TerminalCube.tsx` — raw Three.js (not react-three-fiber), lazy-loaded in `Hero`. Each of 6 cube faces is a persistent `<canvas>` drawn into with a Canvas 2D context. Faces animate a terminal "typing" effect cycling through ML/engineering scenarios. Face content is defined in the `FACES` array at the top of the file.

### Path alias

`@/` maps to `src/` via `vite-tsconfig-paths` + `tsconfig.json`.

### Lovable origin

This project was scaffolded via [Lovable](https://lovable.dev). The `@lovable.dev/vite-tanstack-config` devDependency is vestigial scaffolding — the actual Vite config is in `vite.config.ts`.
