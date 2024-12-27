import { useCallback } from 'react';
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/config/supabase';
import { useSupabase } from '@/context/supabase-provider';

export function useOnboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const { checkOnboardingStatus } = useSupabase();

  const completeOnboarding = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;
      
      await checkOnboardingStatus(user.id);
      
      router.push('/(app)/(protected)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, [user?.id, router, checkOnboardingStatus]);

  const resetOnboarding = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: false })
        .eq('id', user.id);

      if (error) throw error;

      await checkOnboardingStatus(user.id);
      
      router.replace('/(app)/(protected)/onboarding');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, [user?.id, router, checkOnboardingStatus]);

  const _checkOnboardingStatus = useCallback(async (userId: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data?.onboarding_completed ?? false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }, [supabase]);

  return {
    completeOnboarding,
    resetOnboarding,
    checkOnboardingStatus: _checkOnboardingStatus
  };
} 