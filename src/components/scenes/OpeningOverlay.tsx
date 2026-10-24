import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Body } from '../ui/Typography';
import { siteConfig } from '../../config/content';

interface OpeningOverlayProps {
  scrollProgress: number;
  onEnter?: () => void;
}

/**
 * Opening scene typography overlay.
 * "ONE YEAR." → pause → tagline → "Enter"
 * Fades out smoothly as user scrolls forward.
 */
export function OpeningOverlay({ scrollProgress, onEnter }: OpeningOverlayProps) {
  const [phase, setPhase] = useState(0); // 0: title, 1: tagline, 2: enter

  // Auto-sequence the text reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => setPhase(2), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEnter = useCallback(() => {
    onEnter?.();
  }, [onEnter]);

  // Fade out smoothly as camera starts moving past opening
  const opacity = scrollProgress < 0.04
    ? 1
    : Math.max(0, 1 - (scrollProgress - 0.04) / 0.14);

  // If fully faded, remove from DOM completely
  if (opacity <= 0.01) return null;

  const isInteractive = opacity > 0.2;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Main title */}
      <div
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'translateY(0)' : 'translateY(15px)',
          transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          marginBottom: '1.8rem',
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
          transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          marginBottom: '2.5rem',
          maxWidth: '580px',
          textAlign: 'center',
          padding: '0 2rem',
        }}
      >
        <Body
          variant="standard"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            opacity: 0.88,
          }}
        >
          {siteConfig.opening.line2}
        </Body>
      </div>

      {/* Enter button */}
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          onClick={handleEnter}
          disabled={!isInteractive}
          aria-label="Enter the anniversary gallery"
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFCF8',
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: isInteractive ? 'pointer' : 'default',
            pointerEvents: isInteractive ? 'auto' : 'none',
            padding: '0.75rem 2.2rem',
            opacity: 0.7,
            transition: 'all 0.4s ease',
            borderBottom: '1px solid rgba(255, 252, 248, 0.25)',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isInteractive) return;
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderBottomColor = 'rgba(255, 252, 248, 0.8)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.borderBottomColor = 'rgba(255, 252, 248, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onFocus={(e) => {
            if (!isInteractive) return;
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderBottomColor = 'rgba(255, 252, 248, 0.8)';
          }}
        >
          {siteConfig.opening.enterText}
        </button>
      </div>
    </div>
  );
}
