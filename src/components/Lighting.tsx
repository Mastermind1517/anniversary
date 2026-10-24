import { useRef } from 'react';
import * as THREE from 'three';
import { threeColors } from '../config/colors';

/**
 * Cinematic lighting setup for the architectural gallery:
 * Warm ivory directional light creating deliberate architectural shadows,
 * deep burgundy ambient fill preventing crushed darks, and focused
 * spotlights highlighting each sculptural centerpiece.
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
        intensity={1.1}
        position={[5, 14, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1.0}
        shadow-camera-far={70}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      {/* Ambient fill — subtle burgundy, ensures shadow recesses retain rich warmth */}
      <ambientLight color={threeColors.burgundy} intensity={0.22} />

      {/* Scene 1: Narrow warm ivory beam illuminating the opening rose */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.8}
        position={[1.2, 8.0, 3.0]}
        angle={0.32}
        penumbra={0.75}
        distance={22}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        target={roseTargetRef.current}
      />

      {/* Scene 2: Gallery corridor architectural illumination for framed memories */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.65}
        position={[0, 4.6, -15]}
        distance={20}
      />
      <pointLight
        color={threeColors.ivory}
        intensity={0.55}
        position={[0, 4.6, -22]}
        distance={20}
      />

      {/* Scene 3: Focused spotlight on keepsake love letter pedestal */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.2}
        position={[0, 7.2, -32.5]}
        angle={0.30}
        penumbra={0.75}
        distance={18}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        target={letterTargetRef.current}
      />

      {/* Scene 4: Finale — luminous light refracting through the transparent glass vessel */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.80}
        position={[0, 4.8, -53]}
        distance={24}
      />
      <spotLight
        color={threeColors.ivory}
        intensity={2.4}
        position={[-1.6, 6.2, -51.5]}
        angle={0.34}
        penumbra={0.8}
        distance={20}
        target={finaleTargetRef.current}
      />
    </>
  );
}
