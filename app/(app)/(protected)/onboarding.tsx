import React, { useState } from 'react';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout';
import { WelcomeScreen } from '@/components/onboarding/welcome-screen';
import { ExplanationScreen } from '@/components/onboarding/explanation-screen';
import { HowToUseScreen } from '@/components/onboarding/how-to-use-screen';
import { ExerciseSelectionForm } from '@/components/exercises/exercise-selection-form';
import { SafeAreaView, View } from 'react-native';
import { H2, Muted } from '@/components/ui/typography';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useOnboarding } from '@/lib/hooks/use-onboarding';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const { completeOnboarding } = useOnboarding();

  const handleNext = () => {
    if (step <= totalSteps) {
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
      default:
        return null;
    }
  };

  if (step > totalSteps) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Animated.View 
          entering={FadeIn}
          className="px-4 pt-8 pb-4"
        >
          <H2 className="text-center text-2xl mb-2">Let's Get Started!</H2>
          <Muted className="text-center text-lg">
            Choose your exercises and set your target reps
          </Muted>
        </Animated.View>
        <ExerciseSelectionForm 
          disableInsets={true}
          showTitle={false}
          onSaved={handleComplete}
        />
      </SafeAreaView>
    );
  }

  return (
    <OnboardingLayout
      currentStep={step}
      totalSteps={totalSteps + 1}
      onNext={handleNext}
      onBack={handleBack}
      nextLabel={step === totalSteps ? "Choose Exercises" : "Next"}
      showSkip={step < totalSteps}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
