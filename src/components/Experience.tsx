import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ArchitecturalEnvironment } from './Environment';
import { Lighting } from './Lighting';
import { LoadingScreen } from './ui/LoadingScreen';

export default function Experience() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 2, 8] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        shadows
        onCreated={() => {
          // Short delay so loading screen has time to display
          setTimeout(() => setIsLoaded(true), 500);
        }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={['#42151D']} />
        <fog attach="fog" args={['#42151D', 20, 65]} />

        <Suspense fallback={null}>
          <ScrollControls pages={5} damping={0.3}>
            <CameraRig />
            <Lighting />
            <ArchitecturalEnvironment />

            {/* Post-processing */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                intensity={0.2}
              />
              <Vignette
                eskil={false}
                offset={0.3}
                darkness={0.65}
              />
            </EffectComposer>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}
