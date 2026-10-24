# ROADMAP.md

> **Current Phase**: Phase 5 — Polish, Mobile, & Deployment  
> **Milestone**: v1.0 — Complete Anniversary Experience

## Must-Haves (from SPEC)

- [x] Continuous scroll-driven 3D camera path through four cinematic scenes
- [x] Strict burgundy/ivory/charcoal colour palette — no violations
- [x] Sculptural rose with PBR materials and subtle animation
- [x] Memory gallery with 6+ configurable framed photographs
- [x] Love letter reveal with physical animation
- [x] Cinematic finale with glass vessel, rose, and typography
- [x] Editorial typography (Cormorant Garamond + Inter)
- [x] Ambient audio with mute control
- [x] Config-driven personal content
- [x] Smooth mobile experience
- [ ] Vercel deployment

---

## Phases

### Phase 1: Foundation & Environment Shell
**Status**: ✅ Complete  
**Objective**: Scaffold the Astro + R3F project, establish the colour system, typography, scroll-driven camera infrastructure, and a basic architectural environment shell that proves the art direction works.

**Deliverables**:
- Astro project with React islands, R3F, Drei, Tailwind v4
- CSS custom properties for the full colour palette
- Cormorant Garamond + Inter loaded and styled
- Full-screen `<Canvas>` with scroll-driven camera path (4 scene waypoints)
- Basic architectural environment: ivory floor/walls, burgundy depth, directional lighting
- Post-processing with subtle bloom and vignette
- Dev server running, hot reload functional

**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04

---

### Phase 2: Scene 1 — The Opening Rose
**Status**: ✅ Complete  
**Objective**: Build the cinematic opening — sculptural rose, dramatic lighting, opening typography sequence, and "Enter" interaction that begins the scroll journey.

**Deliverables**:
- Sculptural deep-red rose model with layered petals
- Realistic PBR materials with subtle emissive subsurface glow
- Narrow warm ivory spotlight focused precisely on the bloom
- Subtle petal breathing and gentle rotation animation
- Near-black burgundy environment (oxblood fog/background)
- Typography sequence: "ONE YEAR." → pause → tagline → "Enter"
- Enter interaction smoothly initiates scroll-based camera journey

**Requirements**: REQ-05, REQ-11, REQ-14

---

### Phase 3: Scene 2 — Memory Gallery
**Status**: ✅ Complete  
**Objective**: Build the architectural photo gallery — framed photographs as physical 3D objects in an ivory/burgundy gallery space, with camera-approach interaction and editorial captions.

**Deliverables**:
- Architectural gallery walls with oxblood alcoves and soft lighting
- 6 framed photographs as physical 3D objects with passe-partout and protective glass
- Config-driven from `src/config/content.ts`
- Interactive click/tap opens intimate editorial modal with date, title, and caption
- Dynamic high-art canvas texture generator for elegant archival placeholders until personal photos are added

**Requirements**: REQ-06, REQ-10, REQ-12, REQ-13

---

### Phase 4: Scenes 3 & 4 — Love Letter + Finale
**Status**: ✅ Complete  
**Objective**: Build the love letter reveal and the cinematic finale — the emotional climax and resolution of the experience.

**Deliverables**:
- **Love Letter Scene**: Sculptural keepsake box on dark oxblood pedestal with physical hinge opening animation, folded ivory letter with silver ribbon and crimson seal. Reading modal formatted as fine printed stationery.
- **Finale Scene**: Opening architectural portal facing a dark burgundy horizon. Minimal transparent glass vessel with single rose. Soft light passing through glass.
- Finale typography: "One year behind us." → "And so much life still waiting for us." → "Happy First Anniversary." → "Krishangi".
- Ambient audio toggle with mute/unmute and Howler/WebAudio integration.

**Requirements**: REQ-07, REQ-08, REQ-09, REQ-11

---

### Phase 5: Polish, Mobile, & Deployment
**Status**: 🔄 In Progress  
**Objective**: Performance optimization, mobile experience refinement, final art-direction audit, and production deployment.

**Deliverables**:
- Performance profiling and build optimization
- Mobile touch-scroll tuning and responsive typography
- Full art-direction audit against SPEC colour, animation, and typography rules
- Vercel deployment preparation
- Instructions for developer to add real photographs and final audio
