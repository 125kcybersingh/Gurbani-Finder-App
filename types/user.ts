/**
 * User-related type definitions
 */

export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  display_name?: string;
  avatar_url?: string;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  showTransliteration: boolean;
  translationDisplay: 'always' | 'on-tap' | 'never';
  showMetadata: boolean;
  hapticsEnabled: boolean;
}

export interface UserStats {
  totalBookmarks: number;
  totalCollections: number;
  totalScans: number;
  totalSearches: number;
}

