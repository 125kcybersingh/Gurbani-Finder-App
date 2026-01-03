import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { triggerHaptic, HapticType } from '@/utils/haptics';

const onboardingSteps = [
  {
    icon: '📷',
    title: 'Scan Shabads Instantly',
    description: 'Point your camera at projector screens at the Gurdwara to identify shabads in seconds.',
  },
  {
    icon: '🔍',
    title: 'Search & Discover',
    description: 'Search by first letter, Ang number, or full text. Find shabads by meaning or writer.',
  },
  {
    icon: '💾',
    title: 'Save & Organize',
    description: 'Bookmark shabads and organize them into collections. Add personal notes for study.',
  },
  {
    icon: '📱',
    title: 'Works Offline',
    description: 'Full functionality without internet. Perfect for use at the Gurdwara.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      triggerHaptic(HapticType.Light);
      setCurrentStep(currentStep + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    triggerHaptic(HapticType.Light);
    handleGetStarted();
  };

  const handleGetStarted = () => {
    triggerHaptic(HapticType.Medium);
    // TODO: Mark onboarding as complete in AsyncStorage
    router.replace('/(tabs)');
  };

  const currentContent = onboardingSteps[currentStep];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Skip button */}
        <View className="px-6 pt-4">
          <TouchableOpacity onPress={handleSkip} className="self-end">
            <Text className="text-saffron font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-8xl mb-8">{currentContent.icon}</Text>
            <Text className="text-3xl font-bold text-navy mb-4 text-center">
              {currentContent.title}
            </Text>
            <Text className="text-lg text-gray-600 text-center mb-12">
              {currentContent.description}
            </Text>

            {/* Progress indicators */}
            <View className="flex-row gap-2 mb-8">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full ${
                    index === currentStep ? 'bg-saffron w-8' : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="px-6 pb-8">
          <Button
            title={currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            variant="primary"
            onPress={handleNext}
          />
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={() => {
                triggerHaptic(HapticType.Light);
                setCurrentStep(currentStep - 1);
              }}
              className="mt-4"
            >
              <Text className="text-gray-600 font-semibold text-center">Previous</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

