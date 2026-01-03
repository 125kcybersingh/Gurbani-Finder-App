import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
        <View className="px-6 py-8">
      <View className="items-center mb-8">
        <View className="w-24 h-24 bg-saffron rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-2xl font-bold text-navy">Welcome</Text>
        <Text className="text-gray-600 mt-2">GurBani Finder Beta</Text>
      </View>

      <View className="gap-4">
        <TouchableOpacity className="bg-white border-2 border-gray-200 rounded-lg p-4 active:bg-gray-50">
          <Text className="text-navy font-semibold text-lg">Settings</Text>
          <Text className="text-gray-600 text-sm mt-1">App preferences and configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border-2 border-gray-200 rounded-lg p-4 active:bg-gray-50">
          <Text className="text-navy font-semibold text-lg">Recognition History</Text>
          <Text className="text-gray-600 text-sm mt-1">View your scanned shabads</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border-2 border-gray-200 rounded-lg p-4 active:bg-gray-50">
          <Text className="text-navy font-semibold text-lg">About</Text>
          <Text className="text-gray-600 text-sm mt-1">Learn more about GurBani Finder</Text>
        </TouchableOpacity>

        <View className="mt-8 pt-6 border-t border-gray-200">
          <Text className="text-center text-gray-500 text-sm">
            Version 1.0.0 (Beta)
          </Text>
          <Text className="text-center text-gray-500 text-sm mt-2">
            Built with Seva for the Sangat
          </Text>
        </View>
      </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
