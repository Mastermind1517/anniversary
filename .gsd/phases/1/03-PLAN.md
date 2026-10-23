---
phase: 1
plan: 3
wave: 2
depends_on: ["1.1"]
files_modified:
  - src/components/ui/Typography.tsx
  - src/components/ui/AudioToggle.tsx
  - src/components/ui/Overlay.tsx
  - src/components/ui/LoadingScreen.tsx
  - src/styles/global.css
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Typography components render Cormorant Garamond headings and Inter body text"
    - "HTML overlay layer sits above the 3D canvas with pointer-events passthrough"
    - "Audio toggle component exists with mute/unmute functionality"
    - "Loading screen displays on-brand while 3D assets load"
    - "UI elements are nearly invisible until needed — no large buttons"
  artifacts:
    - "src/components/ui/Typography.tsx — reusable text components"
    - "src/components/ui/AudioToggle.tsx — ambient audio control"
    - "src/components/ui/Overlay.tsx — HTML layer above canvas"
    - "src/components/ui/LoadingScreen.tsx — branded loading state"
---

# Plan 1.3: UI Layer — Typography Components, Audio Toggle & Loading Screen

<objective>
Build the HTML overlay layer that sits above the 3D canvas, create reusable typography components matching the editorial art direction, implement the ambient audio toggle, and design a minimal on-brand loading screen.

Purpose: The 2D UI layer is where all readable text, navigation, and controls live. Getting this right ensures every text element across all scenes is consistent and elegant.
Output: A complete UI toolkit ready to be composed into scene-specific overlays in Phases 2-4.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (typography, interface, animation principles)
- src/config/colors.ts
- src/config/content.ts
- src/styles/global.css
</context>

<tasks>

<task type="auto">
  <name>Create typography components and overlay system</name>
  <files>
    src/components/ui/Typography.tsx
    src/components/ui/Overlay.tsx
    src/styles/global.css
  </files>
  <action>
    1. Create src/components/ui/Typography.tsx with these components:
       - `<Heading>`: Cormorant Garamond, weight 300, letter-spacing 0.06em, porcelain white
         - Variants: `hero` (clamp 3rem-6rem), `section` (clamp 1.5rem-3rem), `caption` (clamp 1rem-1.5rem)
         - All use `text-transform: none` (no all-caps unless specified)
       - `<Body>`: Inter, weight 300, letter-spacing 0.02em, 1.6 line-height
         - Variants: `standard`, `small`, `caption`
       - `<EditorialQuote>`: Cormorant Garamond italic, weight 300, larger size, generous margins
       - All components accept className prop for composition
       - All use CSS transitions for opacity (duration 1.2s, ease cubic-bezier(0.16, 1, 0.3, 1))

    2. Create src/components/ui/Overlay.tsx:
       - Fixed position div covering full viewport
       - `pointer-events: none` by default (clicks pass through to 3D canvas)
       - Children can opt-in to pointer-events with a class
       - Flex layout for positioning content (top, center, bottom)
       - Z-index above canvas (z-10)
       - Accepts `scene` prop to show/hide content based on current scroll position

    3. Add to src/styles/global.css:
       - CSS animation keyframes:
         - `fadeIn`: opacity 0 → 1, duration 1.5s
         - `fadeUp`: opacity 0 → 1 + translateY 20px → 0, duration 1.2s
         - `slowReveal`: opacity 0 → 1, duration 3s
       - CSS utility classes:
         - `.text-editorial`: letter-spacing, line-height for editorial feel
         - `.clickable`: `pointer-events: auto; cursor: pointer;`
       - Media queries for mobile typography scaling

    AVOID: Large pill-shaped buttons — use small text links with subtle hover transitions.
    AVOID: Bold font weights for headings — weight 300 (light) is the luxury standard.
    AVOID: Fast transitions — minimum 0.8s for any opacity change, 1.2s+ preferred.
  </action>
  <verify>
    Typography components render with correct fonts, weights, and spacing.
    Overlay sits above canvas without blocking 3D interaction.
    Fade animations play smoothly at 1.2s+ duration.
  </verify>
  <done>
    Reusable typography system with Heading, Body, EditorialQuote components. Overlay system with pointer-events passthrough. CSS animations for fade transitions.
  </done>
</task>

<task type="auto">
  <name>Build audio toggle and loading screen</name>
  <files>
    src/components/ui/AudioToggle.tsx
    src/components/ui/LoadingScreen.tsx
  </files>
  <action>
    1. Create src/components/ui/AudioToggle.tsx:
       - Small, minimal toggle in bottom-right corner
       - Icon-only: a thin line icon (speaker/muted), not a big button
       - Uses Howler.js or Web Audio API to play/pause ambient audio
       - Starts muted (browser autoplay policy) — shows subtle pulse to indicate audio available
       - On first click: unmutes and plays ambient track
       - Styling: porcelain white icon, opacity 0.4 normally, 0.8 on hover
       - Size: 24px icon, 44px tap target (accessibility)
       - Transition: opacity 0.6s ease
       - State persisted in component (no global store needed)
       - Gracefully handles missing audio file (no errors if /audio/ambient.mp3 doesn't exist yet)

    2. Create src/components/ui/LoadingScreen.tsx:
       - Full-screen overlay matching oxblood background (#42151D)
       - Center: "ONE YEAR." in Cormorant Garamond, weight 300, porcelain white
       - Below: thin horizontal line (2px, ivory, width 60px) with a subtle width animation (60px → 120px → 60px, 3s loop)
       - Fades out over 1.5s when loading completes (opacity + pointer-events: none)
       - Accepts `isLoaded` boolean prop
       - No spinner, no percentage, no progress bar — just the title and a breathing line

    AVOID: Using `<audio>` elements — use Howler.js for cross-browser reliability.
    AVOID: Visible play/pause text labels — icon only.
    AVOID: Generic loading spinners or progress bars — the loading screen IS the first impression.
  </action>
  <verify>
    Audio toggle renders in bottom-right, starts muted, toggles on click.
    Loading screen shows "ONE YEAR." with breathing line animation.
    Loading screen fades out when isLoaded=true.
    No console errors when audio file is missing.
  </verify>
  <done>
    Audio toggle works with mute/unmute. Loading screen matches art direction with elegant minimal animation. Both components ready for integration.
  </done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Typography components render Cormorant Garamond (300 weight) for headings
- [ ] Body text renders in Inter (300 weight)
- [ ] Overlay layer sits above canvas, passes clicks through to 3D
- [ ] Audio toggle is small, minimal, functional (bottom-right corner)
- [ ] Loading screen shows "ONE YEAR." with breathing line animation
- [ ] Loading screen fades out smoothly over 1.5s
- [ ] All transitions are ≥0.8s duration — no fast/bouncy motion
- [ ] Mobile typography scales gracefully with clamp()
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed  
- [ ] UI toolkit ready for scene-specific content in Phases 2-4
</success_criteria>
