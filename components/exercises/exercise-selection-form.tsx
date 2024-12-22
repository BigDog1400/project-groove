import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { H1, Muted } from '@/components/ui/typography';
import { useAuth } from '@/hooks/use-auth';
import { useExercises, useSaveUserExercises, useUserExercises } from '@/hooks/use-supabase-query';

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

  useEffect(() => {
    console.debug('User ID:', user?.id);
    console.debug('User Exercises Loading:', isLoadingUserExercises);
    console.debug('User Exercises Error:', userExercisesError);
    console.debug('User Exercises Data:', userExercises);
  }, [user?.id, isLoadingUserExercises, userExercisesError, userExercises]);

  console.debug('Selected exercises:', selectedExercises);
  // Initialize selected exercises from user's active exercises
  useEffect(() => {
    console.table(userExercises);
    if (userExercises.length > 0) {
      setSelectedExercises(
        userExercises.map(ue => ({
          exercise_id: ue.exercise_id,
          target_reps: ue.target_reps
        }))
      );
    }
  }, [userExercises, isSaveSuccess]);

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.exercise_id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.exercise_id !== exercise.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      // Get existing target reps if this exercise was previously selected
      const existingExercise = userExercises.find(ue => ue.exercise_id === exercise.id);
      return [...prev, { 
        exercise_id: exercise.id, 
        target_reps: existingExercise?.target_reps || 0 
      }];
    });
  };

  const updateTargetReps = (exerciseId: string, reps: string) => {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exercise_id === exerciseId
          ? { ...e, target_reps: parseInt(reps) || 0 }
          : e
      )
    );
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      await saveExercises(
        selectedExercises.map(e => ({
          ...e,
          user_id: user.id
        }))
      );
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
    <View className="flex-1 bg-muted">
   

      <ScrollView className="flex-1" scrollEnabled={!isSaving}>
        <View className="p-4">
          {showTitle && (
            <View className="mb-4">
              <View className="items-center mb-4">
                <H1 className="mb-2">Select Exercises</H1>
                <Muted className="text-center">Choose up to 3 exercises and set your target reps for each</Muted>
              </View>
              
              <Button 
                variant="outline" 
                className="w-full"
                onPress={() => router.push("/(app)/(protected)/reminder")}
              >
                <Text className="text-base">⏰ Set Daily Reminder</Text>
              </Button>
            </View>
          )}

          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-sm text-center">
              💡 Choose exercises you want to improve. You'll practice one exercise each day, rotating through your selection.
            </Text>
          </View>

          {exercises.map((exercise) => {
            const isSelected = selectedExercises.some(
              (e) => e.exercise_id === exercise.id
            );
            const userExercise = selectedExercises.find(
              (e) => e.exercise_id === exercise.id
            );

            return (
              <View
                key={exercise.id}
                className={`mb-4 rounded-2xl border-2 bg-white p-6 ${
                  isSelected ? 'border-primary' : 'border-border'
                }`}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl font-bold flex-1">{exercise.name}</Text>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    onPress={() => toggleExercise(exercise)}
                  >
                    <Text>{isSelected ? 'Selected' : 'Select'}</Text>
                  </Button>
                </View>

                {isSelected && (
                  <View>
                    <Text className="text-base text-muted-foreground mb-2">
                      Target reps per set
                    </Text>
                    <Input
                      keyboardType="numeric"
                      value={userExercise?.target_reps.toString()}
                      onChangeText={(value) =>
                        updateTargetReps(exercise.id, value)
                      }
                      placeholder="Enter target reps"
                      className="h-14"
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        <View className="h-20" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border p-4 bg-white/95">
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