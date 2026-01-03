/**
 * Font family constants
 */

export const Fonts = {
  // Gurmukhi font (SantLipi)
  gurmukhi: 'SantLipi',
  
  // System fonts
  system: 'System',
  mono: 'SpaceMono',
  
  // Font weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontFamily = typeof Fonts[keyof typeof Fonts];

