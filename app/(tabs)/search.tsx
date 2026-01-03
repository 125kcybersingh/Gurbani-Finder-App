import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/components/ui/EmptyState';
import { triggerHaptic, HapticType } from '@/utils/haptics';

export default function SearchScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    triggerHaptic(HapticType.Light);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <EmptyState
        icon="🔍"
        title="Search Coming Soon"
        description="Search by first letter, Ang number, or full text will be available in a future update. For now, use the camera to identify shabads instantly."
        actionLabel="Scan a Shabad Instead"
        onAction={handleScanPress}
      />
    </SafeAreaView>
  );
}
