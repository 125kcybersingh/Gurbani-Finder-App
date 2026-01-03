import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { triggerHaptic, HapticType } from '@/utils/haptics';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    triggerHaptic(HapticType.Light);
    // TODO: Implement authentication
    console.log('Login:', { email, password });
  };

  const handleSignup = () => {
    triggerHaptic(HapticType.Light);
    router.push('/(auth)/signup');
  };

  const handleForgotPassword = () => {
    triggerHaptic(HapticType.Light);
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-navy mb-2">Welcome Back</Text>
          <Text className="text-gray-600">Sign in to sync your bookmarks across devices</Text>
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

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword} className="mb-6">
          <Text className="text-saffron text-sm font-semibold text-right">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View className="mb-4">
          <Button
            title="Sign In"
            variant="primary"
            onPress={handleLogin}
          />
        </View>

        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-gray-600">Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text className="text-saffron font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

