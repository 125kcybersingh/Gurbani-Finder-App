/**
 * Deep linking utilities
 * Generate and parse deep links for sharing shabads
 */

import * as Linking from 'expo-linking';

export interface DeepLinkParams {
  shabadId?: number;
  lineId?: number;
  collectionId?: string;
}

/**
 * Generate a deep link for a shabad
 * @param params - Shabad or collection parameters
 * @returns Deep link URL
 */
export function generateDeepLink(params: DeepLinkParams): string {
  const scheme = 'gurbanifinder'; // App scheme
  const baseUrl = Linking.createURL('/');

  if (params.shabadId) {
    return `${baseUrl}shabad/${params.shabadId}`;
  }
  
  if (params.lineId) {
    return `${baseUrl}shabad/${params.lineId}`;
  }
  
  if (params.collectionId) {
    return `${baseUrl}collection/${params.collectionId}`;
  }

  return baseUrl;
}

/**
 * Parse a deep link URL
 * @param url - Deep link URL to parse
 * @returns Parsed parameters
 */
export function parseDeepLink(url: string): DeepLinkParams | null {
  try {
    const parsed = Linking.parse(url);
    
    if (parsed.path) {
      // Parse /shabad/[id] or /collection/[id]
      const pathParts = parsed.path.split('/').filter(Boolean);
      
      if (pathParts[0] === 'shabad' && pathParts[1]) {
        const id = parseInt(pathParts[1], 10);
        return { lineId: id, shabadId: id };
      }
      
      if (pathParts[0] === 'collection' && pathParts[1]) {
        return { collectionId: pathParts[1] };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

/**
 * Check if a URL is a valid deep link for this app
 */
export function isValidDeepLink(url: string): boolean {
  try {
    const parsed = Linking.parse(url);
    return parsed.scheme === 'gurbanifinder' || parsed.hostname === 'gurbanifinder.app';
  } catch {
    return false;
  }
}

