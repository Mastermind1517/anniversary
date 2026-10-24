import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Creates an organic, curved rose petal with realistic botanical curvature,
 * edge fluting, and natural reflexed margins (curled petal tips).
 */
function createOrganicPetalGeometry(
  width: number,
  height: number,
  cupDepth: number,
  curlBack: number,
  fluting: number,
  asymmetry: number = 0
): THREE.BufferGeometry {
  const uSegments = 24;
  const vSegments = 20;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments; // 0 (base) to 1 (tip)

    // Natural botanical petal width profile: narrow claw at base, widest at v ~ 0.65, soft rounded apex
    const widthFactor = Math.sin(Math.pow(v, 0.72) * Math.PI);

    for (let i = 0; i <= uSegments; i++) {
      const uNorm = (i / uSegments) * 2 - 1; // -1 to 1

      // X: lateral spread with subtle organic asymmetry
      const x = uNorm * (width * 0.5) * widthFactor * (1 + uNorm * asymmetry);

      // Y: height with subtle longitudinal S-curve
      const y = v * height - Math.sin(v * Math.PI) * 0.04;

      // Z: compound cup curvature + reflexed tip + edge sinusoidal fluting
      const cup = (1 - uNorm * uNorm) * cupDepth * Math.sin(v * Math.PI * 0.88);
      const reflex = Math.pow(v, 2.4) * curlBack;
      const wave = Math.sin(uNorm * Math.PI * 2.5 + v * Math.PI * 1.5) * fluting * (1 - Math.abs(uNorm) * 0.4);
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

/**
 * Creates curved, tapering lanceolate sepal geometry that cups the flower receptacle.
 */
function createSepalGeometry(): THREE.BufferGeometry {
  const segments = 16;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= segments; j++) {
    const v = j / segments;
    const width = (1 - v) * 0.055;
    const curve = Math.sin(v * Math.PI * 0.6) * 0.06;
    const y = -v * 0.32;
    const z = curve;

    positions.push(-width, y, z);
    positions.push(width, y, z);
    uvs.push(0, v, 1, v);
  }

  for (let j = 0; j < segments; j++) {
    const a = j * 2;
    const b = j * 2 + 1;
    const c = (j + 1) * 2;
    const d = (j + 1) * 2 + 1;

    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function SculpturalRose({
  position = [0, 1.25, 0] as [number, number, number],
  scale = 1.9,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // 1. Parametric geometries for 5 distinct whorls + sepals
  const { geometries, materials } = useMemo(() => {
    const geos = {
      core: createOrganicPetalGeometry(0.34, 0.52, 0.14, 0.03, 0.006, 0.04),
      inner: createOrganicPetalGeometry(0.50, 0.72, 0.22, 0.10, 0.014, -0.03),
      mid: createOrganicPetalGeometry(0.72, 0.94, 0.32, 0.26, 0.022, 0.05),
      outer: createOrganicPetalGeometry(0.96, 1.16, 0.42, 0.46, 0.032, -0.04),
      guard: createOrganicPetalGeometry(1.10, 1.28, 0.48, 0.64, 0.038, 0.02),
      sepal: createSepalGeometry(),
    };

    // Velvet botanical PBR materials with subtle layer-by-layer tonal depth
    const mats = {
      core: new THREE.MeshStandardMaterial({
        color: '#380A12',
        roughness: 0.66,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      inner: new THREE.MeshStandardMaterial({
        color: '#4E0F1A',
        roughness: 0.62,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      mid: new THREE.MeshStandardMaterial({
        color: colors.crimson, // #8F2635
        roughness: 0.58,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      outer: new THREE.MeshStandardMaterial({
        color: '#7B1D2B',
        roughness: 0.64,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      guard: new THREE.MeshStandardMaterial({
        color: colors.burgundy, // #651E2B
        roughness: 0.70,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: '#1C281B',
        roughness: 0.82,
        metalness: 0.03,
      }),
      sepal: new THREE.MeshStandardMaterial({
        color: '#243423',
        roughness: 0.76,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    };

    return { geometries: geos, materials: mats };
  }, []);

  // Safe resource cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geo) => geo.dispose());
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [geometries, materials]);

  // 2. Golden-ratio Fibonacci spiral distribution with organic variation
  const petalData = useMemo(() => {
    const list: Array<{
      geo: THREE.BufferGeometry;
      mat: THREE.Material;
      pos: [number, number, number];
      rot: [number, number, number];
      scale: number;
    }> = [];

    const GOLDEN_ANGLE = 2.399963; // ~137.5 degrees

    // Whorl 1: Tight spiral core bud (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = i * GOLDEN_ANGLE + 0.15;
      const radius = 0.035 + i * 0.014;
      const height = 0.06 + i * 0.018;
      const tilt = 0.14 + i * 0.032;
      const s = 0.94 + ((i * 3) % 5) * 0.03;
      list.push({
        geo: geometries.core,
        mat: materials.core,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI / 2, 0.08 - i * 0.015],
        scale: s,
      });
    }

    // Whorl 2: Inner cupped petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = i * GOLDEN_ANGLE + 0.85;
      const radius = 0.11 + i * 0.016;
      const height = 0.08 + i * 0.014;
      const tilt = 0.34 + i * 0.038;
      const s = 0.95 + ((i * 4) % 6) * 0.025;
      list.push({
        geo: geometries.inner,
        mat: materials.inner,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI / 2, 0.05],
        scale: s,
      });
    }

    // Whorl 3: Mid unfurling tier (10 petals)
    for (let i = 0; i < 10; i++) {
      const angle = i * GOLDEN_ANGLE + 1.6;
      const radius = 0.22 + i * 0.020;
      const height = 0.06 - i * 0.012;
      const tilt = 0.62 + i * 0.034;
      const s = 0.96 + ((i * 7) % 5) * 0.03;
      list.push({
        geo: geometries.mid,
        mat: materials.mid,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI / 2, 0.04 - (i % 2) * 0.03],
        scale: s,
      });
    }

    // Whorl 4: Outer spreading petals (10 petals)
    for (let i = 0; i < 10; i++) {
      const angle = i * GOLDEN_ANGLE + 2.3;
      const radius = 0.40 + i * 0.022;
      const height = -0.02 - i * 0.016;
      const tilt = 0.92 + i * 0.028;
      const s = 0.97 + ((i * 2) % 4) * 0.03;
      list.push({
        geo: geometries.outer,
        mat: materials.outer,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI / 2, 0.03],
        scale: s,
      });
    }

    // Whorl 5: Reflexed guard petals (6 broad petals)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 + 0.35;
      const radius = 0.56;
      const height = -0.12 - (i % 2) * 0.02;
      const tilt = 1.22 + (i % 2) * 0.08;
      list.push({
        geo: geometries.guard,
        mat: materials.guard,
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        rot: [tilt, -angle + Math.PI / 2, 0],
        scale: 1.02,
      });
    }

    return list;
  }, [geometries, materials]);

  // Subtle deliberate gallery rotation with gentle sway
  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
      groupRef.current.rotation.z = Math.sin(timeRef.current * 0.4) * 0.012;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 1. Sculptural Stem with gentle natural curve */}
      <group position={[0, -0.65, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.028, 0.036, 1.3, 20]} />
          <primitive object={materials.stem} attach="material" />
        </mesh>

        {/* Botanical thorns along stem */}
        {[-0.35, -0.1, 0.2].map((y, idx) => (
          <mesh
            key={`thorn-${idx}`}
            position={[0.035, y, 0]}
            rotation={[0, 0, -0.6 + idx * 0.2]}
          >
            <coneGeometry args={[0.018, 0.06, 8]} />
            <primitive object={materials.stem} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 2. Receptacle (swollen botanical torus connecting flower to stem) */}
      <mesh position={[0, -0.04, 0]} castShadow>
        <sphereGeometry args={[0.09, 24, 18]} />
        <primitive object={materials.stem} attach="material" />
      </mesh>

      {/* 3. Calyx: 5 slender arching sepals cupping the receptacle */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2 + 0.25;
        return (
          <group key={`sepal-${i}`} rotation={[0, angle, 0]} position={[0, -0.02, 0]}>
            <mesh
              geometry={geometries.sepal}
              material={materials.sepal}
              position={[0.05, 0, 0]}
              rotation={[0.35, 0, 0]}
              castShadow
            />
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
          scale={p.scale}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
