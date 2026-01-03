/**
 * Text formatting utilities
 */

/**
 * Format Ang number with proper display
 */
export function formatAng(ang: number): string {
  return `Ang ${ang}`;
}

/**
 * Format Raag name (English or Gurmukhi)
 */
export function formatRaag(raag: { name_english?: string; name_gurmukhi?: string } | null): string {
  if (!raag) return '';
  return raag.name_english || raag.name_gurmukhi || '';
}

/**
 * Format Writer name (English or Gurmukhi)
 */
export function formatWriter(writer: { name_english?: string; name_gurmukhi?: string } | null): string {
  if (!writer) return '';
  return writer.name_english || writer.name_gurmukhi || '';
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

