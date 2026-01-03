/**
 * Recognition store
 * Manages OCR and audio recognition state
 */

import { create } from 'zustand';

export type RecognitionType = 'image' | 'audio';
export type RecognitionStatus = 'idle' | 'processing' | 'success' | 'error';

interface RecognitionResult {
  type: RecognitionType;
  text?: string;
  confidence?: number;
  shabadId?: number;
  lineId?: number;
  timestamp: number;
}

interface RecognitionState {
  status: RecognitionStatus;
  currentType: RecognitionType | null;
  lastResult: RecognitionResult | null;
  history: RecognitionResult[];
  error: string | null;

  // Actions
  setStatus: (status: RecognitionStatus) => void;
  setType: (type: RecognitionType) => void;
  setResult: (result: RecognitionResult) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRecognitionStore = create<RecognitionState>((set, get) => ({
  status: 'idle',
  currentType: null,
  lastResult: null,
  history: [],
  error: null,

  setStatus: (status) => set({ status }),
  setType: (type) => set({ currentType: type }),
  
  setResult: (result) => {
    const history = get().history;
    const updated = [result, ...history].slice(0, 50); // Keep last 50
    set({
      lastResult: result,
      history: updated,
      status: 'success',
      error: null,
    });
  },

  setError: (error) => set({ error, status: 'error' }),
  
  reset: () => set({
    status: 'idle',
    currentType: null,
    error: null,
  }),
}));

