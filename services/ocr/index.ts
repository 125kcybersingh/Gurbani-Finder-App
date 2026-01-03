/**
 * OCR service exports
 */

export { recognizeTextFromImage, OCRResult } from './googleVision';
export { preprocessImageForOCR, enhanceContrast, convertToGrayscale } from './preprocessing';
export { performTesseractOCR, isTesseractAvailable, initializeTesseract } from './tesseract';

