import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Bookmark {
  lineId: number;
  shabadId: number;
  gurmukhi: string;
  transliteration?: string | null;
  translation?: string | null;
  sourcePage: number;
  note?: string;
  createdAt: string;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  isBookmarked: (lineId: number) => boolean;
  addBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => void;
  removeBookmark: (lineId: number) => void;
  getBookmark: (lineId: number) => Bookmark | undefined;
  updateBookmarkNote: (lineId: number, note: string) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      isBookmarked: (lineId: number) => {
        return get().bookmarks.some(b => b.lineId === lineId);
      },

      addBookmark: (bookmark: Omit<Bookmark, 'createdAt'>) => {
        const newBookmark: Bookmark = {
          ...bookmark,
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }));
      },

      removeBookmark: (lineId: number) => {
        set(state => ({
          bookmarks: state.bookmarks.filter(b => b.lineId !== lineId),
        }));
      },

      getBookmark: (lineId: number) => {
        return get().bookmarks.find(b => b.lineId === lineId);
      },

      updateBookmarkNote: (lineId: number, note: string) => {
        set(state => ({
          bookmarks: state.bookmarks.map(b =>
            b.lineId === lineId ? { ...b, note } : b
          ),
        }));
      },
    }),
    {
      name: 'bookmark-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

