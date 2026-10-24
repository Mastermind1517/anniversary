import React from 'react';
import { AppProvider } from './AppState';
import Experience from './Experience';
import { SceneOverlayManager } from './ui/SceneOverlayManager';
import { AudioToggle } from './ui/AudioToggle';
import { siteConfig } from '../config/content';

/**
 * Root app component — mounted as a React island in Astro.
 * Wraps the 3D experience, overlays, and persistent audio control.
 */
export default function App() {
  return (
    <AppProvider>
      <Experience />
      <SceneOverlayManager />
      <AudioToggle src={siteConfig.audio.src} />
    </AppProvider>
  );
}
