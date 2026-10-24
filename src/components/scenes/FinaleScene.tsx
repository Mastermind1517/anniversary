import React, { useMemo } from 'react';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Generates an organic, curved rose petal geometry with parametric curvature.
 */
function createPetalGeometry(width: number, height: number, cupDepth: number, curlBack: number): THREE.BufferGeometry {
  const uSegments = 16;
  const vSegments = 14;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments;
    const widthFactor = Math.sin(Math.pow(v, 0.7) * Math.PI);

    for (let i = 0; i <= uSegments; i++) {
      const uNorm = (i / uSegments) * 2 - 1;
      const x = uNorm * (width * 0.5) * widthFactor;
      const y = v * height;
      const cup = (1 - uNorm * uNorm) * cupDepth * Math.sin(v * Math.PI * 0.85);
      const reflex = Math.pow(v, 2.2) * curlBack;
      const z = cup - reflex;

      positions.push(x, y, z);
      uvs.push(i / uSegments, v);
    }
  }

  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = (j + 1) * (uSegments + 1) + i;
      const c = (j + 1) * (uSegments + 1) + (i + 1);
      const d = j * (uSegments + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Single deep-red rose resting delicately in the glass vessel.
 */
function RefinedFinaleRose() {
  const geometries = useMemo(() => {
    return {
      inner: createPetalGeometry(0.24, 0.36, 0.1, 0.04),
      mid: createPetalGeometry(0.38, 0.48, 0.16, 0.12),
      outer: createPetalGeometry(0.52, 0.62, 0.22, 0.22),
    };
  }, []);

  const materials = useMemo(() => {
    return {
      inner: new THREE.MeshStandardMaterial({
        color: '#4B121C',
        roughness: 0.62,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      mid: new THREE.MeshStandardMaterial({
        color: colors.crimson,
        roughness: 0.58,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      outer: new THREE.MeshStandardMaterial({
        color: colors.burgundy,
        roughness: 0.65,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: '#1E2C1E',
        roughness: 0.8,
        metalness: 0.03,
      }),
    };
  }, []);

  const petals = useMemo(() => {
    const list: Array<{ geo: THREE.BufferGeometry; mat: THREE.Material; pos: [number, number, number]; rot: [number, number, number] }> = [];

    // Inner whorl (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = i * 2.39996;
      list.push({
        geo: geometries.inner,
        mat: materials.inner,
        pos: [Math.cos(angle) * 0.03, 0.02, Math.sin(angle) * 0.03],
        rot: [0.25, -angle + Math.PI / 2, 0.04],
      });
    }

    // Mid petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = i * 2.39996 + 0.6;
      list.push({
        geo: geometries.mid,
        mat: materials.mid,
        pos: [Math.cos(angle) * 0.08, -0.01, Math.sin(angle) * 0.08],
        rot: [0.55, -angle + Math.PI / 2, 0.03],
      });
    }

    // Outer petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = i * 2.39996 + 1.2;
      list.push({
        geo: geometries.outer,
        mat: materials.outer,
        pos: [Math.cos(angle) * 0.16, -0.05, Math.sin(angle) * 0.16],
        rot: [0.92, -angle + Math.PI / 2, 0.02],
      });
    }

    return list;
  }, [geometries, materials]);

  return (
    <group position={[0.04, 0.72, 0]} rotation={[0.22, 0.12, -0.18]}>
      {/* Stem resting inside vessel */}
      <mesh position={[0.05, -0.38, 0]} rotation={[0, 0, 0.22]} castShadow>
        <cylinderGeometry args={[0.014, 0.018, 0.82, 12]} />
        <primitive object={materials.stem} attach="material" />
      </mesh>

      {/* Sepals */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`f-sepal-${i}`}
          position={[0, -0.04, 0]}
          rotation={[0.8, (i / 5) * Math.PI * 2, 0]}
        >
          <coneGeometry args={[0.02, 0.14, 4]} />
          <primitive object={materials.stem} attach="material" />
        </mesh>
      ))}

      {/* Petals */}
      {petals.map((p, idx) => (
        <mesh
          key={`f-petal-${idx}`}
          geometry={p.geo}
          material={p.mat}
          position={p.pos}
          rotation={p.rot}
          castShadow
          receiveShadow
        />
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
      {/* 1. Architectural Low Ivory Pedestal */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.5, 36]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.82}
          metalness={0.02}
        />
      </mesh>

      {/* Pedestal trim */}
      <mesh position={[0, 0.51, 0]} receiveShadow>
        <cylinderGeometry args={[0.76, 0.76, 0.02, 36]} />
        <meshStandardMaterial
          color="#E8E2D6"
          roughness={0.88}
        />
      </mesh>

      {/* 2. Transparent Glass Vessel with Refraction & Controlled Specular Sheen */}
      <group position={[0, 0.52, 0]}>
        {/* Outer Glass Cylinder */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.94, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.04}
            metalness={0.0}
            transmission={0.96}
            thickness={0.35}
            ior={1.5}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Thick Glass Base */}
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.05, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.05}
            transmission={0.94}
            thickness={0.6}
            ior={1.52}
            transparent
          />
        </mesh>

        {/* Water meniscus inside vessel */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.245, 0.245, 0.46, 24]} />
          <meshPhysicalMaterial
            color="#FAF6F0"
            roughness={0.02}
            transmission={0.98}
            ior={1.333}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* The single rose inside */}
        <RefinedFinaleRose />
      </group>

      {/* 3. Opening Portal to the Horizon — two ivory columns framing the void */}
      <mesh position={[-4.2, 3.25, -6]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>
      <mesh position={[4.2, 3.25, -6]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>

      {/* Lintel Beam spanning the portal */}
      <mesh position={[0, 6.0, -6]} receiveShadow>
        <boxGeometry args={[9.6, 0.8, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.85} />
      </mesh>

      {/* 4. Deep Burgundy Horizon plane in the distance */}
      <mesh position={[0, 4.8, -25]}>
        <planeGeometry args={[70, 32]} />
        <meshBasicMaterial color="#290B12" />
      </mesh>
    </group>
  );
}
