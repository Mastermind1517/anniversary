import { useRef } from 'react';
import * as THREE from 'three';
import { threeColors } from '../config/colors';

/**
 * Cinematic lighting setup for the architectural gallery:
 * Warm ivory directional light creating deliberate shadows, deep burgundy
 * ambient fill, and focused spotlights for each sculptural centerpiece.
 */
export function Lighting() {
  const roseTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const letterTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const finaleTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  return (
    <>
      {/* Light targets */}
      <primitive object={roseTargetRef.current} position={[0, 1.35, 0]} />
      <primitive object={letterTargetRef.current} position={[0, 1.15, -35]} />
      <primitive object={finaleTargetRef.current} position={[0, 1.25, -55]} />

      {/* Main directional light — warm ivory, dramatic architectural angle */}
      <directionalLight
        color={threeColors.ivory}
        intensity={1.15}
        position={[6, 14, 6]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={85}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
      />

      {/* Ambient fill — subtle burgundy, prevents total blackness in deep recesses */}
      <ambientLight color={threeColors.burgundy} intensity={0.16} />

      {/* Scene 1: Narrow warm ivory beam illuminating the opening rose */}
      <spotLight
        color={threeColors.ivory}
        intensity={3.2}
        position={[1.2, 8.5, 3.2]}
        angle={0.3}
        penumbra={0.8}
        distance={24}
        castShadow
        target={roseTargetRef.current}
      />

      {/* Scene 2: Gallery architectural illumination for framed memories */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.65}
        position={[0, 4.8, -15]}
        distance={22}
      />
      <pointLight
        color={threeColors.ivory}
        intensity={0.55}
        position={[0, 4.8, -22]}
        distance={22}
      />

      {/* Scene 3: Focused spotlight on keepsake love letter pedestal */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.4}
        position={[0, 7.5, -32.5]}
        angle={0.32}
        penumbra={0.75}
        distance={20}
        castShadow
        target={letterTargetRef.current}
      />

      {/* Scene 4: Finale — luminous light refracting through the transparent glass vessel */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.85}
        position={[0, 5, -53]}
        distance={26}
      />
      <spotLight
        color={threeColors.ivory}
        intensity={2.4}
        position={[-1.8, 6.5, -51.5]}
        angle={0.36}
        penumbra={0.8}
        distance={22}
        target={finaleTargetRef.current}
      />
    </>
  );
}
