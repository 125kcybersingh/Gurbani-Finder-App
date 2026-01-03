/**
 * Matching configuration constants
 */

// Default confidence threshold (0.6 = 60% similarity)
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.6;

// Low confidence threshold for OCR errors (0.5 = 50% similarity)
export const LOW_CONFIDENCE_THRESHOLD = 0.5;

// High confidence threshold for exact matches (0.7 = 70% similarity)
export const HIGH_CONFIDENCE_THRESHOLD = 0.7;

// OCR confidence thresholds
export const OCR_HIGH_CONFIDENCE = 0.8; // OCR is very confident
export const OCR_MEDIUM_CONFIDENCE = 0.6; // OCR is moderately confident
export const OCR_LOW_CONFIDENCE = 0.4; // OCR has low confidence

/**
 * Calculate adaptive confidence threshold based on OCR confidence
 * @param ocrConfidence - Confidence score from OCR (0-1)
 * @returns Adaptive threshold for fuzzy matching
 */
export function getAdaptiveThreshold(ocrConfidence: number): number {
  // If OCR is very confident, use higher threshold (fewer false positives)
  if (ocrConfidence >= OCR_HIGH_CONFIDENCE) {
    return HIGH_CONFIDENCE_THRESHOLD;
  }
  
  // If OCR has low confidence, use lower threshold (more tolerance for errors)
  if (ocrConfidence <= OCR_LOW_CONFIDENCE) {
    return LOW_CONFIDENCE_THRESHOLD;
  }
  
  // Default threshold for medium OCR confidence
  return DEFAULT_CONFIDENCE_THRESHOLD;
}

/**
 * Get confidence threshold based on mode
 * @param mode - 'default' | 'low' | 'high' | 'adaptive'
 * @param ocrConfidence - OCR confidence for adaptive mode
 */
export function getConfidenceThreshold(
  mode: 'default' | 'low' | 'high' | 'adaptive' = 'adaptive',
  ocrConfidence?: number
): number {
  switch (mode) {
    case 'low':
      return LOW_CONFIDENCE_THRESHOLD;
    case 'high':
      return HIGH_CONFIDENCE_THRESHOLD;
    case 'adaptive':
      return ocrConfidence !== undefined
        ? getAdaptiveThreshold(ocrConfidence)
        : DEFAULT_CONFIDENCE_THRESHOLD;
    case 'default':
    default:
      return DEFAULT_CONFIDENCE_THRESHOLD;
  }
}

