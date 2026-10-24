import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoaded: boolean;
}

/**
 * On-brand loading screen.
 * Full-screen oxblood background with "ONE YEAR." and a breathing line.
 * Fades out over 1.5s when isLoaded becomes true.
 */
export function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Start fade-out
      setIsVisible(false);
      // Remove from DOM after transition
      const timer = setTimeout(() => setShouldRender(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#42151D',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '0.12em',
          color: '#FFFCF8',
          margin: 0,
          animation: 'fadeIn 2s ease-out forwards',
        }}
      >
        ONE YEAR.
      </h1>

      {/* Breathing line */}
      <div
        style={{
          height: '1.5px',
          backgroundColor: '#F5F0E7',
          opacity: 0.5,
          animation: 'breathe 3s ease-in-out infinite',
        }}
      />
    </div>
  );
}
