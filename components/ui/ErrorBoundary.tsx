import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const isDev = __DEV__ || Constants.expoConfig?.extra?.isDev;

  const handleGoHome = () => {
    onReset();
    // Navigation will be handled by the app's navigation system
    // The error boundary will reset and the app will re-render
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center px-6 py-12">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-2xl font-bold text-navy mb-2">Something Went Wrong</Text>
          <Text className="text-gray-600 text-center mb-8">
            We're sorry, but something unexpected happened. Please try again.
          </Text>

          {isDev && error && (
            <View className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 w-full">
              <Text className="text-red-800 font-semibold mb-2">Error Details (Dev Only):</Text>
              <Text className="text-red-700 text-sm font-mono">{error.message}</Text>
              {error.stack && (
                <ScrollView className="max-h-40 mt-2">
                  <Text className="text-red-600 text-xs font-mono">{error.stack}</Text>
                </ScrollView>
              )}
            </View>
          )}

          <View className="w-full max-w-xs gap-3">
            <TouchableOpacity
              className="bg-saffron px-8 py-4 rounded-lg"
              onPress={handleGoHome}
            >
              <Text className="text-white font-semibold text-lg text-center">Go Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border-2 border-navy px-8 py-4 rounded-lg"
              onPress={onReset}
            >
              <Text className="text-navy font-semibold text-lg text-center">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

