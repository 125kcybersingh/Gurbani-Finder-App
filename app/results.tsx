import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { recognizeTextFromImage } from '@/services/ocr/googleVision';
import { fuzzyMatchGurmukhi, getShabadFromLine, MatchResult } from '@/services/matching/fuzzyMatch';

export default function ResultsScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [detectedText, setDetectedText] = useState('');
  const [error, setError] = useState<string | null>(null);

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
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF9933" />
        <Text className="text-navy mt-4 text-lg">Identifying shabad...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
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
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
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

        {/* Matches */}
        {matches.map((match, index) => (
          <View
            key={match.lineId}
            className={`bg-white border-2 ${
              index === 0 ? 'border-saffron' : 'border-gray-200'
            } rounded-xl p-6 mb-4`}
          >
            {/* Confidence Badge */}
            <View className="flex-row items-center mb-4">
              <View className="bg-saffron/10 px-3 py-1 rounded-full">
                <Text className="text-saffron font-semibold text-sm">
                  {Math.round(match.confidence * 100)}% match
                </Text>
              </View>
              {index === 0 && (
                <View className="bg-gold/20 px-3 py-1 rounded-full ml-2">
                  <Text className="text-gold font-semibold text-sm">Best Match</Text>
                </View>
              )}
            </View>

            {/* Gurmukhi Text */}
            <Text className="text-2xl text-navy mb-3 leading-relaxed">
              {match.gurmukhi}
            </Text>

            {/* Transliteration */}
            {match.transliteration && (
              <Text className="text-gray-600 mb-2 italic">{match.transliteration}</Text>
            )}

            {/* Translation */}
            {match.translation && (
              <Text className="text-gray-700 mb-4">{match.translation}</Text>
            )}

            {/* Metadata */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              <View className="bg-saffron/10 px-3 py-1 rounded-full">
                <Text className="text-saffron font-semibold text-sm">
                  Ang {match.sourcePage}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 border-2 border-navy px-4 py-3 rounded-lg">
                <Text className="text-navy font-semibold text-center">Bookmark</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-saffron px-4 py-3 rounded-lg">
                <Text className="text-white font-semibold text-center">View Full</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Back Button */}
        <TouchableOpacity
          className="border-2 border-gray-300 px-6 py-4 rounded-lg mt-4"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 font-semibold text-center">Scan Another</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
