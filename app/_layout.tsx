import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="scan" 
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal',
            }} 
          />
          <Stack.Screen 
            name="listen" 
            options={{ 
              title: 'Listen',
              headerBackTitle: 'Back',
              headerTintColor: '#FF9933',
            }} 
          />
          <Stack.Screen 
            name="results" 
            options={{ 
              title: 'Results',
              headerBackTitle: 'Back',
              headerTintColor: '#FF9933',
            }} 
          />
          <Stack.Screen 
            name="shabad/[id]" 
            options={{ 
              title: 'Shabad',
              headerBackTitle: 'Back',
              headerTintColor: '#FF9933',
            }} 
          />
          <Stack.Screen 
            name="collection/[id]" 
            options={{ 
              title: 'Collection',
              headerBackTitle: 'Back',
              headerTintColor: '#FF9933',
            }} 
          />
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              headerShown: false,
              presentation: 'fullScreenModal',
            }} 
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
