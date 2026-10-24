import React from 'react';
import * as THREE from 'three';
import { colors } from '../config/colors';
import { SculpturalRose } from './scenes/OpeningRose';
import { MemoryGallery } from './scenes/MemoryGallery';
import { LoveLetterScene } from './scenes/LoveLetter';
import { FinaleScene } from './scenes/FinaleScene';

/**
 * Architectural gallery environment:
 * Refined ivory stone floor with grounded plinths, tall gallery walls with
 * stepped oxblood alcoves, beveled portals, and antique silver trim.
 */
export function ArchitecturalEnvironment() {
  return (
    <group>
      {/* 1. Main Gallery Floor — warm ivory stone with subtle micro-roughness */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -30]}
        receiveShadow
      >
        <planeGeometry args={[26, 130]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>

      {/* Grounding Baseboard Plinth Skirting along the foot of both walls */}
      <mesh position={[-7.75, 0.08, -30]} receiveShadow castShadow>
        <boxGeometry args={[0.16, 0.16, 130]} />
        <meshStandardMaterial color={colors.oxblood} roughness={0.88} />
      </mesh>
      <mesh position={[7.75, 0.08, -30]} receiveShadow castShadow>
        <boxGeometry args={[0.16, 0.16, 130]} />
        <meshStandardMaterial color={colors.oxblood} roughness={0.88} />
      </mesh>

      {/* Floor border inlay (antique silver trim) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.5, 0.005, -30]}>
        <planeGeometry args={[0.08, 130]} />
        <meshStandardMaterial color={colors.silver} roughness={0.4} metalness={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, 0.005, -30]}>
        <planeGeometry args={[0.08, 130]} />
        <meshStandardMaterial color={colors.silver} roughness={0.4} metalness={0.55} />
      </mesh>

      {/* 2. Ceiling — dark charcoal, architectural containment */}
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

      {/* 4. Deep Oxblood Architectural Alcoves along Gallery Route */}
      {/* Scene 1 Alcoves */}
      <ArchitecturalAlcove position={[-7.65, 2.2, 0]} />
      <ArchitecturalAlcove position={[7.65, 2.2, 0]} mirror />

      {/* Scene 2 Alcoves (Framed photographic corridor) */}
      <ArchitecturalAlcove position={[-7.65, 2.4, -13.5]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -15.5]} width={3.6} height={4.2} mirror />
      <ArchitecturalAlcove position={[-7.65, 2.4, -18.0]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -20.0]} width={3.6} height={4.2} mirror />
      <ArchitecturalAlcove position={[-7.65, 2.4, -22.5]} width={3.6} height={4.2} />
      <ArchitecturalAlcove position={[7.65, 2.4, -24.5]} width={3.6} height={4.2} mirror />

      {/* Scene 3 Alcoves (Love Letter Chamber) */}
      <ArchitecturalAlcove position={[-7.65, 2.4, -35]} width={4.5} height={4.5} depth={1.0} />
      <ArchitecturalAlcove position={[7.65, 2.4, -35]} width={4.5} height={4.5} depth={1.0} mirror />

      {/* Scene 4 Alcoves (Finale Chamber) */}
      <ArchitecturalAlcove position={[-7.65, 2.5, -55]} width={4.2} height={4.8} />
      <ArchitecturalAlcove position={[7.65, 2.5, -55]} width={4.2} height={4.8} mirror />

      {/* 5. Architectural Portals linking gallery chambers */}
      <GalleryPortal position={[0, 0, -6.5]} />
      <GalleryPortal position={[0, 0, -28.5]} />
      <GalleryPortal position={[0, 0, -43.5]} />

      {/* Grounding Plinth for Opening Rose */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.9, 0.95, 0.08, 36]} />
          <meshStandardMaterial color={colors.ivory} roughness={0.78} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.085, 0]} receiveShadow>
          <cylinderGeometry args={[0.91, 0.91, 0.01, 36]} />
          <meshStandardMaterial color={colors.silver} roughness={0.35} metalness={0.5} />
        </mesh>
      </group>

      {/* 6. Narrative Scenes */}
      <SculpturalRose position={[0, 1.35, 0]} scale={1.85} />
      <MemoryGallery />
      <LoveLetterScene />
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
        roughness={0.86}
        metalness={0.02}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Architectural alcove recess with oxblood depth and stepped layered architrave */
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

      {/* Shadow Reveal Line */}
      <mesh rotation={[0, rotY, 0]} position={[0, 0, 0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshStandardMaterial color="#2B0E14" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Stepped outer architrave frame in fine ivory stone */}
      <mesh rotation={[0, rotY, 0]} position={[0, 0, 0.02]}>
        <planeGeometry args={[width + 0.22, height + 0.22]} />
        <meshStandardMaterial
          color="#EFE9DC"
          roughness={0.82}
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
        <meshStandardMaterial color={colors.ivory} roughness={0.80} metalness={0.03} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[4.5, 3.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 6.8, 0.5]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.80} metalness={0.03} />
      </mesh>

      {/* Lintel header */}
      <mesh position={[0, 6.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.5, 0.5]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.80} metalness={0.03} />
      </mesh>

      {/* Slender antique silver inlay band across the lintel */}
      <mesh position={[0, 6.35, 0]}>
        <boxGeometry args={[9.5, 0.04, 0.52]} />
        <meshStandardMaterial color={colors.silver} roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}
