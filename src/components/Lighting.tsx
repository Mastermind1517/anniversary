import { useRef } from 'react';
import * as THREE from 'three';
import { threeColors } from '../config/colors';

/**
 * Cinematic lighting setup for the architectural gallery.
 * Dramatic but soft — inspired by museum/gallery lighting.
 */
export function Lighting() {
  const roseTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const letterTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const finaleTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  return (
    <>
      {/* Light targets */}
      <primitive object={roseTargetRef.current} position={[0, 1.2, 0]} />
      <primitive object={letterTargetRef.current} position={[0, 1.1, -35]} />
      <primitive object={finaleTargetRef.current} position={[0, 1.2, -55]} />

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
      <ambientLight color={threeColors.burgundy} intensity={0.14} />

      {/* Scene 1: Narrow warm ivory spot on the sculptural rose */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.8}
        position={[1, 7.5, 3]}
        angle={0.28}
        penumbra={0.75}
        distance={22}
        castShadow
        target={roseTargetRef.current}
      />

      {/* Scene 2: Gallery soft architectural illumination */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.7}
        position={[0, 4.8, -16]}
        distance={24}
      />
      <pointLight
        color={threeColors.ivory}
        intensity={0.5}
        position={[0, 4.8, -22]}
        distance={24}
      />

      {/* Scene 3: Letter pedestal spot */}
      <spotLight
        color={threeColors.ivory}
        intensity={2.0}
        position={[0, 7, -33]}
        angle={0.32}
        penumbra={0.7}
        distance={18}
        castShadow
        target={letterTargetRef.current}
      />

      {/* Scene 4: Finale — soft luminous light through glass vessel */}
      <pointLight
        color={threeColors.porcelain}
        intensity={0.9}
        position={[0, 5, -53]}
        distance={28}
      />
      <spotLight
        color={threeColors.ivory}
        intensity={2.2}
        position={[-2, 6, -52]}
        angle={0.35}
        penumbra={0.8}
        distance={20}
        target={finaleTargetRef.current}
      />
    </>
  );
}
