import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { recognizeTextFromImage } from '@/services/ocr/googleVision';
import { fuzzyMatchGurmukhi, MatchResult } from '@/services/matching/fuzzyMatch';
import { ShabadCard } from '@/components/shabad/ShabadCard';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { triggerHaptic, HapticType } from '@/utils/haptics';
import { getConfidenceThreshold } from '@/constants/matching';

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

  const handleBookmark = (match: MatchResult) => {
    try {
      if (isBookmarked(match.lineId)) {
        triggerHaptic(HapticType.Light);
        removeBookmark(match.lineId);
        Alert.alert('Removed', 'Shabad removed from bookmarks');
      } else {
        triggerHaptic(HapticType.Success);
        addBookmark({
          lineId: match.lineId,
          shabadId: match.shabadId,
          gurmukhi: match.gurmukhi,
          transliteration: match.transliteration,
          translation: match.translation,
          sourcePage: match.sourcePage,
        });
        Alert.alert('Bookmarked', 'Shabad saved to your bookmarks');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      triggerHaptic(HapticType.Error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

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

      // Step 2: Fuzzy match with adaptive threshold
      const threshold = getConfidenceThreshold('adaptive', ocrResult.confidence);
      const matchResults = await fuzzyMatchGurmukhi(ocrResult.text, threshold);
      setMatches(matchResults);

      if (matchResults.length === 0) {
        setError('No matching shabads found');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to process image. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Add retry suggestion for network errors
        if (err.message.includes('Network') || err.message.includes('internet')) {
          errorMessage += ' Make sure you have an internet connection.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <LoadingSpinner message="Identifying shabad..." />
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
          onPress={() => {
            triggerHaptic(HapticType.Light);
            router.back();
          }}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
        {/* Success Header */}
        <View className="items-center mb-6">
          <Text className="text-4xl mb-2">✓</Text>
          <Text className="text-2xl font-bold text-navy">Shabad Identified</Text>
          <Text className="text-gray-600 mt-1">
            {matches.length} match{matches.length > 1 ? 'es' : ''} found
          </Text>
        </View>

        {/* Detected Text */}
        {detectedText && (
          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Detected Text:</Text>
            <Text className="text-gray-600 text-sm">{detectedText}</Text>
          </View>
        )}

        {/* Low Confidence Warning */}
        {matches.length > 0 && matches[0].confidence < 0.7 && (
          <View className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <Text className="text-yellow-800 font-semibold mb-1">Multiple matches found</Text>
            <Text className="text-yellow-700 text-sm">
              The match confidence is lower than usual. Please verify this is the correct shabad.
            </Text>
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
            onBookmark={() => handleBookmark(match)}
          />
        ))}

        {/* Back Button */}
        <TouchableOpacity
          className="border-2 border-gray-300 px-6 py-4 rounded-lg mt-4 bg-white"
          onPress={() => {
            triggerHaptic(HapticType.Light);
            router.back();
          }}
        >
          <Text className="text-gray-700 font-semibold text-center">Scan Another</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
