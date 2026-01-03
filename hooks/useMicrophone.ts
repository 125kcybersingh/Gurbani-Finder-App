/**
 * Hook for microphone/audio recording
 */

import { useState } from 'react';
import { Audio } from 'expo-av';
import { requestAudioPermissions, createRecording, stopRecording } from '@/services/audio/recorder';

export function useMicrophone() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = async () => {
    const granted = await requestAudioPermissions();
    setHasPermission(granted);
    return granted;
  };

  const startRecording = async () => {
    try {
      const granted = await checkPermission();
      if (!granted) {
        throw new Error('Microphone permission not granted');
      }

      const newRecording = await createRecording();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  };

  const stopRecordingAsync = async () => {
    if (!recording) return null;

    try {
      const uri = await stopRecording(recording);
      setRecording(null);
      setIsRecording(false);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecording(null);
      setIsRecording(false);
      throw error;
    }
  };

  return {
    recording,
    isRecording,
    hasPermission,
    startRecording,
    stopRecording: stopRecordingAsync,
    checkPermission,
  };
}

