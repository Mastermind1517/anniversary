import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Generates an organic, curved rose petal geometry with parametric curvature.
 */
function createPetalGeometry(
  width: number,
  height: number,
  cupDepth: number,
  curlBack: number,
  fluting: number = 0.015
): THREE.BufferGeometry {
  const uSegments = 20;
  const vSegments = 16;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments;
    const widthFactor = Math.sin(Math.pow(v, 0.72) * Math.PI);

    for (let i = 0; i <= uSegments; i++) {
      const uNorm = (i / uSegments) * 2 - 1;
      const x = uNorm * (width * 0.5) * widthFactor;
      const y = v * height;
      const cup = (1 - uNorm * uNorm) * cupDepth * Math.sin(v * Math.PI * 0.88);
      const reflex = Math.pow(v, 2.3) * curlBack;
      const wave = Math.sin(uNorm * Math.PI * 2.5 + v * Math.PI * 1.5) * fluting;
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
 * Creates an elegant sculpted glass flacon profile.
 * Continuous profile from solid crystal base, tapering waist, and gently flared lip.
 */
function createVesselGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.25, 0.03),
    new THREE.Vector2(0.245, 0.15),
    new THREE.Vector2(0.225, 0.42),
    new THREE.Vector2(0.21, 0.65),
    new THREE.Vector2(0.225, 0.82),
    new THREE.Vector2(0.255, 0.96),
    new THREE.Vector2(0.25, 0.98),
    new THREE.Vector2(0.23, 0.96),
    new THREE.Vector2(0.20, 0.82),
    new THREE.Vector2(0.185, 0.65),
    new THREE.Vector2(0.20, 0.42),
    new THREE.Vector2(0.215, 0.15),
    new THREE.Vector2(0.21, 0.07),
    new THREE.Vector2(0, 0.07),
  ];

  return new THREE.LatheGeometry(points, 48);
}

/**
 * Single deep-red rose resting delicately in the glass vessel.
 */
function RefinedFinaleRose() {
  const { geometries, materials } = useMemo(() => {
    const geos = {
      inner: createPetalGeometry(0.24, 0.36, 0.11, 0.04, 0.008),
      mid: createPetalGeometry(0.38, 0.48, 0.18, 0.12, 0.014),
      outer: createPetalGeometry(0.52, 0.62, 0.24, 0.24, 0.022),
    };

    const mats = {
      inner: new THREE.MeshStandardMaterial({
        color: '#420D16',
        roughness: 0.64,
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
        roughness: 0.66,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      stem: new THREE.MeshStandardMaterial({
        color: '#1A281A',
        roughness: 0.82,
        metalness: 0.03,
      }),
    };

    return { geometries: geos, materials: mats };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [geometries, materials]);

  const petals = useMemo(() => {
    const list: Array<{ geo: THREE.BufferGeometry; mat: THREE.Material; pos: [number, number, number]; rot: [number, number, number] }> = [];
    const GOLDEN_ANGLE = 2.399963;

    // Inner whorl (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = i * GOLDEN_ANGLE;
      list.push({
        geo: geometries.inner,
        mat: materials.inner,
        pos: [Math.cos(angle) * 0.03, 0.02, Math.sin(angle) * 0.03],
        rot: [0.24, -angle + Math.PI / 2, 0.04],
      });
    }

    // Mid petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = i * GOLDEN_ANGLE + 0.6;
      list.push({
        geo: geometries.mid,
        mat: materials.mid,
        pos: [Math.cos(angle) * 0.075, -0.01, Math.sin(angle) * 0.075],
        rot: [0.52, -angle + Math.PI / 2, 0.03],
      });
    }

    // Outer petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = i * GOLDEN_ANGLE + 1.2;
      list.push({
        geo: geometries.outer,
        mat: materials.outer,
        pos: [Math.cos(angle) * 0.15, -0.05, Math.sin(angle) * 0.15],
        rot: [0.88, -angle + Math.PI / 2, 0.02],
      });
    }

    return list;
  }, [geometries, materials]);

  return (
    <group position={[0.03, 0.68, 0]} rotation={[0.24, 0.14, -0.16]}>
      {/* Stem resting inside vessel */}
      <mesh position={[0.05, -0.36, 0]} rotation={[0, 0, 0.22]} castShadow>
        <cylinderGeometry args={[0.014, 0.018, 0.82, 16]} />
        <primitive object={materials.stem} attach="material" />
      </mesh>

      {/* Sepals cupping the base */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`f-sepal-${i}`}
          position={[0, -0.04, 0]}
          rotation={[0.75, (i / 5) * Math.PI * 2, 0]}
        >
          <coneGeometry args={[0.024, 0.18, 8]} />
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
 * A single rose rests inside an elegant, sculpted transparent glass vessel.
 */
export function FinaleScene() {
  const vesselGeo = useMemo(() => createVesselGeometry(), []);

  useEffect(() => {
    return () => vesselGeo.dispose();
  }, [vesselGeo]);

  return (
    <group position={[0, 0, -55]}>
      {/* 1. Architectural Low Ivory Pedestal with Silver Trim */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.74, 0.80, 0.5, 48]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.76}
          metalness={0.03}
        />
      </mesh>

      {/* Pedestal trim plinth */}
      <mesh position={[0, 0.51, 0]} receiveShadow>
        <cylinderGeometry args={[0.77, 0.77, 0.02, 48]} />
        <meshStandardMaterial
          color={colors.silver}
          roughness={0.35}
          metalness={0.55}
        />
      </mesh>

      {/* 2. Sculptural Pure Crystal Glass Vessel */}
      <group position={[0, 0.52, 0]}>
        {/* Sculpted lathe glass vessel with physical transmission and crystal clarity */}
        <mesh
          geometry={vesselGeo}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.03}
            metalness={0.0}
            transmission={0.98}
            thickness={0.25}
            ior={1.52}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Water meniscus inside vessel */}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.19, 0.205, 0.38, 36]} />
          <meshPhysicalMaterial
            color="#F7F3EB"
            roughness={0.015}
            metalness={0.0}
            transmission={0.99}
            thickness={0.15}
            ior={1.333}
          />
        </mesh>

        {/* The single rose resting inside */}
        <RefinedFinaleRose />
      </group>

      {/* 3. Opening Portal to the Horizon — two ivory columns framing the void */}
      <mesh position={[-4.2, 3.25, -6]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} />
      </mesh>
      <mesh position={[4.2, 3.25, -6]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 6.5, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} />
      </mesh>

      {/* Lintel Beam spanning the portal */}
      <mesh position={[0, 6.0, -6]} receiveShadow>
        <boxGeometry args={[9.6, 0.8, 1.2]} />
        <meshStandardMaterial color={colors.ivory} roughness={0.82} />
      </mesh>

      {/* 4. Deep Burgundy Horizon plane in the distance */}
      <mesh position={[0, 4.8, -25]}>
        <planeGeometry args={[70, 32]} />
        <meshBasicMaterial color="#290B12" />
      </mesh>
    </group>
  );
}
