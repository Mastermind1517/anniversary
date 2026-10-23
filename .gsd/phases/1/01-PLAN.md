---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - package.json
  - astro.config.mjs
  - tsconfig.json
  - tailwind.config.mjs
  - postcss.config.mjs
  - src/env.d.ts
  - src/styles/global.css
  - src/layouts/Layout.astro
  - src/pages/index.astro
  - src/config/content.ts
  - src/config/colors.ts
  - public/.gitkeep
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Astro dev server starts and renders a page at localhost:4321"
    - "React integration is configured and a test React component renders"
    - "Tailwind CSS compiles with custom colour palette"
    - "Cormorant Garamond and Inter fonts are loaded and visible"
    - "CSS custom properties match the SPEC colour system exactly"
    - "Content config exports siteConfig with partner name, memories array, and loveLetter"
  artifacts:
    - "package.json with astro, @astrojs/react, @astrojs/tailwind, react, react-dom, three, @react-three/fiber, @react-three/drei"
    - "src/config/content.ts with full TypeScript typed config"
    - "src/config/colors.ts with colour constants"
    - "src/styles/global.css with @font-face or Google Fonts import, CSS custom properties, and base typography"
    - "src/layouts/Layout.astro with full HTML shell, meta tags, font loading"
---

# Plan 1.1: Project Scaffold, Colour System & Typography

<objective>
Scaffold the Astro project with React integration, install all dependencies (R3F, Drei, Tailwind), establish the strict colour palette as CSS custom properties and Tailwind config, load editorial typography (Cormorant Garamond + Inter), and create the content configuration system.

Purpose: This is the foundation every other plan builds on. Getting colours, fonts, and config right here prevents drift later.
Output: A running Astro dev server with the correct visual identity and content system.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (colour system, tech stack, typography, content config)
</context>

<tasks>

<task type="auto">
  <name>Scaffold Astro + React + R3F + Tailwind project</name>
  <files>
    package.json
    astro.config.mjs
    tsconfig.json
    tailwind.config.mjs
    postcss.config.mjs
    src/env.d.ts
    src/pages/index.astro
    src/layouts/Layout.astro
    public/.gitkeep
  </files>
  <action>
    1. Run `npm create astro@latest . -- --template minimal --no-install --typescript strict` (or manually create the files if the CLI is unavailable).
    2. Install dependencies:
       ```
       npm install astro @astrojs/react @astrojs/tailwind react react-dom three @react-three/fiber @react-three/drei @react-three/postprocessing howler tailwindcss @tailwindcss/typography postcss autoprefixer
       ```
       Also install types: `npm install -D @types/react @types/react-dom @types/three`
    3. Configure astro.config.mjs:
       - Add `@astrojs/react()` integration
       - Add `@astrojs/tailwind()` integration  
       - Set `vite.ssr.noExternal` to handle three.js packages if needed
    4. Configure tailwind.config.mjs:
       - Extend colours with the full SPEC palette under a `brand` key:
         ```js
         brand: {
           burgundy: '#651E2B',
           oxblood: '#42151D',
           crimson: '#8F2635',
           ivory: '#F5F0E7',
           porcelain: '#FFFCF8',
           charcoal: '#211D1D',
           silver: '#B8B0A8',
         }
         ```
       - Extend fontFamily with `serif: ['Cormorant Garamond', 'serif']` and `sans: ['Inter', 'sans-serif']`
    5. Create src/layouts/Layout.astro with:
       - Full HTML5 shell, `<html lang="en">`
       - Meta viewport, charset, title ("One Year")
       - Open Graph meta tags (og:title, og:description, og:image placeholder)
       - Google Fonts preconnect + link for Cormorant Garamond (weights 300, 400, 500, 600) and Inter (weights 300, 400, 500)
       - `<slot />` for page content
       - Link to global.css
    6. Create src/pages/index.astro that uses the Layout and renders a temporary heading.

    AVOID: Using `@astrojs/tailwind` v4 syntax if it causes issues — fall back to standard Tailwind v3 config. 
    AVOID: Importing three.js at the top level of .astro files — it must only load inside React islands with `client:only="react"`.
  </action>
  <verify>
    Run `npx astro dev` — dev server starts on localhost:4321 without errors.
    Visit localhost:4321 — page renders with correct fonts visible.
  </verify>
  <done>
    Astro dev server runs. Page renders. React integration configured. All dependencies installed.
  </done>
</task>

