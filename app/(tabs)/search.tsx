import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-2xl font-bold text-navy mb-2">Search Coming Soon</Text>
      <Text className="text-gray-600 text-center mb-8">
        Search by first letter, Ang number, or full text will be available soon.
      </Text>
      <TouchableOpacity
        className="bg-saffron px-8 py-4 rounded-lg"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-white font-semibold text-lg">Scan a Shabad Instead</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
