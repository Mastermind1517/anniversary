import React from 'react';

interface OverlayProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * HTML overlay layer that sits above the 3D canvas.
 * pointer-events: none by default — children can opt-in with the .clickable class.
 */
export function Overlay({ children, className = '' }: OverlayProps) {
  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

interface OverlaySectionProps {
  children: React.ReactNode;
  position?: 'top' | 'center' | 'bottom';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Positioned section within the overlay.
 * Use position prop to place content at top, center, or bottom.
 */
export function OverlaySection({
  children,
  position = 'center',
  className = '',
  style,
}: OverlaySectionProps) {
  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      position: 'absolute',
      top: '5vh',
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    center: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
    },
    bottom: {
      position: 'absolute',
      bottom: '5vh',
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  return (
    <div
      className={className}
      style={{
        ...positionStyles[position],
        padding: '0 2rem',
        maxWidth: '800px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
