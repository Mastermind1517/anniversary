import React from 'react';
import { useAppState } from '../AppState';
import { siteConfig } from '../../config/content';

/**
 * Intimate editorial modal displayed when a gallery photograph is clicked.
 * Clean, restrained, fine-art exhibition layout.
 */
export function MemoryDetailModal() {
  const { activePhotoId, setActivePhotoId } = useAppState();

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
        backgroundColor: 'rgba(33, 13, 17, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.6s ease-out forwards',
        pointerEvents: 'auto',
      }}
      onClick={() => setActivePhotoId(null)}
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#FFFCF8',
          color: '#211D1D',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
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
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '0.5rem',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          Close
        </button>

        {/* Date header */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8F2635',
            margin: '0 0 1rem 0',
          }}
        >
          {memory.date}
        </p>

        {/* Title */}
        <h2
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 400,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            letterSpacing: '0.04em',
            color: '#42151D',
            margin: '0 0 1.5rem 0',
            lineHeight: 1.2,
          }}
        >
          {memory.title}
        </h2>

        {/* Thin divider rule */}
        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: '#8F2635',
            opacity: 0.3,
            marginBottom: '1.5rem',
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
            margin: '0 0 2rem 0',
          }}
        >
          "{memory.caption}"
        </p>

        {/* Footer note */}
        <p
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: '#B8B0A8',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Moment {String(memory.id).padStart(2, '0')} of 06
        </p>
      </div>
    </div>
  );
}
