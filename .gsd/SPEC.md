# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

A bespoke, award-quality 3D anniversary experience for Krishangi — built with the visual language of mature, sincere, timeless love. The user scrolls through a single continuous architectural environment rendered in real-time with React Three Fiber, moving through four cinematic scenes: an opening sculptural rose, a memory gallery of real photographs, a love letter reveal, and a quiet, powerful finale. Every surface, light, and animation is designed with the restraint and intentionality of a luxury creative studio producing for one real couple. The experience must feel expensive because of its composition, lighting, materials, typography, pacing, and restraint — not because it contains more effects.

## Goals

1. **Cinematic 3D walkthrough** — A continuous scroll-driven camera path through an architectural gallery environment, rendered in real-time with R3F/Three.js.
2. **Emotionally resonant storytelling** — Four distinct scenes (Opening → Memory Gallery → Love Letter → Finale) that build emotional weight through pacing and restraint.
3. **Mature luxury art direction** — A strict burgundy/ivory/charcoal palette, sculptural 3D forms, editorial serif typography, dramatic-but-soft lighting, and generous negative space.
4. **Personal content system** — Editable config-driven content (photographs, captions, dates, letter text, names) that can be swapped without touching code.
5. **Production quality across devices** — Fully functional 3D experience on desktop and mobile, with graceful adaptation for smaller screens.
6. **Ambient audio** — Soft background music with tasteful mute/unmute control.

## Non-Goals (Out of Scope)

- Cute, playful, or Valentine's-themed aesthetics
- Gaming environments, fantasy worlds, or cosmic/space themes
- Floating hearts, stars, butterflies, sparkles, particle showers, fireworks
- Bouncy/elastic animations, flashy transitions, fast camera spins
- Neon red, hot pink, purple gradients, rainbow effects, oversaturated colours
- Animated typing effects, ornamental borders, decorative cursive fonts
- User accounts, authentication (beyond optional simple access code)
- CMS or database — content is config-file-driven
- Video playback or complex media embedding
- E-commerce or any transactional features

## Users

**Primary user**: Krishangi — the sole intended viewer. She will receive a link, open it (likely on mobile first), and experience a deeply personal, intimate anniversary gift.

**Secondary user**: The developer/creator (Dilip) — who needs to easily update photos, captions, and the love letter text via a config file.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Astro | Static-first performance, minimal JS shipped |
| 3D Rendering | React Three Fiber + Three.js | Real-time 3D, declarative React API |
| 3D Helpers | @react-three/drei, @react-three/postprocessing | Camera controls, materials, effects |
| Scroll Animation | @react-three/drei ScrollControls or GSAP ScrollTrigger | Scroll-driven camera path |
| Typography | Cormorant Garamond (serif) + Inter (sans-serif) | Luxury editorial feel |
| Audio | Howler.js or native Web Audio | Ambient music with mute control |
| Styling | Tailwind CSS or vanilla CSS | Utility-first, no runtime overhead |
| Deployment | Vercel | Free tier, fast global CDN |

## Colour System

| Role | Hex | Usage |
|------|-----|-------|
| Deep burgundy | `#651E2B` | Primary environment colour, backgrounds |
| Rich oxblood | `#42151D` | Deep shadows, alcoves, darkest surfaces |
| Restrained crimson | `#8F2635` | Deliberate focal accents only |
| Warm ivory | `#F5F0E7` | Architectural surfaces, breathing room |
| Porcelain white | `#FFFCF8` | Typography, highlights, light sources |
| Charcoal | `#211D1D` | Body text, deep shadows |
| Antique silver | `#B8B0A8` | Occasional fine details, subtle accents |

## Scene Architecture

### Scene 1: Opening — "One Year"
- Near-black burgundy environment
- Single sculptural deep-red rose illuminated by narrow warm ivory beam
- Subtle petal movement, realistic PBR materials
- Typography: "ONE YEAR." → pause → "An entire world, in a thousand little moments." → "Enter"
- Refined serif, generous spacing, slow fade transitions

### Scene 2: Memory Gallery
- Architectural gallery rooms with ivory walls, burgundy alcoves
- 6+ photographs displayed as physical framed objects
- Minimal ivory/burgundy frames, believable shadows and depth
- On selection: camera approaches, environment quiets, shows date + title + caption
- Editorial layout for photo details

### Scene 3: Love Letter
- Ivory letter on dark-burgundy stone pedestal or inside sculptural keepsake box
- Box opens slowly with physical animation
- Letter reveals with elegant typography (printed letter / refined correspondence)
- Quiet background, mobile-readable sizing
- Placeholder text, editable via config

### Scene 4: Finale
- Ivory architectural space opening toward dark burgundy horizon
- Single deep-red rose in minimal transparent glass vessel
- Soft ivory light through glass
- Slow camera pull-back revealing full composition
- Typography sequence: "One year behind us." → "And so much life still waiting for us." → "Happy First Anniversary." → "Krishangi"
- End with stillness and silence

## Animation Principles

**Do:**
- Slow cinematic camera dolly movements
- Natural object rotation
- Delicate petal/fabric movement
- Gradual lighting changes
- Smooth opacity transitions
- Physical object interactions

**Do not:**
- Bouncy or elastic animations
- Constant floating objects
- Fast camera spins
- Excessive parallax
- Flashy transitions
- Motion without narrative purpose

## Content Configuration

All personal content lives in a single config file (`src/config/content.ts` or similar):

```typescript
export const siteConfig = {
  partner: { name: "Krishangi" },
  memories: [
    { id: 1, photo: "/photos/memory-01.jpg", date: "2025-10-24", title: "...", caption: "..." },
    // 6+ entries
  ],
  loveLetter: { text: "..." },
  audio: { src: "/audio/ambient.mp3" },
}
```

## Constraints

- **Performance**: Must run smoothly on mid-range mobile devices (target 30fps minimum)
- **Bundle size**: Astro islands ensure only 3D code hydrates; static content stays static
- **Accessibility**: Semantic HTML outside 3D canvas, proper contrast for readable text
- **Timeline**: No rush — quality and perfection are the priority
- **Browser support**: Modern browsers (Chrome, Safari, Firefox, Edge — latest 2 versions)

## Success Criteria

- [ ] Continuous scroll-driven 3D camera path through four distinct scenes
- [ ] Strict colour palette with no violations (no neon, pink, purple, rainbow)
- [ ] Sculptural rose opening with PBR materials and subtle animation
- [ ] Memory gallery with 6+ configurable photo entries displayed as physical objects
- [ ] Love letter reveal with physical box/pedestal animation
- [ ] Cinematic finale with glass vessel, rose, and typography sequence
- [ ] Cormorant Garamond + Inter typography throughout
- [ ] Ambient audio with mute/unmute control
- [ ] All personal content editable via config file without code changes
- [ ] Smooth experience on mobile (≥30fps on mid-range devices)
- [ ] Deployed to Vercel
- [ ] Every element serves the emotional narrative — nothing decorative without purpose
