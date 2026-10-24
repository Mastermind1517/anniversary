import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ArchitecturalEnvironment } from './Environment';
import { Lighting } from './Lighting';
import { LoadingScreen } from './ui/LoadingScreen';

/**
 * Tracks Drei/R3F asset loading state without arbitrary timeouts.
 */
function SceneReadyTracker({ onReady }: { onReady: () => void }) {
  const { active, progress } = useProgress();

  useEffect(() => {
    if (!active && progress >= 100) {
      onReady();
    }
  }, [active, progress, onReady]);

  return null;
}

export default function Experience() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleSceneReady = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 1.85, 7.2] }}
        dpr={[1, 2]}
        gl={{
          antialias: false, // Multisampling in EffectComposer handles anti-aliasing without duplicate buffer cost
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
        onCreated={({ gl }) => {
          // Pre-compile renderer shaders and trigger ready state
          gl.compile(new THREE.Scene(), new THREE.Camera());
          requestAnimationFrame(() => {
            setIsLoaded(true);
          });
        }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={['#3D1219']} />
        <fog attach="fog" args={['#381017', 22, 68]} />

        <Suspense fallback={null}>
          <SceneReadyTracker onReady={handleSceneReady} />
          <ScrollControls pages={4.5} damping={0.18}>
            <CameraRig />
            <Lighting />
            <ArchitecturalEnvironment />

            {/* Restrained cinematic post-processing */}
            <EffectComposer multisampling={4}>
              <Bloom
                luminanceThreshold={0.85}
                luminanceSmoothing={0.88}
                intensity={0.14}
              />
              <Vignette
                eskil={false}
                offset={0.34}
                darkness={0.58}
              />
            </EffectComposer>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}
