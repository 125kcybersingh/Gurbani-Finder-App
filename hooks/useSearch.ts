/**
 * Hook for search functionality with debouncing
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchStore } from '@/stores/useSearchStore';
import { searchByFirstLettersGurmukhi, searchByFirstLettersRoman } from '@/services/matching/firstLetter';
import { fuzzyMatchGurmukhi } from '@/services/matching/fuzzyMatch';

export function useSearch() {
  const { currentQuery, searchMode, setSearching, setLastResults, addToHistory } = useSearchStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string, mode: typeof searchMode) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSearching(true);

    try {
      let searchResults: any[] = [];

      switch (mode) {
        case 'first-letter-gurmukhi': {
          const letters = query.split(/\s+/).filter(Boolean);
          searchResults = await searchByFirstLettersGurmukhi(letters);
          break;
        }
        case 'first-letter-roman': {
          const letters = query.split(/\s+/).filter(Boolean);
          searchResults = await searchByFirstLettersRoman(letters);
          break;
        }
        case 'full-text': {
          searchResults = await fuzzyMatchGurmukhi(query);
          break;
        }
        case 'ang-number': {
          // TODO: Implement Ang number search
          const angNumber = parseInt(query, 10);
          if (!isNaN(angNumber)) {
            // Search by Ang number
            console.log('Ang search not yet implemented');
          }
          break;
        }
      }

      setResults(searchResults);
      setLastResults(searchResults);
      addToHistory({
        query,
        mode,
        timestamp: Date.now(),
        resultCount: searchResults.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [setSearching, setLastResults, addToHistory, searchMode]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(currentQuery, searchMode);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentQuery, searchMode, performSearch]);

  return {
    results,
    loading,
    error,
    search: performSearch,
  };
}

