import React, { useMemo } from 'react';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Single deep-red rose resting in the glass vessel.
 */
function FinaleRose() {
  const petals = useMemo(() => {
    const list: Array<{ angle: number; radius: number; height: number; scale: [number, number, number]; color: string; rotX: number }> = [];
    const layers = [
      { count: 4, r: 0.05, h: 0.15, s: [0.08, 0.14, 0.08] as [number, number, number], c: '#5A1520', rx: 0.2 },
      { count: 6, r: 0.11, h: 0.12, s: [0.12, 0.16, 0.1] as [number, number, number], c: colors.crimson, rx: 0.5 },
      { count: 8, r: 0.18, h: 0.06, s: [0.15, 0.18, 0.12] as [number, number, number], c: '#7A2030', rx: 0.8 },
      { count: 6, r: 0.25, h: 0.01, s: [0.18, 0.18, 0.14] as [number, number, number], c: colors.burgundy, rx: 1.1 },
    ];
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2;
        list.push({
          angle,
          radius: layer.r,
          height: layer.h,
          scale: layer.s,
          color: layer.c,
          rotX: layer.rx,
        });
      }
    });
    return list;
  }, []);

  return (
    <group position={[0, 0.8, 0]} rotation={[0.2, 0.1, -0.15]}>
      {/* Stem resting inside vessel */}
      <mesh position={[0.08, -0.4, 0]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.015, 0.018, 0.85, 8]} />
        <meshStandardMaterial color="#243323" roughness={0.8} />
      </mesh>

      {/* Petals */}
      {petals.map((p, idx) => (
        <group key={idx} rotation={[0, p.angle, 0]}>
          <mesh position={[p.radius, p.height, 0]} rotation={[p.rotX, 0, 0]} castShadow>
            <sphereGeometry args={[p.scale[0], 8, 8]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.52}
              emissive={p.color}
              emissiveIntensity={0.06}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Finale Scene:
 * Ivory architectural portal framing a dark burgundy horizon.
 * A single rose rests inside a minimal, pure transparent glass vessel.
 */
export function FinaleScene() {
  return (
    <group position={[0, 0, -55]}>
      {/* Architectural Low Ivory Pedestal */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.7, 0.75, 0.5, 36]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* Transparent Glass Vessel */}
      <group position={[0, 0.5, 0]}>
        {/* Outer Glass Cylinder */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.28, 1.0, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.02}
            metalness={0.0}
            transmission={0.96}
            thickness={0.4}
            ior={1.52}
            transparent
            opacity={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glass Base Bottom */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.04}
            transmission={0.94}
            thickness={0.5}
            ior={1.52}
            transparent
          />
        </mesh>

        {/* Water inside vessel */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.4, 24]} />
          <meshPhysicalMaterial
            color="#F5F0E7"
            roughness={0.02}
            transmission={0.98}
            ior={1.333}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* The single rose inside */}
        <FinaleRose />
      </group>

      {/* Opening Portal to the Horizon — two ivory columns framing the void */}
      <mesh position={[-4, 3.25, -6]} receiveShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>
      <mesh position={[4, 3.25, -6]} receiveShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>

      {/* Lintel Beam spanning the portal */}
      <mesh position={[0, 6.0, -6]} receiveShadow>
        <boxGeometry args={[9.2, 0.8, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>

      {/* Deep Burgundy Horizon plane in the distance */}
      <mesh position={[0, 5, -25]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial color="#300E15" />
      </mesh>
    </group>
  );
}
