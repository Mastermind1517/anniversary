import React from 'react';
import Experience from './Experience';
import { AudioToggle } from './ui/AudioToggle';
import { siteConfig } from '../config/content';

/**
 * Root app component — mounted as a React island in Astro.
 * Wraps the 3D experience and persistent UI elements.
 */
export default function App() {
  return (
    <>
      <Experience />
      <AudioToggle src={siteConfig.audio.src} />
    </>
  );
}
