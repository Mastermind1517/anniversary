import React from 'react';

type HeadingVariant = 'hero' | 'section' | 'caption';
type BodyVariant = 'standard' | 'small' | 'caption';

interface HeadingProps {
  variant?: HeadingVariant;
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  style?: React.CSSProperties;
}

interface BodyProps {
  variant?: BodyVariant;
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
  style?: React.CSSProperties;
}

interface EditorialQuoteProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const headingSizes: Record<HeadingVariant, string> = {
  hero: 'clamp(2.5rem, 6vw, 5rem)',
  section: 'clamp(1.5rem, 4vw, 3rem)',
  caption: 'clamp(1rem, 2vw, 1.5rem)',
};

const bodySizes: Record<BodyVariant, string> = {
  standard: 'clamp(0.95rem, 1.2vw, 1.1rem)',
  small: 'clamp(0.8rem, 1vw, 0.9rem)',
  caption: 'clamp(0.7rem, 0.9vw, 0.8rem)',
};

export function Heading({
  variant = 'section',
  children,
  className = '',
  as: Tag = 'h2',
  style,
}: HeadingProps) {
  return (
    <Tag
      className={`${className}`}
      style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 300,
        letterSpacing: '0.06em',
        lineHeight: 1.2,
        fontSize: headingSizes[variant],
        color: '#FFFCF8',
        margin: 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export function Body({
  variant = 'standard',
  children,
  className = '',
  as: Tag = 'p',
  style,
}: BodyProps) {
  return (
    <Tag
      className={`${className}`}
      style={{
        fontFamily: '"Inter", sans-serif',
        fontWeight: 300,
        letterSpacing: '0.02em',
        lineHeight: 1.7,
        fontSize: bodySizes[variant],
        color: '#FFFCF8',
        margin: 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export function EditorialQuote({
  children,
  className = '',
  style,
}: EditorialQuoteProps) {
  return (
    <p
      className={`${className}`}
      style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 'clamp(1.3rem, 3vw, 2rem)',
        letterSpacing: '0.04em',
        lineHeight: 1.5,
        color: '#FFFCF8',
        margin: '2rem 0',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}
