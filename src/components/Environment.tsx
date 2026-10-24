import { useRef } from 'react';
import * as THREE from 'three';
import { threeColors, colors } from '../config/colors';

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

      {/* Scene 1 placeholder: red sphere (will become rose) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color={colors.crimson}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Scene 2 placeholders: gallery frames on walls */}
      <GalleryFramePlaceholder position={[-6.5, 2.5, -13]} />
      <GalleryFramePlaceholder position={[-6.5, 2.5, -17]} />
      <GalleryFramePlaceholder position={[-6.5, 2.5, -21]} />
      <GalleryFramePlaceholder position={[6.5, 2.5, -14]} rotation={[0, Math.PI, 0]} />
      <GalleryFramePlaceholder position={[6.5, 2.5, -18]} rotation={[0, Math.PI, 0]} />
      <GalleryFramePlaceholder position={[6.5, 2.5, -22]} rotation={[0, Math.PI, 0]} />

      {/* Scene 3 placeholder: box on pedestal (will become letter/keepsake) */}
      <group position={[0, 0, -35]}>
        {/* Pedestal */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 1, 0.6]} />
          <meshStandardMaterial
            color={colors.oxblood}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        {/* Box on pedestal */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial
            color={colors.ivory}
            roughness={0.6}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* Scene 4 placeholder: glass sphere (will become glass vessel + rose) */}
      <group position={[0, 0, -55]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshPhysicalMaterial
            color={colors.porcelain}
            roughness={0.05}
            metalness={0.0}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
          />
        </mesh>
        {/* Small crimson sphere inside (rose placeholder) */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={colors.crimson}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Translucent divider panels between scenes */}
      <TranslucentPanel position={[0, 3, -7]} />
      <TranslucentPanel position={[0, 3, -27]} />
      <TranslucentPanel position={[0, 3, -45]} />
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

/** Gallery frame placeholder — ivory border with dark interior */
function GalleryFramePlaceholder({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.6, 0.08]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      {/* Photo area (dark) */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.9, 1.3]} />
        <meshStandardMaterial
          color={colors.charcoal}
          roughness={0.9}
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
