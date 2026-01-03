import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { triggerHaptic, HapticType } from '@/utils/haptics';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    triggerHaptic(HapticType.Light);
    // TODO: Implement password reset
    console.log('Reset password for:', email);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-navy mb-2">Reset Password</Text>
          <Text className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-4">
          <Button
            title="Send Reset Link"
            variant="primary"
            onPress={handleReset}
          />
        </View>

        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-gray-600">Remember your password? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-saffron font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

