import { supabase } from '../database/supabase';
import { normalizeGurmukhi, calculateSimilarity } from '@/utils/gurmukhi';

export interface MatchResult {
  lineId: number;
  shabadId: number;
  gurmukhi: string;
  transliteration: string | null;
  translation: string | null;
  sourcePage: number;
  confidence: number;
}

export async function fuzzyMatchGurmukhi(
  detectedText: string,
  minConfidence: number = 0.6
): Promise<MatchResult[]> {
  try {
    const normalized = normalizeGurmukhi(detectedText);

    // Use PostgreSQL trigram similarity search
    const { data, error } = await supabase
      .from('lines')
      .select('id, shabad_id, gurmukhi, transliteration, translation_english, source_page')
      .textSearch('gurmukhi', normalized, {
        type: 'websearch',
        config: 'simple',
      })
      .limit(20);

    if (error) {
      console.error('Database search error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Calculate similarity scores for each result
    const results: MatchResult[] = data
      .map(line => {
        const lineNormalized = normalizeGurmukhi(line.gurmukhi);
        const similarity = calculateSimilarity(normalized, lineNormalized);

        return {
          lineId: line.id,
          shabadId: line.shabad_id || 0,
          gurmukhi: line.gurmukhi,
          transliteration: line.transliteration,
          translation: line.translation_english,
          sourcePage: line.source_page,
          confidence: similarity,
        };
      })
      .filter(result => result.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);

    return results;
  } catch (error) {
    console.error('Error in fuzzy match:', error);
    throw error;
  }
}

// Get full shabad details given a line
export async function getShabadFromLine(lineId: number) {
  try {
    const { data: lineData, error: lineError } = await supabase
      .from('lines')
      .select(`
        *,
        shabads (
          id,
          start_ang,
          end_ang,
          sources (name_english, name_gurmukhi),
          writers (name_english, name_gurmukhi),
          raags (name_english, name_gurmukhi)
        )
      `)
      .eq('id', lineId)
      .single();

    if (lineError) throw lineError;

    // Get all lines in the shabad
    const { data: shabadLines, error: linesError } = await supabase
      .from('lines')
      .select('*')
      .eq('shabad_id', lineData.shabad_id)
      .order('source_line', { ascending: true });

    if (linesError) throw linesError;

    return {
      shabad: lineData.shabads,
      matchedLine: lineData,
      allLines: shabadLines,
    };
  } catch (error) {
    console.error('Error getting shabad details:', error);
    throw error;
  }
}
