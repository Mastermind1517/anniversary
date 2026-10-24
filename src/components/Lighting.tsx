import * as THREE from 'three';
import { threeColors } from '../config/colors';

/**
 * Cinematic lighting setup for the architectural gallery.
 * Dramatic but soft — inspired by museum/gallery lighting.
 */
export function Lighting() {
  return (
    <>
      {/* Main directional light — warm ivory, dramatic angle */}
      <directionalLight
        color={threeColors.ivory}
        intensity={1.1}
        position={[5, 12, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />

      {/* Ambient fill — very dim burgundy, keeps shadows from going pure black */}
      <ambientLight color={threeColors.burgundy} intensity={0.12} />

      {/* Scene-specific spot lights for focal points */}
      {/* Scene 1: Narrow spot on rose position */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.0}
        position={[1, 8, 0]}
        angle={0.25}
        penumbra={0.8}
        distance={20}
        castShadow
        target-position={[0, 0, 0]}
      />

      {/* Scene 2: Gallery illumination */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.6}
        position={[0, 5, -15]}
        distance={25}
      />

      {/* Scene 3: Letter pedestal spot */}
      <spotLight
        color={threeColors.ivory}
        intensity={1.5}
        position={[0, 7, -35]}
        angle={0.3}
        penumbra={0.7}
        distance={18}
        castShadow
      />

      {/* Scene 4: Finale — soft wide light */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.8}
        position={[0, 6, -55]}
        distance={30}
      />
    </>
  );
}
