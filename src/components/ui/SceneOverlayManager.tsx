import React from 'react';
import { useAppState } from '../AppState';
import { OpeningOverlay } from '../scenes/OpeningOverlay';
import { MemoryDetailModal } from './MemoryDetailModal';
import { LoveLetterModal } from './LoveLetterModal';
import { FinaleOverlay } from '../scenes/FinaleOverlay';
import { SCENE_NAV_ITEMS, ENTER_TARGET_OFFSET } from '../../config/scenes';

export function SceneOverlayManager() {
  const { scrollOffset, currentScene, scrollTo, setHasEntered } = useAppState();

  const handleEnter = () => {
    setHasEntered(true);
    // Smoothly scroll to the Memories gallery primary landmark
    scrollTo(ENTER_TARGET_OFFSET, true);
  };

  return (
    <>
      {/* 1. Refined top navigation links */}
      <nav
        aria-label="Anniversary Journey navigation"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          gap: 'clamp(0.8rem, 2.5vw, 2.5rem)',
          pointerEvents: 'auto',
          opacity: scrollOffset > 0.04 ? 1 : 0.45,
          transition: 'opacity 0.8s ease',
        }}
      >
        {SCENE_NAV_ITEMS.map((item) => {
          const isActive = currentScene === item.sceneIndex;
          return (
            <button
              key={item.label}
              onClick={() => {
                setHasEntered(true);
                scrollTo(item.targetOffset, true);
              }}
              aria-current={isActive ? 'step' : undefined}
              className="scene-nav-link"
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFCF8',
                fontFamily: '"Inter", sans-serif',
                fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '0.5rem 0.25rem',
                opacity: isActive ? 1.0 : 0.4,
                borderBottom: isActive ? '1px solid #8F2635' : '1px solid transparent',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = isActive ? '1.0' : '0.4';
              }}
              onFocus={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = '0 1px 0 0 #F5F0E7';
              }}
              onBlur={(e) => {
                e.currentTarget.style.opacity = isActive ? '1.0' : '0.4';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {item.label}
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
      {scrollOffset < 0.05 && (
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
            opacity: 0.6,
            animation: 'fadeIn 2.5s ease-out forwards',
          }}
        >
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#F5F0E7',
            }}
          >
            Scroll to begin
          </span>
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#F5F0E7',
              opacity: 0.5,
            }}
          />
        </div>
      )}
    </>
  );
}
