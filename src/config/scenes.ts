import * as THREE from 'three';

export interface SceneLandmark {
  id: number;
  key: 'rose' | 'gallery' | 'gallery-mid' | 'letter' | 'finale';
  sceneIndex: number; // 0: Rose, 1: Memories, 2: Letter, 3: Finale
  scrollOffset: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
}

/**
 * Continuous landmarks along the scroll trajectory.
 * The camera interpolates smoothly between adjacent landmarks over the ENTIRE interval,
 * completely eliminating frozen/dead zones.
 */
export const SCENE_LANDMARKS: SceneLandmark[] = [
  {
    id: 1,
    key: 'rose',
    sceneIndex: 0,
    scrollOffset: 0.0,
    cameraPosition: new THREE.Vector3(0, 1.85, 7.2),
    cameraTarget: new THREE.Vector3(0, 1.35, 0),
  },
  {
    id: 2,
    key: 'gallery',
    sceneIndex: 1,
    scrollOffset: 0.28,
    cameraPosition: new THREE.Vector3(0, 2.1, -11.5),
    cameraTarget: new THREE.Vector3(0, 2.05, -17.5),
  },
  {
    id: 3,
    key: 'gallery-mid',
    sceneIndex: 1,
    scrollOffset: 0.48,
    cameraPosition: new THREE.Vector3(0, 2.15, -19.5),
    cameraTarget: new THREE.Vector3(0, 2.05, -26.5),
  },
  {
    id: 4,
    key: 'letter',
    sceneIndex: 2,
    scrollOffset: 0.72,
    cameraPosition: new THREE.Vector3(0, 2.1, -31.5),
    cameraTarget: new THREE.Vector3(0, 1.45, -35.2),
  },
  {
    id: 5,
    key: 'finale',
    sceneIndex: 3,
    scrollOffset: 1.0,
    cameraPosition: new THREE.Vector3(0, 2.45, -48.5),
    cameraTarget: new THREE.Vector3(0, 1.7, -55.8),
  },
];

/**
 * Top navigation destinations and active scene ranges.
 */
export const SCENE_NAV_ITEMS = [
  { label: 'I. THE ROSE', targetOffset: 0.0, sceneIndex: 0, range: [0.0, 0.2] as [number, number] },
  { label: 'II. MEMORIES', targetOffset: 0.32, sceneIndex: 1, range: [0.2, 0.58] as [number, number] },
  { label: 'III. THE LETTER', targetOffset: 0.72, sceneIndex: 2, range: [0.58, 0.84] as [number, number] },
  { label: 'IV. FINALE', targetOffset: 1.0, sceneIndex: 3, range: [0.84, 1.0] as [number, number] },
];

/**
 * Hermite smoothstep easing for smooth interpolation between landmarks.
 */
export function smoothHermite(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Continuous camera interpolation along the landmarks list.
 * Evaluates in-place into outPos and outTarget to avoid per-frame allocations.
 */
export function evaluateCameraPath(
  offset: number,
  outPos: THREE.Vector3,
  outTarget: THREE.Vector3
): number {
  const clampedOffset = Math.max(0, Math.min(1, offset));

  // Find adjacent landmark interval
  let fromIdx = 0;
  for (let i = 0; i < SCENE_LANDMARKS.length - 1; i++) {
    if (clampedOffset >= SCENE_LANDMARKS[i].scrollOffset && clampedOffset <= SCENE_LANDMARKS[i + 1].scrollOffset) {
      fromIdx = i;
      break;
    }
  }

  // Edge case at exactly 1.0
  if (clampedOffset >= 1.0) {
    const last = SCENE_LANDMARKS[SCENE_LANDMARKS.length - 1];
    outPos.copy(last.cameraPosition);
    outTarget.copy(last.cameraTarget);
    return last.sceneIndex;
  }

  const from = SCENE_LANDMARKS[fromIdx];
  const to = SCENE_LANDMARKS[fromIdx + 1];

  const intervalSpan = to.scrollOffset - from.scrollOffset;
  const rawT = intervalSpan > 0 ? (clampedOffset - from.scrollOffset) / intervalSpan : 0;
  const t = smoothHermite(rawT);

  outPos.lerpVectors(from.cameraPosition, to.cameraPosition, t);
  outTarget.lerpVectors(from.cameraTarget, to.cameraTarget, t);

  // Return active scene index based on boundary
  for (const item of SCENE_NAV_ITEMS) {
    if (clampedOffset >= item.range[0] && clampedOffset <= item.range[1]) {
      return item.sceneIndex;
    }
  }
  return from.sceneIndex;
}
