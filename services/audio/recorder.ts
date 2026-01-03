/**
 * Audio recording utilities
 * Wraps expo-av recording functionality
 */

import { Audio } from 'expo-av';

export interface RecordingOptions {
  quality?: 'low' | 'medium' | 'high';
  duration?: number; // Maximum duration in seconds
}

/**
 * Request audio recording permissions
 */
export async function requestAudioPermissions(): Promise<boolean> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting audio permissions:', error);
    return false;
  }
}

/**
 * Configure audio mode for recording
 */
export async function configureAudioForRecording(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  } catch (error) {
    console.error('Error configuring audio:', error);
    throw error;
  }
}

/**
 * Create a new audio recording
 */
export async function createRecording(
  options: RecordingOptions = {}
): Promise<Audio.Recording> {
  const { quality = 'high' } = options;

  const recordingOptions = {
    ...Audio.RecordingOptionsPresets[quality.toUpperCase() as keyof typeof Audio.RecordingOptionsPresets],
    ...(options.duration && { durationMillis: options.duration * 1000 }),
  };

  const { recording } = await Audio.Recording.createAsync(recordingOptions);
  return recording;
}

/**
 * Stop recording and get file URI
 */
export async function stopRecording(
  recording: Audio.Recording
): Promise<string | null> {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri || null;
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
}