<task type="auto">
  <name>Create colour system, typography styles, and content config</name>
  <files>
    src/styles/global.css
    src/config/colors.ts
    src/config/content.ts
  </files>
  <action>
    1. Create src/styles/global.css:
       - Define CSS custom properties on `:root` for every brand colour:
         ```css
         :root {
           --color-burgundy: #651E2B;
           --color-oxblood: #42151D;
           --color-crimson: #8F2635;
           --color-ivory: #F5F0E7;
           --color-porcelain: #FFFCF8;
           --color-charcoal: #211D1D;
           --color-silver: #B8B0A8;
         }
         ```
       - Set base body styles: `background-color: var(--color-oxblood)`, `color: var(--color-porcelain)`, `font-family: 'Inter', sans-serif`, `margin: 0`, `overflow-x: hidden`
       - Set heading styles: `font-family: 'Cormorant Garamond', serif`, `font-weight: 300`, `letter-spacing: 0.04em`
       - Add smooth scroll: `html { scroll-behavior: smooth; }`
       - Add selection colour: `::selection { background: var(--color-crimson); color: var(--color-porcelain); }`
       - Tailwind directives: `@tailwind base; @tailwind components; @tailwind utilities;`

    2. Create src/config/colors.ts:
       ```typescript
       export const colors = {
         burgundy: '#651E2B',
         oxblood: '#42151D',
         crimson: '#8F2635',
         ivory: '#F5F0E7',
         porcelain: '#FFFCF8',
         charcoal: '#211D1D',
         silver: '#B8B0A8',
       } as const;

       // Three.js compatible hex values
       export const threeColors = {
         burgundy: 0x651E2B,
         oxblood: 0x42151D,
         crimson: 0x8F2635,
         ivory: 0xF5F0E7,
         porcelain: 0xFFFCF8,
         charcoal: 0x211D1D,
         silver: 0xB8B0A8,
       } as const;
       ```

    3. Create src/config/content.ts:
       ```typescript
       export interface Memory {
         id: number;
         photo: string;
         date: string;
         title: string;
         caption: string;
       }

       export interface SiteConfig {
         partner: { name: string };
         opening: {
           line1: string;
           line2: string;
           enterText: string;
         };
         memories: Memory[];
         loveLetter: { text: string };
         finale: {
           line1: string;
           line2: string;
           closing: string;
         };
         audio: { src: string };
       }

       export const siteConfig: SiteConfig = {
         partner: { name: 'Krishangi' },
         opening: {
           line1: 'ONE YEAR.',
           line2: 'An entire world, in a thousand little moments.',
           enterText: 'Enter',
         },
         memories: [
           { id: 1, photo: '/photos/memory-01.jpg', date: '2025-10-24', title: 'The Beginning', caption: 'Where it all started.' },
           { id: 2, photo: '/photos/memory-02.jpg', date: '2025-12-25', title: 'First Winter', caption: 'Our first winter together.' },
           { id: 3, photo: '/photos/memory-03.jpg', date: '2026-02-14', title: 'Valentine\'s Day', caption: 'A day that felt like a lifetime.' },
           { id: 4, photo: '/photos/memory-04.jpg', date: '2026-04-15', title: 'Spring', caption: 'Everything in bloom.' },
           { id: 5, photo: '/photos/memory-05.jpg', date: '2026-07-20', title: 'Summer Days', caption: 'Long days, warm nights.' },
           { id: 6, photo: '/photos/memory-06.jpg', date: '2026-09-10', title: 'Almost There', caption: 'Counting down to us.' },
         ],
         loveLetter: {
           text: `My dearest Krishangi,

One year. It sounds so simple when you say it — just two small words. But inside those words lives an entire universe of moments that changed me.

I remember the way ordinary things became extraordinary with you. How a quiet evening could feel like the most important night in the world. How your laugh could turn a difficult day into something I was grateful for.

You taught me that love isn't always the grand gestures. It's the small ones — the ones no one else sees. The way you remember the little things. The way you make space for me to be exactly who I am.

This year gave me something I didn't know I was missing. It gave me you.

And I want you to know — every single moment was worth it. Every one.

Here's to everything that's still waiting for us.

With all my love, always.`,
         },
         finale: {
           line1: 'One year behind us.',
           line2: 'And so much life still waiting for us.',
           closing: 'Happy First Anniversary.',
         },
         audio: { src: '/audio/ambient.mp3' },
       };
       ```

    AVOID: Hardcoding content anywhere except this config file.
    AVOID: Using `rgb()` or `hsl()` for brand colours — hex only for consistency with Three.js.
  </action>
  <verify>
    TypeScript compiles without errors: `npx astro check` or `npx tsc --noEmit`.
    Importing `siteConfig` and `colors` in a test component works.
    Page background is oxblood, text is porcelain white, headings use Cormorant Garamond.
  </verify>
  <done>
    Colour system defined in CSS vars + TS constants + Tailwind config. Typography loads correctly. Content config is typed and importable. Visual identity matches SPEC.
  </done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `npm run dev` starts Astro on localhost:4321 without errors
- [ ] Page background is #42151D (oxblood), text is #FFFCF8 (porcelain)
- [ ] Headings render in Cormorant Garamond, body text in Inter
- [ ] `siteConfig` exports with partner name "Krishangi" and 6 memory entries
- [ ] Tailwind `brand-burgundy`, `brand-ivory`, etc. classes work
- [ ] No three.js import errors at build time (three.js only inside React islands)
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Foundation ready for Plan 1.2 (3D canvas + scroll camera)
</success_criteria>
