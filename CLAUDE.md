# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **mattykuch.github.io** — a GitHub Pages static portfolio site showcasing data visualization projects and professional work. There is no build step, bundler, or package manager. All files are served as-is via GitHub Pages.

## Development

- **No build/lint/test commands.** This is a pure static site with vanilla HTML, CSS, and JavaScript.
- To preview locally, open `index.html` in a browser or use any local static server (e.g., `python -m http.server`).
- Deploy by pushing to the `master` branch — GitHub Pages serves from master automatically.

## Git Setup

- **origin**: `bk-advisors/mattykuch.github.io` (fork)
- **upstream**: `mattykuch/mattykuch.github.io` (source)
- Sync with upstream before making changes.

## Architecture

**Portfolio hub (`index.html` + `styles.css`):** The main landing page uses CSS Grid to display a gallery of work items linking to subprojects (either hosted in subdirectories or on external sites like `bk-advisors.github.io`). Uses Google Fonts (DM Sans for body, DM Mono for the haiku).

**Visualization subprojects:** Each subdirectory (e.g., `crimeviz/`, `ugmap/`, `ug_bumpchart/`) is a self-contained project with its own `index.html`, styles, scripts, and data files. They are independent of each other.

**Key libraries used across subprojects (bundled locally, not via npm):**
- D3.js v3 — primary visualization library
- Highcharts — used in `uptake/`
- jQuery, Bootstrap, Mustache.js — used in select subprojects

**Data files:** CSV, TSV, and GeoJSON files live in the top-level `data/` directory (shared) or within individual subproject folders. These contain Uganda public health, education, and geographic data.

## Conventions

- Dates in the portfolio use DD/MM/YYYY format.
- Work items in `index.html` follow a consistent `<a class="work-item">` pattern with image, title, description, and date.
- Images for portfolio thumbnails go in `img/` at the root.

## Design System

- **Fonts:** DM Sans (body/headings) and DM Mono (haiku) via Google Fonts.
- **Cards:** Borderless with soft shadow (`box-shadow`), 12px border-radius. On hover: elevated shadow + blue top-border accent (`#0066cc` light / `#4d9fff` dark).
- **Dark mode:** Automatic via `prefers-color-scheme: dark` media query. Dark palette: `#1a1a1a` background, `#2a2a2a` cards.
- **Animations:** Cards fade in on scroll via `IntersectionObserver` + CSS `@keyframes fadeInUp`. Profile image has a scale+rotate micro-interaction on hover.
- **Accent color:** `#0066cc` (light mode) / `#4d9fff` (dark mode) — used sparingly on links and card hover borders.
