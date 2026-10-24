import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Body } from '../ui/Typography';
import { siteConfig } from '../../config/content';

interface OpeningOverlayProps {
  /** Scroll progress 0-1 for this scene */
  scrollProgress: number;
  onEnter?: () => void;
}

/**
 * Opening scene typography overlay.
 * "ONE YEAR." → pause → tagline → "Enter"
 * Fades out as user scrolls past the opening.
 */
export function OpeningOverlay({ scrollProgress, onEnter }: OpeningOverlayProps) {
  const [phase, setPhase] = useState(0); // 0: title, 1: tagline, 2: enter
  const [hasEntered, setHasEntered] = useState(false);

  // Auto-sequence the text reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2500);
    const t2 = setTimeout(() => setPhase(2), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEnter = useCallback(() => {
    setHasEntered(true);
    onEnter?.();
  }, [onEnter]);

  // Fade out as we scroll away from Scene 1
  const opacity = scrollProgress < 0.15
    ? 1
    : Math.max(0, 1 - (scrollProgress - 0.15) / 0.08);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Main title */}
      <div
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          marginBottom: '2rem',
        }}
      >
        <Heading
          variant="hero"
          as="h1"
          style={{ letterSpacing: '0.15em' }}
        >
          {siteConfig.opening.line1}
        </Heading>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 2s cubic-bezier(0.16, 1, 0.3, 1)',
          marginBottom: '3rem',
          maxWidth: '600px',
          textAlign: 'center',
          padding: '0 2rem',
        }}
      >
        <Body
          variant="standard"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          {siteConfig.opening.line2}
        </Body>
      </div>

      {/* Enter */}
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={handleEnter}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFCF8',
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            pointerEvents: 'auto',
            padding: '0.8rem 2rem',
            opacity: 0.6,
            transition: 'opacity 0.8s ease',
            borderBottom: '1px solid rgba(255, 252, 248, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderBottomColor = 'rgba(255, 252, 248, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6';
            e.currentTarget.style.borderBottomColor = 'rgba(255, 252, 248, 0.2)';
          }}
        >
          {siteConfig.opening.enterText}
        </button>
      </div>
    </div>
  );
}
