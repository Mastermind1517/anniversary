import React from 'react';
import { siteConfig } from '../../config/content';

interface FinaleOverlayProps {
  scrollProgress: number;
}

/**
 * Finale typography overlay.
 * Appears when scrolling into the final composition (scrollProgress >= 0.82).
 * Pure stillness, emotional gravity, and editorial serif hierarchy.
 */
export function FinaleOverlay({ scrollProgress }: FinaleOverlayProps) {
  const isVisible = scrollProgress >= 0.82;
  const opacity = isVisible
    ? Math.min(1, (scrollProgress - 0.82) / 0.14)
    : 0;

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 'clamp(2.5rem, 7vh, 5.5rem)',
        opacity,
        transition: 'opacity 0.8s ease',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '720px', padding: '0 2rem' }}>
        {/* Line 1 */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
            letterSpacing: '0.05em',
            color: '#F5F0E7',
            opacity: 0.85,
            margin: '0 0 0.8rem 0',
          }}
        >
          {siteConfig.finale.line1}
        </p>

        {/* Line 2 */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
            letterSpacing: '0.04em',
            color: '#FFFCF8',
            margin: '0 0 2.2rem 0',
          }}
        >
          {siteConfig.finale.line2}
        </p>

        {/* Thin divider */}
        <div
          style={{
            width: '32px',
            height: '1px',
            backgroundColor: '#8F2635',
            margin: '0 auto 2.2rem auto',
            opacity: 0.5,
          }}
        />

        {/* Happy First Anniversary */}
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
            letterSpacing: '0.12em',
            color: '#FFFCF8',
            margin: '0 0 0.8rem 0',
            textTransform: 'uppercase',
          }}
        >
          {siteConfig.finale.closing}
        </h2>

        {/* Partner Name: Krishangi */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            letterSpacing: '0.08em',
            color: '#F5F0E7',
            margin: 0,
          }}
        >
          {siteConfig.partner.name}
        </p>
      </div>
    </div>
  );
}
