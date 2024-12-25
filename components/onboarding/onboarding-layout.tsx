import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showSkip?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  onBack?: () => void;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  showSkip = true,
  onNext,
  nextLabel = 'Next',
  onBack,
   
}: OnboardingLayoutProps) {
  const pathname = usePathname();
  const isLastStep = currentStep === totalSteps;

  const handleBack = () => {
    if (currentStep === 1) {
        // do nothing 
    } else {
      onBack?.();
    }
  };

  const handleSkip = () => {
    router.push('/(app)/(protected)/exercise-selection');
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-4 h-16 pb-2">
        <Button
          variant="default"
          size="icon"
          onPress={handleBack}
          disabled={currentStep === 1}
        >
          <Ionicons name="chevron-back" size={24} />
        </Button>
        <View className="flex-row gap-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              className={`h-2 w-2 rounded-full ${
                index < currentStep ? 'bg-gray-700' : 'bg-gray-500'
              }`}
            />
          ))}
        </View>
        <View className="w-10" /> 
      </View>

      

      {/* Content */}
      <View className="flex-1">
        {children}
      </View>

      {/* Bottom Navigation */}
      <View className="p-4">
        <Button
          className="w-full"
          onPress={onNext}
        >
          <Text>{nextLabel}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
} 