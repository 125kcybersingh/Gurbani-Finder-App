import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShabadCard } from '@/components/shabad/ShabadCard';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { collections, getCollection } = useBookmarkStore();

  const collection = id ? getCollection(id) : null;

  useEffect(() => {
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner message="Loading collection..." />
        </View>
      </SafeAreaView>
    );
  }

  if (!collection) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          <EmptyState
            icon="📚"
            title="Collection Not Found"
            description="This collection doesn't exist or has been deleted."
            actionLabel="Go Back"
            onAction={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const bookmarks = collection.items || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-navy mb-1">{collection.name}</Text>
          {collection.description && (
            <Text className="text-gray-600 text-sm">{collection.description}</Text>
          )}
          <Text className="text-gray-500 text-sm mt-2">
            {bookmarks.length} {bookmarks.length === 1 ? 'shabad' : 'shabads'}
          </Text>
        </View>

        {bookmarks.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <EmptyState
              icon="📖"
              title="Empty Collection"
              description="This collection doesn't have any shabads yet. Start bookmarking shabads to add them to collections."
            />
          </View>
        ) : (
          <ScrollView className="flex-1">
            <View className="px-4 py-2">
              {bookmarks.map((bookmark) => (
                <ShabadCard
                  key={bookmark.id}
                  shabad={bookmark.shabad}
                  onPress={() => router.push(`/shabad/${bookmark.line_id}`)}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

