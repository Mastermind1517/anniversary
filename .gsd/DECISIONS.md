# DECISIONS.md — Architecture Decision Records

> Chronological log of significant project decisions.

| # | Date | Decision | Rationale | Alternatives Considered |
|---|------|----------|-----------|------------------------|
| 1 | 2026-10-24 | Astro + React islands | Static-first performance; only 3D canvas hydrates, minimal JS shipped | Vite + React (more JS), Next.js (heavier) |
| 2 | 2026-10-24 | Scroll-driven continuous camera path | Most cinematic; single environment walkthrough matches gallery metaphor | Multi-page routes, sectioned scroll |
| 3 | 2026-10-24 | Config-file content system | Simple, no backend; developer can swap photos/text easily | CMS (overkill), hardcoded (inflexible) |
| 4 | 2026-10-24 | Cormorant Garamond + Inter | Luxury editorial serif + clean sans-serif; matches art direction | Playfair Display, EB Garamond |
| 5 | 2026-10-24 | Vercel deployment | Free tier, fast CDN, Astro-native adapter | Netlify, GitHub Pages |
