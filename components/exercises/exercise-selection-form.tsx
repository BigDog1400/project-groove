import { View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { H1, Muted } from '@/components/ui/typography';
import { useAuth } from '@/hooks/use-auth';
import { useExercises, useSaveUserExercises, useUserExercises } from '@/hooks/use-supabase-query';
import { StyleSheet } from 'react-native';
import { cn } from '@/lib/utils';

interface Exercise {
  id: string;
  name: string;
  description: string | null;
}

interface UserExercise {
  exercise_id: string;
  target_reps: number;
}

interface ExerciseSelectionFormProps {
  onSaved?: () => void;
  showTitle?: boolean;
}

export function ExerciseSelectionForm({ onSaved, showTitle = true }: ExerciseSelectionFormProps) {
  const { user } = useAuth();
  const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>([]);
  const { data: exercises = [], isLoading: isLoadingExercises } = useExercises();
  const { 
    data: userExercises = [], 
    isLoading: isLoadingUserExercises,
    error: userExercisesError 
  } = useUserExercises(user?.id || "");
  const { mutateAsync: saveExercises, isSuccess: isSaveSuccess, isPending: isSaving } = useSaveUserExercises();

  // Add debug log for component render
  console.debug('ExerciseSelectionForm render:', {
    isSaving,
    isSaveSuccess,
    selectedExercisesCount: selectedExercises.length,
    userExercisesCount: userExercises.length
  });

  useEffect(() => {
    console.debug('Save status changed:', { isSaveSuccess, isSaving });
  }, [isSaveSuccess, isSaving]);

  useEffect(() => {
    console.debug('User ID:', user?.id);
    console.debug('User Exercises Loading:', isLoadingUserExercises);
    console.debug('User Exercises Error:', userExercisesError);
    console.debug('User Exercises Data:', userExercises);
  }, [user?.id, isLoadingUserExercises, userExercisesError, userExercises]);

  console.debug('Selected exercises:', selectedExercises);
  // Initialize selected exercises from user's active exercises
  useEffect(() => {
    console.debug('userExercises changed, updating selected exercises:', userExercises);
    console.table(userExercises);
    if (userExercises.length > 0) {
      setSelectedExercises(
        userExercises.map(ue => ({
          exercise_id: ue.exercise_id,
          target_reps: ue.target_reps
        }))
      );
    }
  }, [userExercises]);

  const toggleExercise = (exercise: Exercise) => {
    console.debug('Toggling exercise:', exercise.name);
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.exercise_id === exercise.id);
      if (isSelected) {
        console.debug('Removing exercise:', exercise.name);
        return prev.filter((e) => e.exercise_id !== exercise.id);
      }
      if (prev.length >= 3) {
        console.debug('Max exercises reached, not adding:', exercise.name);
        return prev;
      }
      // Get existing target reps if this exercise was previously selected
      const existingExercise = userExercises.find(ue => ue.exercise_id === exercise.id);
      console.debug('Adding exercise:', exercise.name, 'with target reps:', existingExercise?.target_reps || 0);
      return [...prev, { 
        exercise_id: exercise.id, 
        target_reps: existingExercise?.target_reps || 0 
      }];
    });
  };

  const updateTargetReps = (exerciseId: string, reps: string) => {
    console.debug('Updating target reps:', { exerciseId, reps });
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exercise_id === exerciseId
          ? { ...e, target_reps: parseInt(reps) || 0 }
          : e
      )
    );
  };

  const handleSave = async () => {
    console.debug('Starting save process');
    console.debug('Current state:', {
      userId: user?.id,
      selectedExercises,
      isSaving,
      isSaveSuccess
    });

    if (!user?.id) {
      console.error('No user ID available');
      return;
    }
    
    try {
      console.debug('Calling saveExercises with:', selectedExercises);
      await saveExercises(
        selectedExercises.map(e => ({
          ...e,
          user_id: user.id
        }))
      );
      console.debug('Save completed successfully');
      onSaved?.();
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };

  if (isLoadingExercises || isLoadingUserExercises) {
    return (
      <View className="items-center justify-center p-4">
        <Muted>Loading exercises...</Muted>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-100">
      <ScrollView className="flex-1" scrollEnabled={!isSaving}>
        <View className="p-4">
          {showTitle && (
            <View className="mb-6">
              <View className="items-center mb-6">
                <H1 className="mb-3 text-3xl font-black">Select Exercises</H1>
                <Muted className="text-center text-lg">Choose up to 3 exercises and set your target reps</Muted>
              </View>
              
              <Button 
                variant="neutral" 
                className="w-full h-12"
                onPress={() => router.push("/(app)/(protected)/reminder")}
              >
                <Text className="text-lg">⏰ Set Daily Reminder</Text>
              </Button>
            </View>
          )}

          <View className="bg-white rounded-lg border-2 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Text className="text-base text-center font-medium">
              💡 Choose exercises you want to improve. You'll practice one exercise each day.
            </Text>
          </View>

          {exercises.map((exercise) => {
            const isSelected = selectedExercises.some(e => e.exercise_id === exercise.id);
            const userExercise = selectedExercises.find(e => e.exercise_id === exercise.id);
            const isMaxSelected = selectedExercises.length >= 3 && !isSelected;

            return (
              <View
                key={exercise.name}
                className={cn(`mb-4 rounded-xl border-2 bg-white p-6
                  ${isSelected ? 'border-black bg-bg' : 'border-neutral-300'}
                  ${isMaxSelected ? 'opacity-50' : ''}
                  ${isSelected ? styles.shadow : ''}
                  `)}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-2xl font-bold">{exercise.name}</Text>
                  </View>
                  <Button
                    variant={isSelected ? "default" : "neutral"}
                    onPress={() => toggleExercise(exercise)}
                    disabled={isMaxSelected}
                  >
                    <Text className="font-bold">{isSelected ? '✓ Selected' : 'Select'}</Text>
                  </Button>
                </View>

                {isSelected && (
                  <View className="mt-4 border-t-2 border-black pt-4">
                    <Text className="text-lg font-bold mb-2">
                      Target Reps per Set
                    </Text>
                    <View className="flex-row items-center">
                      <Button
                        variant="neutral"
                        className="h-12 w-12 border-2 border-black mr-2"
                        onPress={() => updateTargetReps(exercise.id, 
                          String(Math.max(0, (parseInt(userExercise?.target_reps.toString() || '0') - 1))))}
                      >
                        <Text className="text-xl font-bold">-</Text>
                      </Button>
                      <Input
                        keyboardType="numeric"
                        value={userExercise?.target_reps.toString()}
                        onChangeText={(value) => updateTargetReps(exercise.id, value)}
                        className="h-12 flex-1 text-center text-xl font-bold border-2 border-black"
                      />
                      <Button
                        variant="neutral"
                        className="h-12 w-12 border-2 border-black ml-2"
                        onPress={() => updateTargetReps(exercise.id, 
                          String((parseInt(userExercise?.target_reps.toString() || '0') + 1)))}
                      >
                        <Text className="text-xl font-bold">+</Text>
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t-2 border-black p-4 bg-white">
        <Button
          className="w-full h-14"
          size="lg"
          disabled={selectedExercises.length === 0 || isSaving}
          onPress={handleSave}
        >
          <Text className="text-lg">
            {isSaving ? 'Saving...' : 'Save Exercises'}
          </Text>
        </Button>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
