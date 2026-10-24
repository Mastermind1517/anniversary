import React from 'react';
import { useAppState } from '../AppState';
import { siteConfig } from '../../config/content';

/**
 * Intimate editorial modal displayed when a gallery photograph is clicked.
 * Clean, restrained, fine-art exhibition layout featuring the photograph or archival plaque,
 * date, title, and personal caption.
 */
export function MemoryDetailModal() {
  const { activePhotoId, setActivePhotoId } = useAppState();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePhotoId !== null) {
        setActivePhotoId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoId, setActivePhotoId]);

  if (activePhotoId === null) return null;

  const memory = siteConfig.memories.find((m) => m.id === activePhotoId);
  if (!memory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(26, 8, 12, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 3.5vw, 2.5rem)',
        animation: 'fadeIn 0.5s ease-out forwards',
        pointerEvents: 'auto',
        overflowY: 'auto',
      }}
      onClick={() => setActivePhotoId(null)}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          backgroundColor: '#FFFCF8',
          color: '#211D1D',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.65)',
          position: 'relative',
          margin: 'auto',
          border: '1px solid rgba(245, 240, 231, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Understated Close Link */}
        <button
          onClick={() => setActivePhotoId(null)}
          aria-label="Close memory modal"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#651E2B',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '0.4rem',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          Close [Esc]
        </button>

        {/* Date header */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#8F2635',
            margin: '0 0 0.8rem 0',
          }}
        >
          {memory.date}
        </p>

        {/* Title */}
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            letterSpacing: '0.04em',
            color: '#42151D',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.2,
          }}
        >
          {memory.title}
        </h2>

        {/* Photograph or Curated Archival Matte Display */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1.48 / 1',
            backgroundColor: '#F5F0E7',
            marginBottom: '1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid rgba(101, 30, 43, 0.12)',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {memory.hasRealPhoto && memory.photo ? (
            <img
              src={memory.photo}
              alt={memory.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#651E2B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '1px',
                  backgroundColor: '#8F2635',
                  opacity: 0.4,
                  marginBottom: '0.5rem',
                }}
              />
              <p
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.4rem',
                  fontStyle: 'italic',
                  margin: 0,
                  color: '#42151D',
                }}
              >
                {memory.title}
              </p>
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  color: '#B8B0A8',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Memory Archive · {memory.date}
              </p>
            </div>
          )}
        </div>

        {/* Thin divider rule */}
        <div
          style={{
            width: '36px',
            height: '1px',
            backgroundColor: '#8F2635',
            opacity: 0.35,
            marginBottom: '1.4rem',
          }}
        />

        {/* Personal caption */}
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            lineHeight: 1.7,
            color: '#211D1D',
            margin: '0 0 1.8rem 0',
          }}
        >
          "{memory.caption}"
        </p>

        {/* Footer note */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            color: '#B8B0A8',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Moment {String(memory.id).padStart(2, '0')} of 06 · One Year
        </p>
      </div>
    </div>
  );
}
