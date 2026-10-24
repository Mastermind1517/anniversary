import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { siteConfig, type Memory } from '../../config/content';
import { colors } from '../../config/colors';
import { useAppState } from '../AppState';

interface PhotoFrameProps {
  memory: Memory;
  position: [number, number, number];
  rotation?: [number, number, number];
  onSelect: (id: number) => void;
}

/**
 * Creates an elegant editorial photo canvas texture as a high-art placeholder
 * until the user drops real personal photos.
 */
function createPlaceholderTexture(title: string, date: string, id: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Rich archival paper tone
    const grad = ctx.createLinearGradient(0, 0, 1024, 768);
    const hues = ['#301217', '#250E12', '#3D151D', '#1F0B0E', '#2B1015', '#38161E'];
    const baseHue = hues[(id - 1) % hues.length];
    grad.addColorStop(0, baseHue);
    grad.addColorStop(1, '#1A080B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 768);

    // Subtle fine-art border inside image
    ctx.strokeStyle = 'rgba(245, 240, 231, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 944, 688);

    // Subtle artistic vignette / texture lines
    ctx.strokeStyle = 'rgba(245, 240, 231, 0.05)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(512, 384, 120 + i * 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Editorial date & title centered
    ctx.fillStyle = '#F5F0E7';
    ctx.font = '300 24px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText(date.toUpperCase(), 512, 350);

    ctx.fillStyle = '#FFFCF8';
    ctx.font = '300 48px "Cormorant Garamond", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(title, 512, 420);

    // Monogram / archival stamp
    ctx.fillStyle = 'rgba(184, 176, 168, 0.4)';
    ctx.font = '300 16px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('MOMENT ' + String(id).padStart(2, '0'), 512, 650);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function PhotoFrame({ memory, position, rotation = [0, 0, 0], onSelect }: PhotoFrameProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Fallback to stylized editorial canvas texture if image is not found or is placeholder
  const texture = useMemo(() => {
    return createPlaceholderTexture(memory.title, memory.date, memory.id);
  }, [memory]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.03 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(memory.id);
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
      {/* Outer Ivory Gallery Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.7, 0.08]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Frame Passe-partout (matting mount) */}
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[2.14, 1.54]} />
        <meshStandardMaterial
          color="#ECE6DC"
          roughness={0.92}
        />
      </mesh>

      {/* Photograph artwork */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.02}
        />
      </mesh>

      {/* Thin protective glass overlay with subtle specular sheen */}
      <mesh position={[0, 0, 0.048]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.08}
          metalness={0.1}
          transmission={0.92}
          thickness={0.05}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Subtle label plaque below frame */}
      <mesh position={[0, -0.98, 0.01]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshStandardMaterial
          color={colors.oxblood}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

/**
 * Memory Gallery room containing framed memories along ivory walls.
 */
export function MemoryGallery() {
  const { setActivePhotoId } = useAppState();
  const memories = siteConfig.memories;

  // Position frames along the left and right walls of Scene 2 (z = -12 to -25)
  const framePositions: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
    { pos: [-6.8, 2.4, -13.5], rot: [0, Math.PI / 2, 0] },
    { pos: [6.8, 2.4, -15.5], rot: [0, -Math.PI / 2, 0] },
    { pos: [-6.8, 2.4, -18.0], rot: [0, Math.PI / 2, 0] },
    { pos: [6.8, 2.4, -20.0], rot: [0, -Math.PI / 2, 0] },
    { pos: [-6.8, 2.4, -22.5], rot: [0, Math.PI / 2, 0] },
    { pos: [6.8, 2.4, -24.5], rot: [0, -Math.PI / 2, 0] },
  ];

  return (
    <group>
      {memories.slice(0, 6).map((memory, i) => {
        const layout = framePositions[i] || { pos: [0, 2.4, -14 - i * 3], rot: [0, 0, 0] };
        return (
          <PhotoFrame
            key={memory.id}
            memory={memory}
            position={layout.pos}
            rotation={layout.rot}
            onSelect={(id) => setActivePhotoId(id)}
          />
        );
      })}
    </group>
  );
}
