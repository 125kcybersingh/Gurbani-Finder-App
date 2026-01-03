import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerTintColor: '#FF9933',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: 'Reset Password',
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

