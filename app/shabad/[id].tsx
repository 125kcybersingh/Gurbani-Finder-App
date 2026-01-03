import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getShabadFromLine } from '@/services/matching/fuzzyMatch';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { triggerHaptic, HapticType } from '@/utils/haptics';

interface ShabadDetail {
  shabad: {
    id: number;
    start_ang: number;
    end_ang: number;
    sources?: { name_english: string; name_gurmukhi: string } | null;
    writers?: { name_english: string; name_gurmukhi: string } | null;
    raags?: { name_english: string; name_gurmukhi: string } | null;
  };
  matchedLine: {
    id: number;
    gurmukhi: string;
    transliteration: string | null;
    translation_english: string | null;
    source_page: number;
  };
  allLines: Array<{
    id: number;
    gurmukhi: string;
    transliteration: string | null;
    translation_english: string | null;
    source_line: number;
  }>;
}

export default function ShabadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shabadDetail, setShabadDetail] = useState<ShabadDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isBookmarked, addBookmark, removeBookmark, getBookmark } = useBookmarkStore();
  const lineId = parseInt(id || '0', 10);
  const bookmarked = isBookmarked(lineId);

  useEffect(() => {
    loadShabadDetail();
  }, [id]);

  const loadShabadDetail = async () => {
    if (!id) {
      setError('No shabad ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const detail = await getShabadFromLine(lineId);
      setShabadDetail(detail);
    } catch (err) {
      console.error('Error loading shabad detail:', err);
      
      let errorMessage = 'Failed to load shabad. Please try again.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        if (err.message.includes('Network') || err.message.includes('internet')) {
          errorMessage += ' Make sure you have an internet connection.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    if (!shabadDetail) return;

    try {
      if (bookmarked) {
        triggerHaptic(HapticType.Light);
        removeBookmark(lineId);
        Alert.alert('Removed', 'Shabad removed from bookmarks');
      } else {
        triggerHaptic(HapticType.Success);
        const matchedLine = shabadDetail.matchedLine;
        addBookmark({
          lineId: matchedLine.id,
          shabadId: shabadDetail.shabad.id,
          gurmukhi: matchedLine.gurmukhi,
          transliteration: matchedLine.transliteration,
          translation: matchedLine.translation_english,
          sourcePage: matchedLine.source_page,
        });
        Alert.alert('Bookmarked', 'Shabad saved to your bookmarks');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      triggerHaptic(HapticType.Error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <LoadingSpinner message="Loading shabad..." />
      </SafeAreaView>
    );
  }

  if (error || !shabadDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl mb-4">❌</Text>
        <Text className="text-xl font-bold text-navy mb-2">Error</Text>
        <Text className="text-gray-600 mb-8 text-center">{error || 'Shabad not found'}</Text>
        <TouchableOpacity
          className="bg-saffron px-8 py-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold text-lg">Go Back</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { shabad, matchedLine, allLines } = shabadDetail;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-navy mb-2">Complete Shabad</Text>
          <View className="flex-row flex-wrap gap-2">
            {shabad.sources && (
              <View className="bg-navy/10 px-3 py-1 rounded-full">
                <Text className="text-navy font-semibold text-sm">
                  {shabad.sources.name_english}
                </Text>
              </View>
            )}
            {shabad.writers && (
              <View className="bg-saffron/10 px-3 py-1 rounded-full">
                <Text className="text-saffron font-semibold text-sm">
                  {shabad.writers.name_english}
                </Text>
              </View>
            )}
            {shabad.raags && (
              <View className="bg-gold/20 px-3 py-1 rounded-full">
                <Text className="text-gold font-semibold text-sm">
                  {shabad.raags.name_english}
                </Text>
              </View>
            )}
            <View className="bg-saffron/10 px-3 py-1 rounded-full">
              <Text className="text-saffron font-semibold text-sm">
                Ang {shabad.start_ang}
                {shabad.end_ang !== shabad.start_ang ? `-${shabad.end_ang}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* All Lines */}
        <View className="space-y-4">
          {allLines.map((line, index) => {
            const isMatchedLine = line.id === matchedLine.id;
            return (
              <View
                key={line.id}
                className={`p-4 rounded-lg ${
                  isMatchedLine ? 'bg-saffron/5 border-2 border-saffron' : 'bg-gray-50'
                }`}
              >
                {isMatchedLine && (
                  <View className="mb-2">
                    <Text className="text-saffron font-semibold text-sm">Matched Line</Text>
                  </View>
                )}
                <Text className="text-2xl text-navy mb-2 leading-relaxed" style={{ fontFamily: 'SantLipi' }}>
                  {line.gurmukhi}
                </Text>
                {line.transliteration && (
                  <Text className="text-gray-600 mb-1 italic text-base">
                    {line.transliteration}
                  </Text>
                )}
                {line.translation_english && (
                  <Text className="text-gray-700 text-base leading-relaxed">
                    {line.translation_english}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View className="mt-8 pt-6 border-t border-gray-200">
          <TouchableOpacity
            className={`${
              bookmarked ? 'bg-saffron/10 border-2 border-saffron' : 'bg-saffron'
            } px-6 py-4 rounded-lg mb-4`}
            onPress={handleBookmark}
          >
            <Text
              className={`${
                bookmarked ? 'text-saffron' : 'text-white'
              } font-semibold text-lg text-center`}
            >
              {bookmarked ? '✓ Bookmarked' : 'Bookmark This Shabad'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

