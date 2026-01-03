/**
 * Text normalization utilities for Gurmukhi matching
 * Removes vishraams, diacritics, and normalizes spacing
 */

/**
 * Remove vishraams (punctuation marks) from Gurmukhi text
 * @param text - Gurmukhi text
 * @returns Text without vishraams
 */
export function removeVishraams(text: string): string {
  // Common vishraams in Gurmukhi
  const vishraams = [
    '।', // Danda
    '॥', // Double Danda
    '|',  // Pipe (sometimes used)
    '.',  // Period
    ',',  // Comma
  ];
  
  let normalized = text;
  vishraams.forEach(vishraam => {
    normalized = normalized.replace(new RegExp(vishraam, 'g'), '');
  });
  
  return normalized;
}

/**
 * Normalize Gurmukhi text for matching
 * - Removes vishraams
 * - Normalizes whitespace
 * - Trims edges
 * @param text - Gurmukhi text
 * @returns Normalized text
 */
export function normalizeGurmukhiForMatching(text: string): string {
  return removeVishraams(text)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Extract first letters from Gurmukhi text
 * @param text - Gurmukhi text
 * @returns Array of first letters
 */
export function extractFirstLetters(text: string): string[] {
  const words = normalizeGurmukhiForMatching(text).split(' ');
  return words
    .filter(word => word.length > 0)
    .map(word => word[0]);
}

