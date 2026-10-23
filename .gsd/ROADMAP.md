# ROADMAP.md

> **Current Phase**: Not started  
> **Milestone**: v1.0 — Complete Anniversary Experience

## Must-Haves (from SPEC)

- [ ] Continuous scroll-driven 3D camera path through four cinematic scenes
- [ ] Strict burgundy/ivory/charcoal colour palette — no violations
- [ ] Sculptural rose with PBR materials and subtle animation
- [ ] Memory gallery with 6+ configurable framed photographs
- [ ] Love letter reveal with physical animation
- [ ] Cinematic finale with glass vessel, rose, and typography
- [ ] Editorial typography (Cormorant Garamond + Inter)
- [ ] Ambient audio with mute control
- [ ] Config-driven personal content
- [ ] Smooth mobile experience (≥30fps)
- [ ] Vercel deployment

---

## Phases

### Phase 1: Foundation & Environment Shell
**Status**: ⬜ Not Started  
**Objective**: Scaffold the Astro + R3F project, establish the colour system, typography, scroll-driven camera infrastructure, and a basic architectural environment shell that proves the art direction works.

**Deliverables**:
- Astro project with React islands, R3F, Drei, Tailwind
- CSS custom properties for the full colour palette
- Cormorant Garamond + Inter loaded and styled
- Full-screen `<Canvas>` with scroll-driven camera path (4 scene waypoints)
- Basic architectural environment: ivory floor/walls, burgundy depth, directional lighting
- Placeholder scene markers at each camera stop
- Dev server running, hot reload functional

**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04

---

### Phase 2: Scene 1 — The Opening Rose
**Status**: ⬜ Not Started  
**Objective**: Build the cinematic opening — sculptural rose, dramatic lighting, opening typography sequence, and "Enter" interaction that begins the scroll journey.

**Deliverables**:
- Sculptural deep-red rose model (procedural geometry or optimized GLTF)
- PBR materials: realistic petal surfaces with subsurface-scattering-like effect
- Narrow warm ivory spotlight with controlled shadows
- Subtle petal movement animation (wind/breathing)
- Near-black burgundy environment (oxblood fog/background)
- Typography sequence: "ONE YEAR." → pause → tagline → "Enter"
- Enter interaction initiates scroll-based journey
- Cinematic post-processing: subtle bloom, vignette

**Requirements**: REQ-05, REQ-11, REQ-14

---

### Phase 3: Scene 2 — Memory Gallery
**Status**: ⬜ Not Started  
**Objective**: Build the architectural photo gallery — framed photographs as physical 3D objects in an ivory/burgundy gallery space, with camera-approach interaction and editorial captions.

**Deliverables**:
- Gallery room geometry: ivory walls, burgundy alcove recesses, translucent panels
- 6+ photograph frames as 3D objects (ivory/burgundy frame mesh + photo texture)
- Config-driven: photos, dates, titles, captions loaded from content config
- Scroll brings camera through gallery; photos pass by naturally
- Interaction: clicking/tapping a photo moves camera closer, dims environment, shows editorial caption overlay
- Placeholder images with proper aspect ratios
- Responsive layout adaptation for mobile

**Requirements**: REQ-06, REQ-10, REQ-12, REQ-13

---

### Phase 4: Scenes 3 & 4 — Love Letter + Finale
**Status**: ⬜ Not Started  
**Objective**: Build the love letter reveal and the cinematic finale — the emotional climax and resolution of the experience.

**Deliverables**:
- **Love Letter Scene**: Ivory letter/envelope on burgundy pedestal or inside keepsake box. Box opens with physical animation. Letter content in elegant typography. Mobile-readable. Placeholder text from config.
- **Finale Scene**: Ivory architectural space opening to burgundy horizon. Single rose in minimal transparent glass vessel. Light-through-glass shader. Slow camera pull-back. Typography: "One year behind us." → "And so much life still waiting for us." → "Happy First Anniversary." → "Krishangi". End with stillness.
- Glass material with refraction/transparency
- Ambient audio integration with mute toggle
- Scene transitions feel cohesive within the continuous environment

**Requirements**: REQ-07, REQ-08, REQ-09, REQ-11

---

### Phase 5: Polish, Mobile, & Deployment
**Status**: ⬜ Not Started  
**Objective**: Performance optimization, mobile experience refinement, final art-direction audit, and production deployment.

**Deliverables**:
- Performance profiling and optimization (geometry LOD, texture compression, lazy loading)
- Mobile touch-scroll tuning, responsive typography, viewport adaptation
- Loading experience (simple, on-brand — not a generic spinner)
- Full art-direction audit: every element checked against SPEC colour/animation/typography rules
- Remove anything that feels generic, childish, or inconsistent
- Cross-browser testing (Chrome, Safari, Firefox, Edge)
- Vercel deployment with production build
- Final config documentation for content editing

**Requirements**: REQ-12, REQ-13, REQ-15
