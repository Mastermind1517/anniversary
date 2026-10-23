---
phase: 1
plan: 2
wave: 2
depends_on: ["1.1"]
files_modified:
  - src/components/Experience.tsx
  - src/components/Scene.tsx
  - src/components/Environment.tsx
  - src/components/CameraRig.tsx
  - src/components/Lighting.tsx
  - src/pages/index.astro
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Full-screen R3F Canvas renders inside an Astro React island"
    - "ScrollControls drives a continuous camera path through 4 scene waypoints"
    - "Camera smoothly interpolates position and lookAt between waypoints on scroll"
    - "Basic architectural environment is visible: ivory floor/walls, burgundy depth"
    - "Directional lighting creates dramatic but soft illumination"
    - "Post-processing applies subtle bloom and vignette"
  artifacts:
    - "src/components/Experience.tsx — main R3F canvas wrapper"
    - "src/components/CameraRig.tsx — scroll-driven camera with waypoints"
    - "src/components/Environment.tsx — architectural shell geometry"
    - "src/components/Lighting.tsx — scene lighting setup"
---

# Plan 1.2: 3D Canvas, Scroll Camera & Architectural Environment

<objective>
Create the full-screen React Three Fiber canvas as an Astro React island, implement scroll-driven camera movement through 4 scene waypoints, build the basic architectural gallery environment (ivory floors/walls, burgundy recesses), and set up cinematic lighting with subtle post-processing.

Purpose: This establishes the spatial container and navigation mechanism for the entire experience. Every scene in Phases 2-4 will be placed within this environment.
Output: A scrollable 3D walkthrough through an empty but beautifully lit architectural space with 4 distinct rooms/areas.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (scene architecture, animation principles, visual philosophy)
- src/config/colors.ts
- src/config/content.ts
- src/pages/index.astro
</context>

<tasks>

