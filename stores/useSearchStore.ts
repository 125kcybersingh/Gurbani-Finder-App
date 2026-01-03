/**
 * Search store
 * Manages search state, history, and recent searches
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SearchMode = 'first-letter-gurmukhi' | 'first-letter-roman' | 'full-text' | 'ang-number';

interface SearchHistoryItem {
  query: string;
  mode: SearchMode;
  timestamp: number;
  resultCount?: number;
}

interface SearchState {
  currentQuery: string;
  searchMode: SearchMode;
  searchHistory: SearchHistoryItem[];
  isSearching: boolean;
  lastSearchResults: any[];

  // Actions
  setQuery: (query: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  addToHistory: (item: SearchHistoryItem) => void;
  clearHistory: () => void;
  setSearching: (isSearching: boolean) => void;
  setLastResults: (results: any[]) => void;
}

const MAX_HISTORY_ITEMS = 20;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      currentQuery: '',
      searchMode: 'full-text',
      searchHistory: [],
      isSearching: false,
      lastSearchResults: [],

      setQuery: (query) => set({ currentQuery: query }),
      setSearchMode: (mode) => set({ searchMode: mode }),

      addToHistory: (item) => {
        const history = get().searchHistory;
        // Remove duplicates
        const filtered = history.filter(
          (h) => h.query !== item.query || h.mode !== item.mode
        );
        // Add to front
        const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        set({ searchHistory: updated });
      },

      clearHistory: () => set({ searchHistory: [] }),
      setSearching: (isSearching) => set({ isSearching }),
      setLastResults: (results) => set({ lastSearchResults: results }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        searchMode: state.searchMode,
      }),
    }
  )
);

