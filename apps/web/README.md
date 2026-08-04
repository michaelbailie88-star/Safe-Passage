# @safe-passage/web

The main Safe Passage web app — Next.js 14 (App Router) + TypeScript + TailwindCSS.

## Status
Landing page only, built and design-reviewed. Auth, Dashboard, Logbook, Check-ins,
Programs, Stripe, and Admin are not yet implemented — see [/docs/09-product-roadmap.md](../../docs/09-product-roadmap.md).

## Run locally
```bash
npm install
npm run dev
```

## Design system
- Palette: storm-navy background, warm "lighthouse beam" gold accent, sea-glass teal secondary accent
- Type: Fraunces (display), Inter (body), IBM Plex Mono (labels/eyebrows)
- Signature element: an animated lighthouse beam sweep in the hero (`app/globals.css`), respects `prefers-reduced-motion`