<task type="auto">
  <name>Create R3F Canvas wrapper and scroll-driven camera system</name>
  <files>
    src/components/Experience.tsx
    src/components/CameraRig.tsx
    src/components/Scene.tsx
    src/pages/index.astro
  </files>
  <action>
    1. Create src/components/Experience.tsx:
       - Full-screen `<Canvas>` with `camera={{ fov: 45, near: 0.1, far: 200 }}`
       - Set `gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}`
       - Background colour: oxblood (#42151D) via `scene.background`
       - Wrap children in `<ScrollControls pages={5} damping={0.25}>` from @react-three/drei
       - Include `<Suspense>` fallback for loading
       - Export as default with `client:only="react"` compatibility

    2. Create src/components/CameraRig.tsx:
       - Use `useScroll()` from drei to get scroll offset (0-1)
       - Define 4 camera waypoints as position + lookAt target vectors:
         ```
         Scene 1 (Opening):  pos [0, 2, 8]    → lookAt [0, 1.5, 0]
         Scene 2 (Gallery):  pos [0, 2, -10]   → lookAt [0, 2, -15]
         Scene 3 (Letter):   pos [0, 2, -30]   → lookAt [0, 1.5, -35]
         Scene 4 (Finale):   pos [0, 2, -50]   → lookAt [0, 2, -55]
         ```
       - Use `useFrame()` to interpolate camera position and lookAt using THREE.Vector3.lerp based on scroll offset
       - Map scroll ranges to scene transitions:
         - 0.0 – 0.2: Scene 1 (Opening)
         - 0.2 – 0.5: Scene 2 (Gallery)  
         - 0.5 – 0.7: Scene 3 (Letter)
         - 0.7 – 1.0: Scene 4 (Finale)
       - Use smooth easing (cubic or sine) for transitions between waypoints
       - Camera movement should feel like a slow cinematic dolly

    3. Create src/components/Scene.tsx:
       - Container component that positions children at a specific z-depth
       - Props: `position`, `children`
       - Each scene is placed along negative z-axis with ~20 units spacing

    4. Update src/pages/index.astro:
       - Import Experience component with `client:only="react"`
       - Render it full-screen (100vw × 100vh, position fixed)
       - Add minimal HTML overlay layer for future typography (position absolute, pointer-events none)

    AVOID: Using OrbitControls — camera is entirely scroll-driven.
    AVOID: Jerky camera interpolation — use damping/smoothing. Three.js Vector3.lerp with a small alpha (0.03-0.05) per frame gives cinematic feel.
    AVOID: Large scroll pages count that makes scrolling feel endless — 5 pages is sufficient for comfortable pacing.
  </action>
  <verify>
    Dev server runs. Full-screen canvas renders with oxblood background.
    Scrolling moves camera smoothly through z-axis. 
    Console shows no errors. No OrbitControls gizmo visible.
  </verify>
  <done>
    Full-screen R3F canvas renders. Scroll moves camera through 4 waypoints with smooth interpolation. Camera path feels cinematic and deliberate.
  </done>
</task>

<task type="auto">
  <name>Build architectural environment shell and cinematic lighting</name>
  <files>
    src/components/Environment.tsx
    src/components/Lighting.tsx
    src/components/Experience.tsx
  </files>
  <action>
    1. Create src/components/Lighting.tsx:
       - Main directional light: warm ivory (#F5F0E7), intensity 1.2, position [5, 10, 5], castShadow
       - Ambient light: very dim burgundy (#651E2B), intensity 0.15 — provides fill without washing out shadows
       - Spot light for scene-specific highlights: narrow angle, positioned per scene
       - Use `<Environment preset="warehouse" />` from drei at very low intensity (0.05) for subtle reflections, or skip if too bright
       - Enable shadows on renderer: `shadow-mapSize={[1024, 1024]}`

    2. Create src/components/Environment.tsx — the architectural shell:
       - **Floor**: Large plane geometry (200 × 200) at y=0
         - Material: MeshStandardMaterial, colour warm ivory (#F5F0E7), roughness 0.85, metalness 0.02
         - receiveShadow
       - **Walls**: Tall box geometries or planes positioned along the camera path
         - Left/right walls: ivory (#F5F0E7) with slight roughness variation
         - Burgundy alcove recesses at each scene position: deeper insets with oxblood (#42151D) material
         - Wall height: ~6 units, thickness: 0.3
       - **Ceiling**: Subtle overhead plane, dark charcoal (#211D1D), barely visible — adds containment
       - **Scene markers**: At each of the 4 scene positions (z = 0, -20, -40, -60), place a simple placeholder:
         - Scene 1: A small red sphere (placeholder for rose)
         - Scene 2: Rectangular frames on walls (placeholder for gallery)
         - Scene 3: A small box on a pedestal (placeholder for letter)
         - Scene 4: A glass-like sphere (placeholder for finale vessel)
       - Use fog: `<fog attach="fog" args={['#42151D', 15, 60]}` — oxblood fog for atmospheric depth

    3. Wire Environment and Lighting into Experience.tsx:
       - Add `<Lighting />` and `<Environment />` as children of ScrollControls
       - Ensure shadows work (floor receives, objects cast)

    4. Add post-processing to Experience.tsx:
       - Import from @react-three/postprocessing
       - `<EffectComposer>`:
         - `<Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.3} />` — very subtle
         - `<Vignette eskil={false} offset={0.3} darkness={0.7} />` — cinematic framing
       - Keep effects restrained — they should be felt, not seen

    AVOID: Bright environment maps that flood the scene with light — this should be dramatically lit, not evenly lit.
    AVOID: Pure white materials — even ivory surfaces should have slight warmth (roughness > 0.8).
    AVOID: Fog that's too dense and hides the environment — it should add depth, not obscure.
  </action>
  <verify>
    Scrolling reveals an architectural space: ivory floor, walls forming a corridor/gallery, burgundy recesses at scene positions.
    Lighting creates visible shadows on the floor. Fog adds depth perception.
    Post-processing bloom and vignette are subtle but present.
    Placeholder objects visible at each scene position.
  </verify>
  <done>
    Architectural environment renders with ivory surfaces, burgundy depth, dramatic lighting, atmospheric fog, and subtle post-processing. Scrolling through feels like moving through a real gallery space. Placeholder objects mark each scene location.
  </done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Full-screen R3F canvas renders with no errors
- [ ] Scroll moves camera smoothly through 4 waypoints along z-axis
- [ ] Architectural environment visible: ivory floor, walls, burgundy alcoves
- [ ] Dramatic directional lighting with visible shadows
- [ ] Oxblood fog adds atmospheric depth without obscuring
- [ ] Subtle bloom and vignette post-processing active
- [ ] Placeholder objects at each of the 4 scene positions
- [ ] No OrbitControls, no floating objects, no bouncy animations
- [ ] Runs at 60fps on desktop
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Environment ready to receive Scene content in Phases 2-4
</success_criteria>
