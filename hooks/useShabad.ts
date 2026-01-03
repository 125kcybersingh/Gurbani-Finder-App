/**
 * Hook for fetching shabad details
 */

import { useState, useEffect } from 'react';
import { getShabadFromLine } from '@/services/matching/fuzzyMatch';

export interface ShabadDetail {
  shabad: {
    id: number;
    start_ang: number;
    end_ang: number;
    sources?: { name_english: string; name_gurmukhi: string } | null;
    writers?: { name_english: string; name_gurmukhi: string } | null;
    raags?: { name_english: string; name_gurmukhi: string } | null;
  };
  matchedLine: {
    id: number;
    gurmukhi: string;
    transliteration: string | null;
    translation_english: string | null;
    source_page: number;
  };
  allLines: Array<{
    id: number;
    gurmukhi: string;
    transliteration: string | null;
    translation_english: string | null;
    source_line: number;
  }>;
}

export function useShabad(lineId: number | null) {
  const [loading, setLoading] = useState(false);
  const [shabad, setShabad] = useState<ShabadDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lineId) {
      setShabad(null);
      return;
    }

    const fetchShabad = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getShabadFromLine(lineId);
        setShabad(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shabad');
      } finally {
        setLoading(false);
      }
    };

    fetchShabad();
  }, [lineId]);

  return { shabad, loading, error };
}

