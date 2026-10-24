import * as THREE from 'three';

export interface SceneLandmark {
  id: number;
  key: 'rose' | 'gallery-start' | 'gallery-mid' | 'letter' | 'finale';
  sceneIndex: number; // 0: Rose, 1: Memories, 2: Letter, 3: Finale
  scrollOffset: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
}

export interface NavScene {
  label: string;
  sceneIndex: number;
  targetOffset: number;
  range: [number, number];
}

/**
 * 1. Single Source of Truth: Scene Landmarks along the gallery trajectory.
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
    key: 'gallery-start',
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
 * 2. Unified Navigation Destinations & Active Scene Ranges.
 * Derived mathematically from landmark offsets:
 * - Boundaries sit at midpoints between adjacent scene landmarks.
 * - Targets land exactly on the respective primary scene landmarks.
 */
export const SCENE_NAV_ITEMS: NavScene[] = [
  {
    label: 'I. THE ROSE',
    sceneIndex: 0,
    targetOffset: SCENE_LANDMARKS[0].scrollOffset, // 0.00
    range: [0.0, 0.14],
  },
  {
    label: 'II. MEMORIES',
    sceneIndex: 1,
    targetOffset: SCENE_LANDMARKS[1].scrollOffset, // 0.28
    range: [0.14, 0.60],
  },
  {
    label: 'III. THE LETTER',
    sceneIndex: 2,
    targetOffset: SCENE_LANDMARKS[3].scrollOffset, // 0.72
    range: [0.60, 0.86],
  },
  {
    label: 'IV. FINALE',
    sceneIndex: 3,
    targetOffset: SCENE_LANDMARKS[4].scrollOffset, // 1.00
    range: [0.86, 1.0],
  },
];

export const ENTER_TARGET_OFFSET = SCENE_NAV_ITEMS[1].targetOffset; // 0.28

/**
 * 3. Precomputed Tangents for C1 Continuous Hermite Spline Interpolation.
 * Using finite differences so camera velocity is smooth and never stalls at landmarks.
 */
interface SplineSegment {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  t0: THREE.Vector3;
  t1: THREE.Vector3;
  m0: THREE.Vector3;
  m1: THREE.Vector3;
  tm0: THREE.Vector3;
  tm1: THREE.Vector3;
  s0: number;
  s1: number;
  span: number;
}

const N = SCENE_LANDMARKS.length;
const posTangents: THREE.Vector3[] = [];
const targetTangents: THREE.Vector3[] = [];

for (let i = 0; i < N; i++) {
  const prev = SCENE_LANDMARKS[Math.max(0, i - 1)];
  const next = SCENE_LANDMARKS[Math.min(N - 1, i + 1)];
  const dt = next.scrollOffset - prev.scrollOffset;

  if (dt > 0) {
    const dPos = new THREE.Vector3().subVectors(next.cameraPosition, prev.cameraPosition).multiplyScalar(1 / dt);
    const dTarget = new THREE.Vector3().subVectors(next.cameraTarget, prev.cameraTarget).multiplyScalar(1 / dt);
    posTangents.push(dPos);
    targetTangents.push(dTarget);
  } else {
    posTangents.push(new THREE.Vector3());
    targetTangents.push(new THREE.Vector3());
  }
}

const SPLINE_SEGMENTS: SplineSegment[] = [];
for (let i = 0; i < N - 1; i++) {
  const l0 = SCENE_LANDMARKS[i];
  const l1 = SCENE_LANDMARKS[i + 1];
  const span = l1.scrollOffset - l0.scrollOffset;
  SPLINE_SEGMENTS.push({
    p0: l0.cameraPosition,
    p1: l1.cameraPosition,
    t0: posTangents[i],
    t1: posTangents[i + 1],
    m0: l0.cameraTarget,
    m1: l1.cameraTarget,
    tm0: targetTangents[i],
    tm1: targetTangents[i + 1],
    s0: l0.scrollOffset,
    s1: l1.scrollOffset,
    span: span > 0 ? span : 1,
  });
}

/**
 * Continuous C1 camera path evaluation.
 * Evaluates in-place into outPos and outTarget with 0 object allocations per frame.
 * Camera maintains fluid continuous motion across landmark boundaries without halting.
 */
export function evaluateCameraPath(
  offset: number,
  outPos: THREE.Vector3,
  outTarget: THREE.Vector3
): number {
  const clampedOffset = Math.max(0, Math.min(1, offset));

  if (clampedOffset <= 0) {
    outPos.copy(SCENE_LANDMARKS[0].cameraPosition);
    outTarget.copy(SCENE_LANDMARKS[0].cameraTarget);
    return 0;
  }

  if (clampedOffset >= 1) {
    const last = SCENE_LANDMARKS[N - 1];
    outPos.copy(last.cameraPosition);
    outTarget.copy(last.cameraTarget);
    return last.sceneIndex;
  }

  // Find active segment
  let segIdx = 0;
  for (let i = 0; i < SPLINE_SEGMENTS.length; i++) {
    if (clampedOffset >= SPLINE_SEGMENTS[i].s0 && clampedOffset <= SPLINE_SEGMENTS[i].s1) {
      segIdx = i;
      break;
    }
  }

  const seg = SPLINE_SEGMENTS[segIdx];
  const u = (clampedOffset - seg.s0) / seg.span; // Normalized 0..1 in segment

  // Cubic Hermite basis functions
  const u2 = u * u;
  const u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1;
  const h10 = (u3 - 2 * u2 + u) * seg.span;
  const h01 = -2 * u3 + 3 * u2;
  const h11 = (u3 - u2) * seg.span;

  // In-place evaluation of position
  outPos.x = h00 * seg.p0.x + h10 * seg.t0.x + h01 * seg.p1.x + h11 * seg.t1.x;
  outPos.y = h00 * seg.p0.y + h10 * seg.t0.y + h01 * seg.p1.y + h11 * seg.t1.y;
  outPos.z = h00 * seg.p0.z + h10 * seg.t0.z + h01 * seg.p1.z + h11 * seg.t1.z;

  // In-place evaluation of look-at target
  outTarget.x = h00 * seg.m0.x + h10 * seg.tm0.x + h01 * seg.m1.x + h11 * seg.tm1.x;
  outTarget.y = h00 * seg.m0.y + h10 * seg.tm0.y + h01 * seg.m1.y + h11 * seg.tm1.y;
  outTarget.z = h00 * seg.m0.z + h10 * seg.tm0.z + h01 * seg.m1.z + h11 * seg.tm1.z;

  // Identify active scene index based on unified ranges
  for (const item of SCENE_NAV_ITEMS) {
    if (clampedOffset >= item.range[0] && clampedOffset <= item.range[1]) {
      return item.sceneIndex;
    }
  }

  return SCENE_LANDMARKS[segIdx].sceneIndex;
}
