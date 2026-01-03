import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { triggerHaptic, HapticType } from '@/utils/haptics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export default function ListenScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const startRecording = async () => {
    try {
      triggerHaptic(HapticType.Medium);
      
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Audio recording permission is required to identify shabads from audio.');
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      triggerHaptic(HapticType.Medium);
      setIsProcessing(true);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        Alert.alert('Error', 'No audio file was recorded.');
        setIsProcessing(false);
        return;
      }

      // TODO: Process audio with ACRCloud or Whisper
      console.log('Audio recorded at:', uri);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert(
          'Audio Recognition',
          'Audio recognition is coming soon. For now, use the camera to identify shabads.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-navy mb-2">
          Listen to Kirtan
        </Text>
        <Text className="text-lg text-gray-600 mb-12 text-center">
          Record 10-60 seconds of Kirtan to identify the shabad
        </Text>

        {isProcessing ? (
          <LoadingSpinner message="Processing audio..." />
        ) : (
          <>
            {recording ? (
              <View className="items-center w-full">
                <View className="w-32 h-32 rounded-full bg-saffron/20 items-center justify-center mb-8">
                  <Text className="text-6xl">🎤</Text>
                </View>
                <Text className="text-xl font-semibold text-navy mb-4">
                  Recording...
        </Text>
                <Text className="text-gray-600 mb-8 text-center">
                  Tap the button below to stop recording
                </Text>
                <Button
                  title="⏹ Stop Recording"
                  variant="primary"
                  onPress={stopRecording}
                />
              </View>
            ) : (
              <View className="items-center w-full">
                <View className="w-32 h-32 rounded-full bg-navy/10 items-center justify-center mb-8">
                  <Text className="text-6xl">🎵</Text>
                </View>
                <Text className="text-gray-600 mb-8 text-center">
                  Tap the button below to start recording
                </Text>
                <Button
                  title="🎤 Start Recording"
                  variant="primary"
                  onPress={startRecording}
                />
              </View>
            )}
          </>
        )}

        <View className="absolute bottom-20">
          <Text className="text-xs text-gray-500 text-center">
            Beta Feature • Audio recognition coming soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

