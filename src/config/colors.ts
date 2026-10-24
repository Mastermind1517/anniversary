export const colors = {
  burgundy: '#651E2B',
  oxblood: '#42151D',
  crimson: '#8F2635',
  ivory: '#F5F0E7',
  porcelain: '#FFFCF8',
  charcoal: '#211D1D',
  silver: '#B8B0A8',
} as const;

/** Three.js compatible hex integer values */
export const threeColors = {
  burgundy: 0x651e2b,
  oxblood: 0x42151d,
  crimson: 0x8f2635,
  ivory: 0xf5f0e7,
  porcelain: 0xfffcf8,
  charcoal: 0x211d1d,
  silver: 0xb8b0a8,
} as const;

export type BrandColor = keyof typeof colors;
