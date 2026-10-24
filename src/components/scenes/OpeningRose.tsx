import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Generates an organic, curved rose petal geometry with parametric curvature,
 * edge fluting, and natural reflexed margins (curled tips).
 */
function createOrganicPetalGeometry(
  width: number,
  height: number,
  cupDepth: number,
  curlBack: number,
  fluting: number
): THREE.BufferGeometry {
  const uSegments = 24;
  const vSegments = 20;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments; // 0 (base) to 1 (tip)

    // Natural width profile: narrow base, wide shoulders at v ~ 0.65, tapered apex
    const widthFactor = Math.sin(Math.pow(v, 0.7) * Math.PI);

    for (let i = 0; i <= uSegments; i++) {
      const uNorm = (i / uSegments) * 2 - 1; // -1 to 1

      // X: lateral spread
      const x = uNorm * (width * 0.5) * widthFactor;

      // Y: height along petal with subtle natural s-curve
      const y = v * height;

      // Z: cup curvature across width + curl back at tip + edge wave
      const cup = (1 - uNorm * uNorm) * cupDepth * Math.sin(v * Math.PI * 0.85);
      const reflex = Math.pow(v, 2.5) * curlBack;
      const wave = Math.sin(uNorm * Math.PI * 3 + v * Math.PI * 2) * fluting * (1 - Math.abs(uNorm) * 0.5);
      const z = cup - reflex + wave;

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

export function SculpturalRose({
  position = [0, 1.25, 0] as [number, number, number],
  scale = 1.9,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // 1. Shared petal geometries across layers for memory efficiency
  const geometries = useMemo(() => {
    return {
      core: createOrganicPetalGeometry(0.35, 0.55, 0.12, 0.04, 0.008),
      inner: createOrganicPetalGeometry(0.52, 0.75, 0.22, 0.12, 0.015),
      mid: createOrganicPetalGeometry(0.72, 0.95, 0.32, 0.28, 0.024),
      outer: createOrganicPetalGeometry(0.95, 1.15, 0.42, 0.48, 0.035),
      guard: createOrganicPetalGeometry(1.08, 1.25, 0.48, 0.65, 0.04),
    };
  }, []);

  // 2. High-art velvet botanical materials with controlled roughness
  const materials = useMemo(() => {
    return {
      core: new THREE.MeshStandardMaterial({
        color: '#3A0E15',
        roughness: 0.65,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      inner: new THREE.MeshStandardMaterial({
        color: '#551520',
        roughness: 0.6,
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
        color: '#7D1F2D',
        roughness: 0.62,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      guard: new THREE.MeshStandardMaterial({
        color: colors.burgundy,
        roughness: 0.68,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: '#1C281B',
        roughness: 0.82,
        metalness: 0.04,
      }),
      sepal: new THREE.MeshStandardMaterial({
        color: '#253524',
        roughness: 0.78,
        metalness: 0.03,
        side: THREE.DoubleSide,
      }),
    };
  }, []);

  // 3. Golden-ratio spiral distribution of petals for realistic bloom whorl
  const petalData = useMemo(() => {
    const list: Array<{
      geo: THREE.BufferGeometry;
      mat: THREE.Material;
      pos: [number, number, number];
      rot: [number, number, number];
      layer: number;
    }> = [];

    // Core tightly wound spiral (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2.39996) + 0.1; // Golden angle spiral
      const radius = 0.04 + i * 0.015;
      const height = 0.05 + i * 0.02;
      list.push({
        geo: geometries.core,
        mat: materials.core,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [0.15 + i * 0.03, -angle + Math.PI / 2, 0.08],
        layer: 1,
      });
    }

    // Inner petals cupping the core (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = (i * 2.39996) + 0.8;
      const radius = 0.12 + i * 0.018;
      const height = 0.08 + i * 0.015;
      list.push({
        geo: geometries.inner,
        mat: materials.inner,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [0.35 + i * 0.04, -angle + Math.PI / 2, 0.05],
        layer: 2,
      });
    }

    // Mid petals unfurling (10 petals)
    for (let i = 0; i < 10; i++) {
      const angle = (i * 2.39996) + 1.5;
      const radius = 0.24 + i * 0.022;
      const height = 0.06 - i * 0.01;
      list.push({
        geo: geometries.mid,
        mat: materials.mid,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [0.65 + i * 0.035, -angle + Math.PI / 2, 0.04],
        layer: 3,
      });
    }

    // Outer broad petals (10 petals)
    for (let i = 0; i < 10; i++) {
      const angle = (i * 2.39996) + 2.2;
      const radius = 0.42 + i * 0.025;
      const height = -0.02 - i * 0.015;
      list.push({
        geo: geometries.outer,
        mat: materials.outer,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [0.95 + i * 0.03, -angle + Math.PI / 2, 0.03],
        layer: 4,
      });
    }

    // Guard petals at the base (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 + 0.3;
      const radius = 0.58;
      const height = -0.12;
      list.push({
        geo: geometries.guard,
        mat: materials.guard,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [1.25, -angle + Math.PI / 2, 0],
        layer: 5,
      });
    }

    return list;
  }, [geometries, materials]);

  // Subtle natural movement
  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      // Very slow deliberate gallery rotation
      groupRef.current.rotation.y += delta * 0.015;
      // Ultra-subtle organic sway
      groupRef.current.rotation.z = Math.sin(timeRef.current * 0.4) * 0.012;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Sculptural Stem with gentle natural curve */}
      <group position={[0, -0.65, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.028, 0.035, 1.3, 16]} />
          <primitive object={materials.stem} attach="material" />
        </mesh>

        {/* Realistic botanical thorns along stem */}
        {[-0.35, -0.1, 0.2].map((y, idx) => (
          <mesh
            key={`thorn-${idx}`}
            position={[0.035, y, 0]}
            rotation={[0, 0, -0.6 + idx * 0.2]}
          >
            <coneGeometry args={[0.018, 0.06, 6]} />
            <primitive object={materials.stem} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 2. Receptacle (swollen base connecting flower to stem) */}
      <mesh position={[0, -0.04, 0]} castShadow>
        <sphereGeometry args={[0.09, 16, 12]} />
        <primitive object={materials.stem} attach="material" />
      </mesh>

      {/* 3. Calyx: 5 slender tapering sepals cupping the base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2 + 0.2;
        return (
          <group key={`sepal-${i}`} rotation={[0, angle, 0]}>
            <mesh
              position={[0.07, -0.06, 0]}
              rotation={[0.9, 0, 0]}
              castShadow
            >
              <coneGeometry args={[0.035, 0.28, 4]} />
              <primitive object={materials.sepal} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* 4. Layered Petals */}
      {petalData.map((p, idx) => (
        <mesh
          key={`petal-${idx}`}
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
