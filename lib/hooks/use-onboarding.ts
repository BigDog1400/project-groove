import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ONBOARDING_COMPLETE_KEY = '@groove/onboarding_complete';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      setIsComplete(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsComplete(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      setIsComplete(true);
      router.push('/(app)/(protected)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      setIsComplete(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    isComplete,
    completeOnboarding,
    resetOnboarding,
  };
} 