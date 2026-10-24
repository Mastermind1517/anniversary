import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Camera waypoints for the 4 scenes.
 * Each has a position and a lookAt target.
 * The camera interpolates smoothly between them based on scroll position.
 */
const waypoints = [
  {
    // Scene 1: Opening — looking at the rose
    position: new THREE.Vector3(0, 2, 8),
    target: new THREE.Vector3(0, 1.5, 0),
    range: [0, 0.18] as [number, number],
  },
  {
    // Scene 2: Memory Gallery — moving through gallery corridor
    position: new THREE.Vector3(0, 2.2, -12),
    target: new THREE.Vector3(0, 2, -18),
    range: [0.22, 0.45] as [number, number],
  },
  {
    // Scene 3: Love Letter — approaching the pedestal
    position: new THREE.Vector3(0, 2, -32),
    target: new THREE.Vector3(0, 1.5, -38),
    range: [0.50, 0.68] as [number, number],
  },
  {
    // Scene 4: Finale — pulling back to reveal the composition
    position: new THREE.Vector3(0, 2.5, -52),
    target: new THREE.Vector3(0, 2, -58),
    range: [0.75, 1.0] as [number, number],
  },
];

/** Smooth step function for easing between waypoints */
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function CameraRig() {
  const scroll = useScroll();
  const currentPos = useRef(new THREE.Vector3(0, 2, 8));
  const currentTarget = useRef(new THREE.Vector3(0, 1.5, 0));
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const offset = scroll.offset; // 0 to 1

    // Determine which waypoints we're between
    let fromIdx = 0;
    let toIdx = 0;
    let t = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const fromEnd = waypoints[i].range[1];
      const toStart = waypoints[i + 1].range[0];

      if (offset <= waypoints[i].range[1]) {
        // Still in this waypoint's range
        fromIdx = i;
        toIdx = i;
        t = 0;
        break;
      } else if (offset >= waypoints[i + 1].range[0]) {
        if (i === waypoints.length - 2 || offset <= waypoints[i + 1].range[1]) {
          // In the next waypoint's range
          fromIdx = i + 1;
          toIdx = i + 1;
          t = 0;
          break;
        }
      } else {
        // Transitioning between waypoints
        fromIdx = i;
        toIdx = i + 1;
        t = smoothstep(fromEnd, toStart, offset);
        break;
      }
    }

    // Handle edge case — past last waypoint
    if (offset >= waypoints[waypoints.length - 1].range[0]) {
      fromIdx = waypoints.length - 1;
      toIdx = waypoints.length - 1;
      t = 0;
    }

    // Calculate desired position and target
    desiredPos.current.lerpVectors(
      waypoints[fromIdx].position,
      waypoints[toIdx].position,
      t
    );
    desiredTarget.current.lerpVectors(
      waypoints[fromIdx].target,
      waypoints[toIdx].target,
      t
    );

    // Smooth damping toward desired position (cinematic feel)
    const dampFactor = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(desiredPos.current, dampFactor);
    currentTarget.current.lerp(desiredTarget.current, dampFactor);

    // Apply to camera
    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}
