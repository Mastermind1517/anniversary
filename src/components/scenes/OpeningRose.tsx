import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors } from '../../config/colors';

/**
 * Sculptural rose — procedurally generated layered petals with
 * realistic PBR materials. Subtle breathing animation.
 */
export function SculpturalRose({
  position = [0, 1.2, 0] as [number, number, number],
  scale = 1,
}) {
  const groupRef = useRef<THREE.Group>(null);
  const petalRefs = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);

  // Generate petal configurations
  const petals = useMemo(() => {
    const layers: Array<{
      count: number;
      radius: number;
      height: number;
      openAngle: number;
      scale: [number, number, number];
      color: string;
    }> = [
      // Inner core — tight, dark crimson
      { count: 5, radius: 0.08, height: 0.25, openAngle: 0.15, scale: [0.12, 0.22, 0.12], color: '#5A1520' },
      // Inner petals — slightly open
      { count: 7, radius: 0.18, height: 0.2, openAngle: 0.35, scale: [0.18, 0.25, 0.15], color: '#6B1A25' },
      // Mid petals — crimson
      { count: 9, radius: 0.32, height: 0.12, openAngle: 0.65, scale: [0.24, 0.28, 0.18], color: colors.crimson },
      // Outer petals — opening wide, deep red
      { count: 11, radius: 0.48, height: 0.03, openAngle: 0.95, scale: [0.3, 0.32, 0.2], color: '#7A2030' },
      // Outermost — slightly wilting, burgundy edges
      { count: 8, radius: 0.6, height: -0.05, openAngle: 1.15, scale: [0.32, 0.3, 0.22], color: colors.burgundy },
    ];

    const allPetals: Array<{
      layerIdx: number;
      petalIdx: number;
      angle: number;
      radius: number;
      height: number;
      openAngle: number;
      scale: [number, number, number];
      color: string;
    }> = [];

    layers.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + layerIdx * 0.3;
        allPetals.push({
          layerIdx,
          petalIdx: i,
          angle,
          radius: layer.radius,
          height: layer.height,
          openAngle: layer.openAngle,
          scale: layer.scale,
          color: layer.color,
        });
      }
    });

    return allPetals;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (groupRef.current) {
      // Very slow rotation — barely perceptible
      groupRef.current.rotation.y += delta * 0.02;
    }

    // Subtle petal breathing
    petalRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const petal = petals[idx];
      if (!petal) return;

      const breathe = Math.sin(t * 0.5 + petal.angle * 2) * 0.008;
      const windSway = Math.sin(t * 0.3 + petal.layerIdx * 0.5) * 0.003 * (petal.layerIdx + 1);

      mesh.rotation.x = petal.openAngle + breathe;
      mesh.rotation.z = windSway;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 1.2, 8]} />
        <meshStandardMaterial
          color="#2D3A2B"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Calyx (sepals at base of flower) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`sepal-${i}`}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.08,
            -0.05,
            Math.sin((i / 5) * Math.PI * 2) * 0.08,
          ]}
          rotation={[0.8, (i / 5) * Math.PI * 2, 0]}
        >
          <planeGeometry args={[0.06, 0.12]} />
          <meshStandardMaterial
            color="#2D3A2B"
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Rose petals */}
      {petals.map((petal, idx) => (
        <group
          key={idx}
          rotation={[0, petal.angle, 0]}
        >
          <mesh
            ref={(el) => {
              if (el) petalRefs.current[idx] = el;
            }}
            position={[petal.radius, petal.height, 0]}
            rotation={[petal.openAngle, 0, 0]}
            castShadow
          >
            <PetalGeometry scale={petal.scale} />
            <meshStandardMaterial
              color={petal.color}
              roughness={0.55}
              metalness={0.03}
              side={THREE.DoubleSide}
              // Simulated subsurface scattering via emissive
              emissive={petal.color}
              emissiveIntensity={0.05}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Custom petal shape — slightly curved ellipse using a
 * displaced sphere segment for organic feel.
 */
function PetalGeometry({ scale }: { scale: [number, number, number] }) {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI, 0, Math.PI * 0.6);

    // Flatten and curve the petal
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Flatten
      positions.setZ(i, z * 0.15);

      // Add curvature along length
      const curveFactor = y * y * 0.3;
      positions.setZ(i, positions.getZ(i) + curveFactor);

      // Slight taper at edges
      const edgeFactor = 1 - Math.abs(x) * 0.2;
      positions.setY(i, y * edgeFactor);
    }

    geo.computeVertexNormals();
    geo.scale(scale[0], scale[1], scale[2]);
    return geo;
  }, [scale]);

  return <primitive object={geometry} attach="geometry" />;
}
