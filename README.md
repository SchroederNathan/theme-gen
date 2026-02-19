# Theme Gen

A visual theme generator for creating accessible, shareable color palettes. Pick colors, check contrast ratios against WCAG standards, and export production-ready theme code.

## Features

- **Live Preview** — Every change updates the entire site in real-time.
- **WCAG Contrast Auditing** — Built-in checks for text/background (7:1), primary/background (3:1), text/secondary (4.5:1), and accent pairs (3:1).
- **Smart Shuffle** — Generates random palettes that pass all required contrast checks. Respects locked colors.
- **Color Locking** — Lock any color to preserve it during shuffles.
- **Light / Dark Mode** — Toggle between modes with independent palettes.
- **URL Sharing** — Theme encodes to URL params automatically. Copy the URL to share your palette.
- **Export** — CSS variables, Tailwind CSS (v3 & v4), and SCSS. Supports hex, rgb, and hsl output.
- **EyeDropper** — Pick colors directly from your screen (supported browsers).

## URL Format

Themes are encoded as compact hex values in the URL:

```
/?colors=1a1625-faf9fc-4F46E5-eeedf2-0284C7&mode=light
```

Order: `text-background-primary-secondary-accent`

## Tech Stack

- [Next.js 15](https://nextjs.org) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [chroma-js](https://gka.github.io/chroma.js/) for color manipulation
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
