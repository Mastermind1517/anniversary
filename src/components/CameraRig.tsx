import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useAppState } from './AppState';
import { evaluateCameraPath } from '../config/scenes';

/**
 * Focus coordinates when a memory frame is selected.
 * Places camera directly in front of the artwork at eye-level.
 */
const photoFocusTargets: Record<number, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  1: { pos: new THREE.Vector3(-4.0, 2.4, -13.5), target: new THREE.Vector3(-6.8, 2.4, -13.5) },
  2: { pos: new THREE.Vector3(4.0, 2.4, -15.5), target: new THREE.Vector3(6.8, 2.4, -15.5) },
  3: { pos: new THREE.Vector3(-4.0, 2.4, -18.0), target: new THREE.Vector3(-6.8, 2.4, -18.0) },
  4: { pos: new THREE.Vector3(4.0, 2.4, -20.0), target: new THREE.Vector3(6.8, 2.4, -20.0) },
  5: { pos: new THREE.Vector3(-4.0, 2.4, -22.5), target: new THREE.Vector3(-6.8, 2.4, -22.5) },
  6: { pos: new THREE.Vector3(4.0, 2.4, -24.5), target: new THREE.Vector3(6.8, 2.4, -24.5) },
};

export function CameraRig() {
  const scroll = useScroll();
  const {
    registerScrollEl,
    setScrollOffset,
    setCurrentScene,
    activePhotoId,
    isLetterOpen,
  } = useAppState();

  const currentPos = useRef(new THREE.Vector3(0, 1.85, 7.2));
  const currentTarget = useRef(new THREE.Vector3(0, 1.35, 0));
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const lastReportedOffset = useRef(-1);
  const lastReportedScene = useRef(-1);

  // Register scroll element with AppState
  useEffect(() => {
    if (scroll.el) {
      registerScrollEl(scroll.el);
    }
  }, [scroll.el, registerScrollEl]);

  // Lock background scroll when a modal is open to prevent background scene drift
  useEffect(() => {
    if (!scroll.el) return;
    const isModalOpen = activePhotoId !== null || isLetterOpen;
    if (isModalOpen) {
      scroll.el.style.overflow = 'hidden';
    } else {
      scroll.el.style.overflow = 'auto';
    }
  }, [scroll.el, activePhotoId, isLetterOpen]);

  // Global keyboard listener to ensure ArrowDown, ArrowUp, PageDown, etc.
  // work immediately on page load even before clicking the canvas.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input or modal is active
      if (activePhotoId !== null || isLetterOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!scroll.el) return;

      const clientHeight = scroll.el.clientHeight;
      const step = 140;

      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          scroll.el.scrollBy({ top: step, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'k':
          scroll.el.scrollBy({ top: -step, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'PageDown':
        case ' ':
          scroll.el.scrollBy({ top: clientHeight * 0.8, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'PageUp':
          scroll.el.scrollBy({ top: -clientHeight * 0.8, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'Home':
          scroll.el.scrollTo({ top: 0, behavior: 'smooth' });
          e.preventDefault();
          break;
        case 'End':
          scroll.el.scrollTo({ top: scroll.el.scrollHeight, behavior: 'smooth' });
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scroll.el, activePhotoId, isLetterOpen]);

  useFrame((state, delta) => {
    const offset = Math.max(0, Math.min(1, scroll.offset));
    const safeDelta = Math.min(delta, 0.1); // clamp delta to prevent lag spikes

    if (activePhotoId !== null && photoFocusTargets[activePhotoId]) {
      // Photo selected: Camera glides smoothly in front of the artwork
      desiredPos.current.copy(photoFocusTargets[activePhotoId].pos);
      desiredTarget.current.copy(photoFocusTargets[activePhotoId].target);
    } else {
      // Continuous camera interpolation along the whole landmark path
      const detectedScene = evaluateCameraPath(offset, desiredPos.current, desiredTarget.current);

      if (detectedScene !== lastReportedScene.current) {
        lastReportedScene.current = detectedScene;
        setCurrentScene(detectedScene);
      }
    }

    // Smooth cinematic damping
    const dampFactor = 1 - Math.pow(0.0008, safeDelta);
    currentPos.current.lerp(desiredPos.current, dampFactor);
    currentTarget.current.lerp(desiredTarget.current, dampFactor);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);

    // Sync scroll state with throttle to avoid React churn
    if (Math.abs(offset - lastReportedOffset.current) > 0.002) {
      lastReportedOffset.current = offset;
      setScrollOffset(offset);
    }
  });

  return null;
}
