import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ArchitecturalEnvironment } from './Environment';
import { Lighting } from './Lighting';
import { LoadingScreen } from './ui/LoadingScreen';

export default function Experience() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 1.85, 7.2] }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
        onCreated={() => {
          setTimeout(() => setIsLoaded(true), 400);
        }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={['#3D1219']} />
        <fog attach="fog" args={['#381017', 22, 68]} />

        <Suspense fallback={null}>
          <ScrollControls pages={4.5} damping={0.2}>
            <CameraRig />
            <Lighting />
            <ArchitecturalEnvironment />

            {/* Restrained cinematic post-processing */}
            <EffectComposer multisampling={4}>
              <Bloom
                luminanceThreshold={0.82}
                luminanceSmoothing={0.85}
                intensity={0.18}
              />
              <Vignette
                eskil={false}
                offset={0.32}
                darkness={0.62}
              />
            </EffectComposer>
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}
