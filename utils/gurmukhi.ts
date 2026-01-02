// Gurmukhi text normalization and utility functions

// Remove vishraams (pause markers) and other diacritics
export function normalizeGurmukhi(text: string): string {
  return text
    .replace(/[।॥\u0964\u0965]/g, '') // Remove dandis (pause markers)
    .replace(/[\u0901-\u0903]/g, '') // Remove various diacritics
    .replace(/\u0A3C/g, '') // Remove nukta
    .replace(/[\u0A01-\u0A02]/g, '') // Remove bindi and tippi
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Extract first letters from Gurmukhi text for first-letter search
export function extractFirstLetters(text: string): string {
  const normalized = normalizeGurmukhi(text);
  const words = normalized.split(/\s+/);

  return words
    .map(word => {
      // Get first character of each word
      const firstChar = word.charAt(0);
      // Only include Gurmukhi letters (U+0A00 to U+0A7F)
      if (firstChar >= '\u0A00' && firstChar <= '\u0A7F') {
        return firstChar;
      }
      return '';
    })
    .filter(char => char !== '')
    .join(' ');
}

// Gurmukhi to Roman transliteration mapping (simplified)
const gurmukhiToRoman: Record<string, string> = {
  'ੳ': 'a', 'ਅ': 'a', 'ੲ': 'i', 'ਸ': 's', 'ਹ': 'h',
  'ਕ': 'k', 'ਖ': 'kh', 'ਗ': 'g', 'ਘ': 'gh', 'ਙ': 'ng',
  'ਚ': 'ch', 'ਛ': 'chh', 'ਜ': 'j', 'ਝ': 'jh', 'ਞ': 'ny',
  'ਟ': 't', 'ਠ': 'th', 'ਡ': 'd', 'ਢ': 'dh', 'ਣ': 'n',
  'ਤ': 't', 'ਥ': 'th', 'ਦ': 'd', 'ਧ': 'dh', 'ਨ': 'n',
  'ਪ': 'p', 'ਫ': 'ph', 'ਬ': 'b', 'ਭ': 'bh', 'ਮ': 'm',
  'ਯ': 'y', 'ਰ': 'r', 'ਲ': 'l', 'ਵ': 'v', 'ੜ': 'r',
  'ੴ': 'ik onkar',
};

export function gurmukhiToRomanFirstLetters(text: string): string {
  const firstLetters = extractFirstLetters(text);
  return firstLetters
    .split(' ')
    .map(char => gurmukhiToRoman[char] || char)
    .join(' ');
}

// Calculate simple string similarity (Levenshtein distance ratio)
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
