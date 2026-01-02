import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View className="flex-1 bg-white" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-2xl font-bold text-navy mb-4 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-gray-600 mb-8 text-center">
          GurBani Finder needs camera access to identify shabads from projector screens
        </Text>
        <TouchableOpacity
          className="bg-saffron px-8 py-4 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold text-lg">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        // Navigate to results screen with image URI
        router.push({
          pathname: '/results',
          params: { imageUri: photo.uri },
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
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
            onPress={() => router.back()}
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
