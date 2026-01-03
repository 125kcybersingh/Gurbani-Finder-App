import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { recognizeTextFromImage } from '@/services/ocr/googleVision';
import { fuzzyMatchGurmukhi, MatchResult } from '@/services/matching/fuzzyMatch';
import { ShabadCard } from '@/components/shabad/ShabadCard';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
// Haptics is optional - will gracefully fail if not available
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {
  // Haptics not available
}

export default function ResultsScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [detectedText, setDetectedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();

  useEffect(() => {
    processImage();
  }, [imageUri]);

  const processImage = async () => {
    if (!imageUri) {
      setError('No image provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Step 1: OCR
      const ocrResult = await recognizeTextFromImage(imageUri);
      setDetectedText(ocrResult.text);

      if (!ocrResult.text) {
        setError('No text detected in image');
        setIsLoading(false);
        return;
      }

      // Step 2: Fuzzy match
      const matchResults = await fuzzyMatchGurmukhi(ocrResult.text, 0.5);
      setMatches(matchResults);

      if (matchResults.length === 0) {
        setError('No matching shabads found');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FF9933" />
        <Text className="text-navy mt-4 text-lg">Identifying shabad...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl mb-4">❌</Text>
        <Text className="text-xl font-bold text-navy mb-2">No Match Found</Text>
        <Text className="text-gray-600 mb-8 text-center">{error}</Text>
        {detectedText && (
          <View className="bg-gray-100 p-4 rounded-lg mb-6 w-full">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Detected Text:</Text>
            <Text className="text-gray-600">{detectedText}</Text>
          </View>
        )}
        <TouchableOpacity
          className="bg-saffron px-8 py-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 bg-white">
        <View className="px-6 py-8">
        {/* Detected Text */}
        {detectedText && (
          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Detected Text:</Text>
            <Text className="text-gray-600 text-sm">{detectedText}</Text>
          </View>
        )}

        {/* Matches */}
        {matches.map((match, index) => (
          <ShabadCard
            key={match.lineId}
            lineId={match.lineId}
            shabadId={match.shabadId}
            gurmukhi={match.gurmukhi}
            transliteration={match.transliteration}
            translation={match.translation}
            sourcePage={match.sourcePage}
            confidence={match.confidence}
            isBestMatch={index === 0}
            isBookmarked={isBookmarked(match.lineId)}
            onBookmark={() => addBookmark({
              lineId: match.lineId,
              shabadId: match.shabadId,
              gurmukhi: match.gurmukhi,
              transliteration: match.transliteration,
              translation: match.translation,
              sourcePage: match.sourcePage,
            })}
          />
        ))}

        {/* Back Button */}
        <TouchableOpacity
          className="border-2 border-gray-300 px-6 py-4 rounded-lg mt-4 bg-white"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 font-semibold text-center">Scan Another</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
