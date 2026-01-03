import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  message, 
  size = 'large',
  color = '#FF9933' // Saffron
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text className="text-navy mt-4 text-lg">{message}</Text>
      )}
    </View>
  );
}

