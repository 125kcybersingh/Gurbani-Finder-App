/**
 * API endpoint constants
 */

export const API_ENDPOINTS = {
  // Supabase (handled by supabase client)
  supabase: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  
  // Google Cloud Vision
  googleVision: 'https://vision.googleapis.com/v1/images:annotate',
  
  // OpenAI Whisper
  openaiWhisper: 'https://api.openai.com/v1/audio/transcriptions',
  
  // ACRCloud
  acrcloud: process.env.EXPO_PUBLIC_ACRCLOUD_HOST || '',
} as const;

export const API_KEYS = {
  googleVision: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY || '',
  openai: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  acrcloudAccessKey: process.env.EXPO_PUBLIC_ACRCLOUD_ACCESS_KEY || '',
  acrcloudSecret: process.env.EXPO_PUBLIC_ACRCLOUD_ACCESS_SECRET || '',
} as const;

