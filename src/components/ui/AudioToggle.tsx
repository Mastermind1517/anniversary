import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Minimal audio toggle — bottom-right corner.
 * Starts muted (browser autoplay policy). Thin speaker icon.
 * Gracefully handles missing audio file.
 */
export function AudioToggle({ src = '/audio/ambient.mp3' }: { src?: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'none';

    audio.addEventListener('error', () => {
      setIsAvailable(false);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const toggle = useCallback(() => {
    if (!audioRef.current || !isAvailable) return;

    if (isMuted) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — user will need to try again
      });
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  }, [isMuted, isAvailable]);

  if (!isAvailable) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        pointerEvents: 'auto',
        padding: '10px',
        opacity: isMuted ? 0.4 : 0.75,
        transition: 'opacity 0.6s ease',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = isMuted ? '0.4' : '0.75';
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFCF8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Speaker body */}
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {isMuted ? (
          <>
            {/* X for muted */}
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            {/* Sound waves */}
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
}
