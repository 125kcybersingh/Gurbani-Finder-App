/**
 * First-letter search functionality
 * Allows searching shabads by first letters of words (Gurmukhi or Roman)
 */

import { supabase } from '../database/supabase';

export interface FirstLetterMatch {
  lineId: number;
  shabadId: number;
  gurmukhi: string;
  transliteration: string | null;
  translation: string | null;
  sourcePage: number;
  matchScore: number;
}

/**
 * Search shabads by first letters in Gurmukhi
 * @param firstLetters - Array of first letters (e.g., ['ਸ', 'ਤ', 'ਨ'])
 * @param limit - Maximum results to return
 * @returns Array of matching shabads
 */
export async function searchByFirstLettersGurmukhi(
  firstLetters: string[],
  limit: number = 20
): Promise<FirstLetterMatch[]> {
  try {
    // Join first letters into a search pattern
    const pattern = firstLetters.join('');
    
    // Search in the first_letters column (if exists in database)
    // For now, use a text search approach
    const { data, error } = await supabase
      .from('lines')
      .select('id, shabad_id, gurmukhi, transliteration, translation_english, source_page')
      .ilike('gurmukhi', `${pattern}%`)
      .limit(limit);

    if (error) {
      console.error('First letter search error:', error);
      return [];
    }

    return (data || []).map((line, index) => ({
      lineId: line.id,
      shabadId: line.shabad_id,
      gurmukhi: line.gurmukhi,
      transliteration: line.transliteration,
      translation: line.translation_english,
      sourcePage: line.source_page,
      matchScore: 1 - (index * 0.01), // Decreasing score for later results
    }));
  } catch (error) {
    console.error('First letter search error:', error);
    return [];
  }
}

/**
 * Search shabads by first letters in Roman transliteration
 * @param firstLetters - Array of first letters (e.g., ['s', 't', 'n'])
 * @param limit - Maximum results to return
 * @returns Array of matching shabads
 */
export async function searchByFirstLettersRoman(
  firstLetters: string[],
  limit: number = 20
): Promise<FirstLetterMatch[]> {
  try {
    const pattern = firstLetters.join('');
    
    const { data, error } = await supabase
      .from('lines')
      .select('id, shabad_id, gurmukhi, transliteration, translation_english, source_page')
      .ilike('transliteration', `${pattern}%`)
      .limit(limit);

    if (error) {
      console.error('First letter Roman search error:', error);
      return [];
    }

    return (data || []).map((line, index) => ({
      lineId: line.id,
      shabadId: line.shabad_id,
      gurmukhi: line.gurmukhi,
      transliteration: line.transliteration,
      translation: line.translation_english,
      sourcePage: line.source_page,
      matchScore: 1 - (index * 0.01),
    }));
  } catch (error) {
    console.error('First letter Roman search error:', error);
    return [];
  }
}

