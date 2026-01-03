/**
 * Settings store
 * Manages user preferences and app settings
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSize = 'small' | 'medium' | 'large';
export type TranslationDisplay = 'always' | 'on-tap' | 'never';

interface SettingsState {
  // Display settings
  fontSize: FontSize;
  showTransliteration: boolean;
  translationDisplay: TranslationDisplay;
  showMetadata: boolean;
  
  // Recognition settings
  preferOfflineOCR: boolean;
  audioRecognitionEnabled: boolean;
  
  // General settings
  hapticsEnabled: boolean;
  onboardingCompleted: boolean;
  
  // Actions
  setFontSize: (size: FontSize) => void;
  setShowTransliteration: (show: boolean) => void;
  setTranslationDisplay: (display: TranslationDisplay) => void;
  setShowMetadata: (show: boolean) => void;
  setPreferOfflineOCR: (prefer: boolean) => void;
  setAudioRecognitionEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      showTransliteration: true,
      translationDisplay: 'always',
      showMetadata: true,
      preferOfflineOCR: false,
      audioRecognitionEnabled: true,
      hapticsEnabled: true,
      onboardingCompleted: false,

      setFontSize: (size) => set({ fontSize: size }),
      setShowTransliteration: (show) => set({ showTransliteration: show }),
      setTranslationDisplay: (display) => set({ translationDisplay: display }),
      setShowMetadata: (show) => set({ showMetadata: show }),
      setPreferOfflineOCR: (prefer) => set({ preferOfflineOCR: prefer }),
      setAudioRecognitionEnabled: (enabled) => set({ audioRecognitionEnabled: enabled }),
      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

