import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors } from '../../config/colors';
import { useAppState } from '../AppState';

/**
 * 3D Love Letter and Sculptural Keepsake Box on an oxblood stone pedestal.
 * Features a hinged opening animation that reveals the ivory letter.
 */
export function LoveLetterScene() {
  const { isLetterOpen, setIsLetterOpen } = useAppState();
  const lidGroupRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth lid open angle: 0 (closed) to -Math.PI * 0.65 (open)
  useFrame((_, delta) => {
    const targetAngle = isLetterOpen ? -Math.PI * 0.65 : 0;
    if (lidGroupRef.current) {
      lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        lidGroupRef.current.rotation.x,
        targetAngle,
        delta * 3.5
      );
    }

    // Letter elevates slightly when box opens
    if (letterRef.current) {
      const targetY = isLetterOpen ? 0.08 : 0.02;
      letterRef.current.position.y = THREE.MathUtils.lerp(
        letterRef.current.position.y,
        targetY,
        delta * 3.5
      );
    }
  });

  return (
    <group position={[0, 0, -35]}>
      {/* 1. Monolithic Dark Burgundy Pedestal */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.0, 0.9]} />
        <meshStandardMaterial
          color={colors.oxblood}
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* Pedestal plinth trim */}
      <mesh position={[0, 1.02, 0]} receiveShadow>
        <boxGeometry args={[1.26, 0.04, 0.96]} />
        <meshStandardMaterial
          color={colors.burgundy}
          roughness={0.82}
        />
      </mesh>

      {/* 2. Keepsake Box Interactive Group */}
      <group
        position={[0, 1.06, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setIsLetterOpen(!isLetterOpen);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Box Base */}
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.12, 0.5]} />
          <meshStandardMaterial
            color={colors.ivory}
            roughness={0.4}
            metalness={0.04}
          />
        </mesh>

        {/* Box Interior Velvet Lining (Oxblood) */}
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.64, 0.09, 0.44]} />
          <meshStandardMaterial
            color={colors.oxblood}
            roughness={0.95}
          />
        </mesh>

        {/* 3. The Folded Ivory Letter resting inside */}
        <group ref={letterRef} position={[0, 0.07, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.018, 0.36]} />
            <meshStandardMaterial
              color={colors.porcelain}
              roughness={0.85}
              metalness={0.01}
            />
          </mesh>

          {/* Muted Antique Silver Ribbon band */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.06, 0.005, 0.365]} />
            <meshStandardMaterial
              color={colors.silver}
              roughness={0.4}
              metalness={0.4}
            />
          </mesh>

          {/* Restrained Crimson Seal */}
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.006, 24]} />
            <meshStandardMaterial
              color={colors.crimson}
              roughness={0.5}
            />
          </mesh>
        </group>

        {/* 4. Hinged Keepsake Box Lid */}
        {/* Pivot is positioned at the back edge of the box (z = -0.25, y = 0.12) */}
        <group ref={lidGroupRef} position={[0, 0.12, -0.25]}>
          <mesh position={[0, 0.02, 0.25]} castShadow>
            <boxGeometry args={[0.72, 0.04, 0.52]} />
            <meshStandardMaterial
              color={colors.ivory}
              roughness={0.38}
              metalness={0.05}
            />
          </mesh>

          {/* Minimal antique silver handle / clasp */}
          <mesh position={[0, 0.04, 0.5]}>
            <boxGeometry args={[0.08, 0.015, 0.02]} />
            <meshStandardMaterial
              color={colors.silver}
              roughness={0.35}
              metalness={0.5}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
