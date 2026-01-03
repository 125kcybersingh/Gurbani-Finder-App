import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export interface ShabadCardProps {
  lineId: number;
  shabadId: number;
  gurmukhi: string;
  transliteration?: string | null;
  translation?: string | null;
  sourcePage: number;
  confidence?: number;
  isBestMatch?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export function ShabadCard({
  lineId,
  shabadId,
  gurmukhi,
  transliteration,
  translation,
  sourcePage,
  confidence,
  isBestMatch = false,
  onBookmark,
  isBookmarked = false,
}: ShabadCardProps) {
  const router = useRouter();

  const handleViewFull = () => {
    router.push(`/shabad/${lineId}`);
  };

  return (
    <View
      className={`bg-white border-2 ${
        isBestMatch ? 'border-saffron' : 'border-gray-200'
      } rounded-xl p-6 mb-4 shadow-sm`}
    >
      {/* Confidence Badge */}
      {(confidence !== undefined || isBestMatch) && (
        <View className="flex-row items-center mb-4">
          {confidence !== undefined && (
            <View className="bg-saffron/10 px-3 py-1 rounded-full">
              <Text className="text-saffron font-semibold text-sm">
                {Math.round(confidence * 100)}% match
              </Text>
            </View>
          )}
          {isBestMatch && (
            <View className="bg-gold/20 px-3 py-1 rounded-full ml-2">
              <Text className="text-gold font-semibold text-sm">Best Match</Text>
            </View>
          )}
        </View>
      )}

      {/* Gurmukhi Text */}
      <Text className="text-2xl text-navy mb-3 leading-relaxed" style={{ fontFamily: 'SantLipi' }}>
        {gurmukhi}
      </Text>

      {/* Transliteration */}
      {transliteration && (
        <Text className="text-gray-600 mb-2 italic text-base">{transliteration}</Text>
      )}

      {/* Translation */}
      {translation && (
        <Text className="text-gray-700 mb-4 text-base leading-relaxed">{translation}</Text>
      )}

      {/* Metadata */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        <View className="bg-saffron/10 px-3 py-1 rounded-full">
          <Text className="text-saffron font-semibold text-sm">Ang {sourcePage}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-3">
        {onBookmark && (
          <TouchableOpacity
            className={`flex-1 border-2 ${
              isBookmarked ? 'border-saffron bg-saffron/10' : 'border-navy'
            } px-4 py-3 rounded-lg`}
            onPress={onBookmark}
          >
            <Text
              className={`${
                isBookmarked ? 'text-saffron' : 'text-navy'
              } font-semibold text-center`}
            >
              {isBookmarked ? '✓ Bookmarked' : 'Bookmark'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="flex-1 bg-saffron px-4 py-3 rounded-lg"
          onPress={handleViewFull}
        >
          <Text className="text-white font-semibold text-center">View Full</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

