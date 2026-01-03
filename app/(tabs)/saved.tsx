import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { ShabadCard } from '@/components/shabad/ShabadCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { triggerHaptic, HapticType } from '@/utils/haptics';

export default function SavedScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bookmarks are loaded automatically by zustand persist
    // Just set loading to false after a brief delay to show spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveBookmark = (lineId: number) => {
    removeBookmark(lineId);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <LoadingSpinner message="Loading bookmarks..." />
      </SafeAreaView>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <EmptyState
          icon="📚"
          title="No Bookmarks Yet"
          description="Bookmark shabads that move you or that you want to study later. Tap the bookmark button on any shabad to save it here."
          actionLabel="Start Scanning"
          onAction={() => {
            triggerHaptic(HapticType.Light);
            router.push('/(tabs)');
          }}
        />
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
