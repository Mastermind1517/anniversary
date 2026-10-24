import React from 'react';
import { useAppState } from '../AppState';
import { OpeningOverlay } from '../scenes/OpeningOverlay';
import { MemoryDetailModal } from './MemoryDetailModal';
import { LoveLetterModal } from './LoveLetterModal';
import { FinaleOverlay } from '../scenes/FinaleOverlay';

const scenes = [
  { label: 'I. THE ROSE', offset: 0.0 },
  { label: 'II. MEMORIES', offset: 0.32 },
  { label: 'III. THE LETTER', offset: 0.58 },
  { label: 'IV. FINALE', offset: 0.88 },
];

export function SceneOverlayManager() {
  const { scrollOffset, currentScene, scrollTo, setHasEntered } = useAppState();

  const handleEnter = () => {
    setHasEntered(true);
    scrollTo(0.24, true);
  };

  return (
    <>
      {/* 1. Subtle, refined top navigation links — nearly invisible until needed */}
      <nav
        aria-label="Scene navigation"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          gap: 'clamp(1rem, 3vw, 2.5rem)',
          pointerEvents: 'auto',
          opacity: scrollOffset > 0.08 ? 1 : 0.4,
          transition: 'opacity 1s ease',
        }}
      >
        {scenes.map((scene, idx) => {
          const isActive = currentScene === idx;
          return (
            <button
              key={scene.label}
              onClick={() => {
                setHasEntered(true);
                scrollTo(scene.offset, true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFCF8',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '0.5rem 0.2rem',
                opacity: isActive ? 0.95 : 0.35,
                borderBottom: isActive ? '1px solid #8F2635' : '1px solid transparent',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive ? '0.95' : '0.35')}
            >
              {scene.label}
            </button>
          );
        })}
      </nav>

      {/* 2. Scene 1 Opening Overlay */}
      <OpeningOverlay scrollProgress={scrollOffset} onEnter={handleEnter} />

      {/* 3. Scene 2 Interactive Memory Detail Modal */}
      <MemoryDetailModal />

      {/* 4. Scene 3 Love Letter Reading View */}
      <LoveLetterModal />

      {/* 5. Scene 4 Finale Typography */}
      <FinaleOverlay scrollProgress={scrollOffset} />

      {/* 6. Subtle Scroll Indicator when in Scene 1 */}
      {scrollOffset < 0.06 && (
        <div
          style={{
            position: 'fixed',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.5,
            animation: 'fadeIn 3s ease-out forwards',
          }}
        >
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#F5F0E7',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#F5F0E7',
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </>
  );
}
