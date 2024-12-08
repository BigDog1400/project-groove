import { View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '@/config/supabase';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useExercises, useSaveUserExercises, useUserExercises } from '@/hooks/use-supabase-query';

interface Exercise {
  id: string;
  name: string;
  description: string;
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
  const { data: userExercises = [], isLoading: isLoadingUserExercises } = useUserExercises(user?.id || "");
  const { mutateAsync: saveExercises } = useSaveUserExercises();

  console.debug('Selected exercises:', selectedExercises);
  // Initialize selected exercises from user's active exercises
  useEffect(() => {
    console.debug('Selected exercises from user:', userExercises);
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
        <Text>Loading exercises...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {showTitle && (
        <Text className="text-xl font-bold mb-4 px-4">Select Your Exercises</Text>
      )}
      <ScrollView className="flex-1 px-4">
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
              className={`p-4 mb-4 rounded-lg border ${
                isSelected ? 'bg-primary/10 border-primary' : 'border-border'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text className="font-medium flex-1">{exercise.name}</Text>
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  onPress={() => toggleExercise(exercise)}
                >
                  <Text>{isSelected ? 'Selected' : 'Select'}</Text>
                </Button>
              </View>

              {isSelected && (
                <View className="mt-4">
                  <Text className="text-sm text-muted-foreground mb-2">
                    Target reps per set
                  </Text>
                  <Input
                    keyboardType="numeric"
                    value={userExercise?.target_reps.toString()}
                    onChangeText={(value) =>
                      updateTargetReps(exercise.id, value)
                    }
                    placeholder="Enter target reps"
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View className="p-4">
        <Button
          className="w-full"
          disabled={selectedExercises.length === 0}
          onPress={handleSave}
        >
          <Text>Save Exercises</Text>
        </Button>
      </View>
    </View>
  );
}