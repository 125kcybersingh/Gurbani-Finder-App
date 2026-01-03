import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { triggerHaptic, HapticType } from '@/utils/haptics';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    triggerHaptic(HapticType.Light);
    // TODO: Implement authentication
    console.log('Signup:', { email, password });
  };

  const handleLogin = () => {
    triggerHaptic(HapticType.Light);
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-navy mb-2">Create Account</Text>
          <Text className="text-gray-600">Join GurBani Finder to save and sync your bookmarks</Text>
        </View>

        <View className="mb-4">
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
          <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />
        </View>

        <View className="mb-4">
          <Button
            title="Create Account"
            variant="primary"
            onPress={handleSignup}
          />
        </View>

        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text className="text-saffron font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

