import React, { useRef, useMemo, useState, useEffect } from 'react';
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
 * Creates an elegant editorial photo canvas texture.
 * Canvas resolution 1184x800 matches the 1.85:1.25 (1.48:1) artwork plane exactly.
 */
function createArchivalPlaceholderTexture(title: string, date: string, id: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1184;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Rich archival tonal background
    const hues = ['#2B0E14', '#200A0E', '#341219', '#1C080B', '#270D13', '#301016'];
    const baseHue = hues[(id - 1) % hues.length];
    const grad = ctx.createLinearGradient(0, 0, 1184, 800);
    grad.addColorStop(0, baseHue);
    grad.addColorStop(1, '#150608');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1184, 800);

    // Fine archival border inlay
    ctx.strokeStyle = 'rgba(245, 240, 231, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, 1088, 704);

    // Subtle fine concentric guide lines
    ctx.strokeStyle = 'rgba(245, 240, 231, 0.04)';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(592, 400, 140 + i * 50, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Archival date header
    ctx.fillStyle = '#F5F0E7';
    ctx.font = '300 22px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText(date.toUpperCase(), 592, 350);

    // Title in elegant Cormorant Garamond
    ctx.fillStyle = '#FFFCF8';
    ctx.font = '300 48px "Cormorant Garamond", serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(title, 592, 430);

    // Monogram badge
    ctx.fillStyle = 'rgba(184, 176, 168, 0.5)';
    ctx.font = '300 15px "Inter", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText(`MOMENT ${String(id).padStart(2, '0')} · EXHIBIT`, 592, 680);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export function PhotoFrame({ memory, position, rotation = [0, 0, 0], onSelect }: PhotoFrameProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [activeTexture, setActiveTexture] = useState<THREE.Texture | null>(null);
  const loadedTextureRef = useRef<THREE.Texture | null>(null);

  // 1. Create matching 1.48 aspect-ratio placeholder
  const placeholderTexture = useMemo(() => {
    return createArchivalPlaceholderTexture(memory.title, memory.date, memory.id);
  }, [memory.title, memory.date, memory.id]);

  // Clean up textures on unmount
  useEffect(() => {
    return () => {
      if (placeholderTexture) {
        placeholderTexture.dispose();
      }
      if (loadedTextureRef.current) {
        loadedTextureRef.current.dispose();
      }
    };
  }, [placeholderTexture]);

  // 2. Load real photo only if explicitly marked as available
  useEffect(() => {
    if (memory.hasRealPhoto && memory.photo) {
      const loader = new THREE.TextureLoader();
      loader.load(
        memory.photo,
        (loadedTex) => {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTextureRef.current = loadedTex;
          setActiveTexture(loadedTex);
        },
        undefined,
        () => {
          setActiveTexture(placeholderTexture);
        }
      );
    } else {
      setActiveTexture(placeholderTexture);
    }
  }, [memory.hasRealPhoto, memory.photo, placeholderTexture]);

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
      {/* Outer Ivory Gallery Frame with subtle bevel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.28, 1.68, 0.08]} />
        <meshStandardMaterial
          color={colors.ivory}
          roughness={0.68}
          metalness={0.04}
        />
      </mesh>

      {/* Frame Passe-partout (matting mount recessed inside frame) */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.14, 1.54]} />
        <meshStandardMaterial
          color="#ECE6DC"
          roughness={0.94}
        />
      </mesh>

      {/* Photograph artwork — 1.85 : 1.25 matching texture aspect ratio 1.48 */}
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshStandardMaterial
          map={activeTexture || placeholderTexture}
          roughness={0.45}
          metalness={0.01}
        />
      </mesh>

      {/* High-clarity protective glass with subtle non-milky specular reflection */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.85, 1.25]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.04}
          metalness={0.0}
          transmission={0.96}
          thickness={0.04}
          ior={1.48}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Minimal brass plaque below the frame */}
      <mesh position={[0, -0.96, 0.01]}>
        <boxGeometry args={[0.7, 0.1, 0.01]} />
        <meshStandardMaterial
          color={colors.oxblood}
          roughness={0.75}
          metalness={0.1}
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
