import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      {icon && <Text className="text-6xl mb-4">{icon}</Text>}
      <Text className="text-2xl font-bold text-navy mb-2 text-center">{title}</Text>
      <Text className="text-gray-600 text-center mb-8">{description}</Text>
      
      {actionLabel && onAction && (
        <TouchableOpacity
          className={`${
            actionVariant === 'primary' ? 'bg-saffron' : 'border-2 border-navy'
          } px-8 py-4 rounded-lg`}
          onPress={onAction}
        >
          <Text
            className={`${
              actionVariant === 'primary' ? 'text-white' : 'text-navy'
            } font-semibold text-lg`}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

