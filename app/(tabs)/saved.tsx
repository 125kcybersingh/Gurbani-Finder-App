import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { ShabadCard } from '@/components/shabad/ShabadCard';

export default function SavedScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useBookmarkStore();

  const handleRemoveBookmark = (lineId: number) => {
    removeBookmark(lineId);
  };

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
        <Text className="text-6xl mb-4">📚</Text>
        <Text className="text-2xl font-bold text-navy mb-2">No Bookmarks Yet</Text>
        <Text className="text-gray-600 text-center mb-8">
          Bookmark shabads you want to remember or study later. They'll appear here.
        </Text>
        <TouchableOpacity
          className="bg-saffron px-8 py-4 rounded-lg"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white font-semibold text-lg">Start Scanning</Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
      <View className="px-6 py-8">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-navy mb-2">Saved Shabads</Text>
          <Text className="text-gray-600">{bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}</Text>
        </View>

        {bookmarks.map((bookmark) => (
          <ShabadCard
            key={bookmark.lineId}
            lineId={bookmark.lineId}
            shabadId={bookmark.shabadId}
            gurmukhi={bookmark.gurmukhi}
            transliteration={bookmark.transliteration}
            translation={bookmark.translation}
            sourcePage={bookmark.sourcePage}
            isBookmarked={true}
            onBookmark={() => handleRemoveBookmark(bookmark.lineId)}
          />
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
