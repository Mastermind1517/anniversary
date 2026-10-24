import React from 'react';
import * as THREE from 'three';
import { colors } from '../config/colors';
import { SculpturalRose } from './scenes/OpeningRose';
import { MemoryGallery } from './scenes/MemoryGallery';
import { LoveLetterScene } from './scenes/LoveLetter';
import { FinaleScene } from './scenes/FinaleScene';

/**
 * Architectural gallery environment — ivory walls, burgundy alcoves,
 * charcoal ceiling. A continuous corridor with distinct rooms at each
 * scene position.
 */
export function ArchitecturalEnvironment() {
  return (
    <group>
      {/* Floor — warm ivory stone */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -30]}
        receiveShadow
      >
        <planeGeometry args={[30, 120]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Ceiling — dark charcoal, barely visible */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6.5, -30]}
      >
        <planeGeometry args={[30, 120]} />
        <meshStandardMaterial
          color={colors.charcoal}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Left wall */}
      <Wall position={[-8, 3.25, -30]} rotation={[0, Math.PI / 2, 0]} width={120} height={6.5} />
      {/* Right wall */}
      <Wall position={[8, 3.25, -30]} rotation={[0, -Math.PI / 2, 0]} width={120} height={6.5} />

      {/* Burgundy alcove recesses at each scene position */}
      <Alcove position={[-7.8, 2, 0]} label="Scene 1" />
      <Alcove position={[7.8, 2, 0]} label="Scene 1" mirror />

      <Alcove position={[-7.8, 2, -15]} label="Scene 2" />
      <Alcove position={[7.8, 2, -15]} label="Scene 2" mirror />
      <Alcove position={[-7.8, 2, -20]} label="Scene 2" />
      <Alcove position={[7.8, 2, -20]} label="Scene 2" mirror />

      <Alcove position={[-7.8, 2, -35]} label="Scene 3" />
      <Alcove position={[7.8, 2, -35]} label="Scene 3" mirror />

      <Alcove position={[-7.8, 2, -55]} label="Scene 4" />
      <Alcove position={[7.8, 2, -55]} label="Scene 4" mirror />

      {/* Scene 1: Sculptural Rose */}
      <SculpturalRose position={[0, 1.2, 0]} scale={1.8} />

      {/* Scene 2: Architectural Memory Gallery */}
      <MemoryGallery />

      {/* Scene 3: Keepsake Box & Love Letter */}
      <LoveLetterScene />

      {/* Scene 4: The Finale — Minimal Glass Vessel & Opening Horizon */}
      <FinaleScene />

      {/* Translucent divider panels between scenes for architectural atmosphere */}
      <TranslucentPanel position={[0, 3, -7]} />
      <TranslucentPanel position={[0, 3, -27]} />
      <TranslucentPanel position={[0, 3, -47]} />
    </group>
  );
}

/** Ivory wall panel */
function Wall({
  position,
  rotation,
  width,
  height,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        color={colors.ivory}
        roughness={0.85}
        metalness={0.02}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Deep burgundy alcove recess in wall */
function Alcove({
  position,
  label,
  mirror,
}: {
  position: [number, number, number];
  label?: string;
  mirror?: boolean;
}) {
  const rotY = mirror ? -Math.PI / 2 : Math.PI / 2;
  return (
    <group position={position}>
      <mesh rotation={[0, rotY, 0]}>
        <boxGeometry args={[3, 3.5, 0.6]} />
        <meshStandardMaterial
          color={colors.oxblood}
          roughness={0.92}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/** Translucent architectural divider between scenes */
function TranslucentPanel({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[10, 5.5]} />
      <meshPhysicalMaterial
        color={colors.ivory}
        roughness={0.2}
        metalness={0}
        transmission={0.7}
        thickness={0.3}
        opacity={0.15}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
