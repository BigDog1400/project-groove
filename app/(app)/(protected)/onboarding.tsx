import React, { useState } from 'react';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { WelcomeScreen } from '@/components/onboarding/welcome-screen';
import { ExplanationScreen } from '@/components/onboarding/explanation-screen';
import { HowToUseScreen } from '@/components/onboarding/how-to-use-screen';
import { ExerciseSelectionForm } from '@/components/exercises/exercise-selection-form';
import { View } from 'react-native';
import { H2, Muted } from '@/components/ui/typography';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useOnboarding } from '@/lib/hooks/use-onboarding';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { completeOnboarding } = useOnboarding();

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeScreen />;
      case 2:
        return <ExplanationScreen />;
      case 3:
        return <HowToUseScreen />;
      case 4:
        return (
          <View className="flex-1 px-4">
            <Animated.View 
              entering={FadeIn.delay(200).springify()}
              className="mb-8"
            >
              <H2 className="text-center text-2xl mb-2">Let's Get Started!</H2>
              <Muted className="text-center text-lg px-4 mb-8">
                Choose your exercises and set your target reps
              </Muted>
            </Animated.View>
            <ExerciseSelectionForm 
              showTitle={false}
              onSaved={handleComplete}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={totalSteps}
      onNext={handleNext}
      onBack={handleBack}
      nextLabel={step === totalSteps ? "Start Practice" : "Next"}
      showSkip={step < totalSteps}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
