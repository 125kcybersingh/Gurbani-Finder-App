import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { triggerHaptic, HapticType } from '@/utils/haptics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner message="Checking camera permissions..." />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-navy mb-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-gray-600 mb-8 text-center">
          GurBani Finder needs camera access to identify shabads from projector screens
        </Text>
        <TouchableOpacity
          className="bg-saffron px-8 py-4 rounded-lg"
          onPress={() => {
            triggerHaptic(HapticType.Light);
            requestPermission();
          }}
        >
          <Text className="text-white font-semibold text-lg">Grant Permission</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      triggerHaptic(HapticType.Medium);
      setIsProcessing(true);
      
      if (!cameraRef.current) {
        throw new Error('Camera not available');
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo || !photo.uri) {
        throw new Error('Failed to capture photo');
      }

      // Navigate to results screen with image URI
      router.push({
        pathname: '/results',
        params: { imageUri: photo.uri },
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to capture image. Please try again.';
      
      Alert.alert(
        'Camera Error',
        errorMessage,
        [
          { text: 'OK', style: 'default' },
          { text: 'Try Again', onPress: () => setIsProcessing(false), style: 'default' },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
      >
        {/* Header */}
        <View className="pt-16 px-6">
          <TouchableOpacity
            className="self-start bg-black/50 px-4 py-2 rounded-full"
            onPress={() => {
              triggerHaptic(HapticType.Light);
              router.back();
            }}
          >
            <Text className="text-white font-semibold">← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Instruction */}
        <View className="absolute top-32 left-0 right-0 px-6">
          <View className="bg-black/70 px-4 py-3 rounded-lg">
            <Text className="text-white text-center font-semibold">
              Position Gurmukhi text in frame
            </Text>
          </View>
        </View>

        {/* Focus Frame */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="w-80 h-48 border-2 border-saffron rounded-lg" />
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 pb-12 px-6">
          <TouchableOpacity
            className={`bg-saffron w-20 h-20 rounded-full self-center items-center justify-center ${
              isProcessing ? 'opacity-50' : ''
            }`}
            onPress={handleCapture}
            disabled={isProcessing}
          >
            <View className="bg-white w-16 h-16 rounded-full" />
          </TouchableOpacity>
          <Text className="text-white text-center mt-4 text-sm">
            {isProcessing ? 'Processing...' : 'Tap to capture'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}
