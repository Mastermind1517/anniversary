import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from './AppState';

/**
 * Camera waypoints for the 4 scenes.
 * The camera interpolates smoothly between them based on scroll position.
 */
const waypoints = [
  {
    // Scene 1: Opening — sculptural rose
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
    // Scene 3: Love Letter — approaching pedestal / keepsake box
    position: new THREE.Vector3(0, 2, -32),
    target: new THREE.Vector3(0, 1.5, -38),
    range: [0.50, 0.68] as [number, number],
  },
  {
    // Scene 4: Finale — slow pull-back revealing vessel + horizon
    position: new THREE.Vector3(0, 2.5, -52),
    target: new THREE.Vector3(0, 2, -58),
    range: [0.75, 1.0] as [number, number],
  },
];

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function CameraRig() {
  const scroll = useScroll();
  const { registerScrollEl, setScrollOffset, setCurrentScene } = useAppState();

  const currentPos = useRef(new THREE.Vector3(0, 2, 8));
  const currentTarget = useRef(new THREE.Vector3(0, 1.5, 0));
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const lastReportedOffset = useRef(-1);
  const lastReportedScene = useRef(-1);

  // Register scroll element with AppState so buttons can trigger smooth scrolling
  useEffect(() => {
    if (scroll.el) {
      registerScrollEl(scroll.el);
    }
  }, [scroll.el, registerScrollEl]);

  useFrame((state, delta) => {
    const offset = scroll.offset;

    let fromIdx = 0;
    let toIdx = 0;
    let t = 0;
    let detectedScene = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const fromEnd = waypoints[i].range[1];
      const toStart = waypoints[i + 1].range[0];

      if (offset <= waypoints[i].range[1]) {
        fromIdx = i;
        toIdx = i;
        t = 0;
        detectedScene = i;
        break;
      } else if (offset >= waypoints[i + 1].range[0]) {
        if (i === waypoints.length - 2 || offset <= waypoints[i + 1].range[1]) {
          fromIdx = i + 1;
          toIdx = i + 1;
          t = 0;
          detectedScene = i + 1;
          break;
        }
      } else {
        fromIdx = i;
        toIdx = i + 1;
        t = smoothstep(fromEnd, toStart, offset);
        detectedScene = t > 0.5 ? i + 1 : i;
        break;
      }
    }

    if (offset >= waypoints[waypoints.length - 1].range[0]) {
      fromIdx = waypoints.length - 1;
      toIdx = waypoints.length - 1;
      t = 0;
      detectedScene = waypoints.length - 1;
    }

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

    const dampFactor = 1 - Math.pow(0.001, delta);
    currentPos.current.lerp(desiredPos.current, dampFactor);
    currentTarget.current.lerp(desiredTarget.current, dampFactor);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);

    // Sync scroll state with throttle to avoid excessive re-renders
    if (Math.abs(offset - lastReportedOffset.current) > 0.003) {
      lastReportedOffset.current = offset;
      setScrollOffset(offset);
    }
    if (detectedScene !== lastReportedScene.current) {
      lastReportedScene.current = detectedScene;
      setCurrentScene(detectedScene);
    }
  });

  return null;
}
