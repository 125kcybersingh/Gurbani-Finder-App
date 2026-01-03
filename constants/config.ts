/**
 * Feature flags and app configuration
 */

export const Config = {
  // Feature flags
  features: {
    audioRecognition: true,
    offlineOCR: false, // Tesseract not yet implemented
    cloudSync: true,
    sharing: true,
    collections: true,
  },
  
  // App settings
  app: {
    name: 'GurBani Finder',
    version: '1.0.0',
    maxBookmarks: 1000,
    maxNoteLength: 2000,
    searchDebounceMs: 300,
    maxSearchHistory: 20,
  },
  
  // Recognition settings
  recognition: {
    minConfidence: 0.5,
    maxResults: 20,
    audioMaxDuration: 60, // seconds
    audioMinDuration: 10, // seconds
  },
  
  // Database settings
  database: {
    sqliteDbName: 'shabados.db',
    syncInterval: 5 * 60 * 1000, // 5 minutes
  },
} as const;

