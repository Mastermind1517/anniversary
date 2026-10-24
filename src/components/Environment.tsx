import React from 'react';
import * as THREE from 'three';
import { colors } from '../config/colors';
import { SculpturalRose } from './scenes/OpeningRose';
import { MemoryGallery } from './scenes/MemoryGallery';
import { LoveLetterScene } from './scenes/LoveLetter';
import { FinaleScene } from './scenes/FinaleScene';

/**
 * Architectural gallery environment:
 * Refined ivory stone floor with subtle reflection, tall gallery walls with
 * deep oxblood architectural alcoves, and framed transitional portals.
 */
export function ArchitecturalEnvironment() {
  return (
    <group>
      {/* 1. Main Gallery Floor — warm ivory stone plinth with refined surface response */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -30]}
        receiveShadow
      >
        <planeGeometry args={[26, 130]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.75}
          metalness={0.04}
        />
      </mesh>

      {/* Subtle floor border inlay (antique silver / bronze trim) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.5, 0.005, -30]}>
        <planeGeometry args={[0.08, 130]} />
        <meshStandardMaterial color={colors.silver} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.005, -30]}>
        <planeGeometry args={[0.08, 130]} />
        <meshStandardMaterial color={colors.silver} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 2. Ceiling — dark charcoal, subtle containment */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6.8, -30]}
      >
        <planeGeometry args={[26, 130]} />
        <meshStandardMaterial
          color={colors.charcoal}
          roughness={0.96}
          metalness={0.0}
        />
      </mesh>

      {/* 3. Left and Right Gallery Walls */}
      <GalleryWall position={[-7.8, 3.4, -30]} rotation={[0, Math.PI / 2, 0]} width={130} height={6.8} />
      <GalleryWall position={[7.8, 3.4, -30]} rotation={[0, -Math.PI / 2, 0]} width={130} height={6.8} />

      {/* 4. Deep Burgundy / Oxblood Recesses at Each Scene Landmark */}
      {/* Scene 1 Alcoves */}
      <ArchitecturalAlcove position={[-7.65, 2.2, 0]} />
      <ArchitecturalAlcove position={[7.65, 2.2, 0]} mirror />

      {/* Scene 2 Alcoves */}
      <ArchitecturalAlcove position={[-7.65, 2.4, -14]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -16]} width={3.6} height={4.2} mirror />
      <ArchitecturalAlcove position={[-7.65, 2.4, -18.5]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -20.5]} width={3.6} height={4.2} mirror />
      <ArchitecturalAlcove position={[-7.65, 2.4, -23]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -25]} width={3.6} height={4.2} mirror />

      {/* Scene 3 Alcoves (Love Letter Chamber) */}
      <ArchitecturalAlcove position={[-7.65, 2.4, -35]} width={4.5} height={4.5} depth={1.0} />
      <ArchitecturalAlcove position={[7.65, 2.4, -35]} width={4.5} height={4.5} depth={1.0} mirror />

      {/* Scene 4 Alcoves (Finale) */}
      <ArchitecturalAlcove position={[-7.65, 2.5, -55]} width={4.2} height={4.8} />
      <ArchitecturalAlcove position={[7.65, 2.5, -55]} width={4.2} height={4.8} mirror />

      {/* 5. Architectural Portals (Framed Apertures Between Gallery Chambers) */}
      <GalleryPortal position={[0, 0, -6.5]} />
      <GalleryPortal position={[0, 0, -28.5]} />
      <GalleryPortal position={[0, 0, -43.5]} />

      {/* 6. The 4 Distinct Narrative Scenes */}
      {/* Scene 1: Sculptural Rose */}
      <SculpturalRose position={[0, 1.35, 0]} scale={1.85} />

      {/* Scene 2: Architectural Memory Gallery */}
      <MemoryGallery />

      {/* Scene 3: Keepsake Box & Love Letter */}
      <LoveLetterScene />

      {/* Scene 4: The Finale — Minimal Glass Vessel & Opening Horizon */}
      <FinaleScene />
    </group>
  );
}

/** Ivory gallery wall panel with fine surface response */
function GalleryWall({
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
        roughness={0.88}
        metalness={0.02}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Architectural alcove recess with oxblood depth and ivory border */
function ArchitecturalAlcove({
  position,
  width = 3.2,
  height = 3.8,
  depth = 0.75,
  mirror = false,
}: {
  position: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  mirror?: boolean;
}) {
  const rotY = mirror ? -Math.PI / 2 : Math.PI / 2;
  return (
    <group position={position}>
      {/* Recessed cavity */}
      <mesh rotation={[0, rotY, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={colors.oxblood}
          roughness={0.92}
          metalness={0.0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle outer architrave frame */}
      <mesh rotation={[0, rotY, 0]} position={[0, 0, 0.02]}>
        <planeGeometry args={[width + 0.15, height + 0.15]} />
        <meshStandardMaterial
          color="#EFE9DC"
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Architectural framed portal linking gallery rooms */
function GalleryPortal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-4.5, 3.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 6.8, 0.5]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} metalness={0.03} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[4.5, 3.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 6.8, 0.5]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} metalness={0.03} />
      </mesh>

      {/* Lintel header */}
      <mesh position={[0, 6.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.5, 0.5]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} metalness={0.03} />
      </mesh>

      {/* Slender antique silver inlay band across the lintel */}
      <mesh position={[0, 6.35, 0]}>
        <boxGeometry args={[9.5, 0.04, 0.52]} />
        <meshStandardMaterial color={colors.silver} roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}
