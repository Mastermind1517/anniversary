import React, { useEffect } from 'react';
import { useAppState } from '../AppState';
import { siteConfig } from '../../config/content';

/**
 * Editorial reading view for the Love Letter.
 * Modeled like fine correspondence printed on tactile ivory stationery.
 */
export function LoveLetterModal() {
  const { isLetterOpen, setIsLetterOpen } = useAppState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLetterOpen) {
        setIsLetterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLetterOpen, setIsLetterOpen]);

  if (!isLetterOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(25, 8, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 3rem)',
        animation: 'fadeIn 0.6s ease-out forwards',
        pointerEvents: 'auto',
        overflowY: 'auto',
      }}
      onClick={() => setIsLetterOpen(false)}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          backgroundColor: '#FFFCF8',
          color: '#211D1D',
          padding: 'clamp(2rem, 6vw, 4rem)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          margin: 'auto',
          border: '1px solid rgba(245, 240, 231, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Understated Close Link */}
        <button
          onClick={() => setIsLetterOpen(false)}
          aria-label="Fold and close letter"
          style={{
            position: 'absolute',
            top: '1.8rem',
            right: '1.8rem',
            background: 'none',
            border: 'none',
            color: '#651E2B',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '0.4rem',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          Fold Letter [Esc]
        </button>

        {/* Archival Header date/location mark */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#8F2635',
              margin: 0,
            }}
          >
            One Year — For {siteConfig.partner.name}
          </p>
        </div>

        {/* Letter Body — Cormorant Garamond */}
        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
            lineHeight: 1.85,
            color: '#211D1D',
            whiteSpace: 'pre-line',
            letterSpacing: '0.02em',
          }}
        >
          {siteConfig.loveLetter.text}
        </div>

        {/* Restrained closing touch */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(101, 30, 43, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: '#651E2B',
            }}
          >
            Always.
          </span>
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              color: '#B8B0A8',
              textTransform: 'uppercase',
            }}
          >
            October 2026
          </span>
        </div>
      </div>
    </div>
  );
}
