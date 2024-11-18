import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../../config/supabase';
import { Button } from '../../../components/ui/button';
import { Text } from '../../../components/ui/text';
import { Input } from '../../../components/ui/input';
import { useExercises, useSaveUserExercises } from '../../../hooks/use-supabase-query';

interface Exercise {
  id: string;
  name: string;
  description: string;
}

interface UserExercise {
  exercise_id: string;
  target_reps: number;
}

export default function ExerciseSelectionScreen() {
  const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>([]);
  const { data: exercises = [], isLoading } = useExercises();
  const { mutateAsync: saveExercises } = useSaveUserExercises();

  const toggleExercise = (exercise: Exercise) => {
    setSelectedExercises((prev) => {
      const isSelected = prev.some((e) => e.exercise_id === exercise.id);
      if (isSelected) {
        return prev.filter((e) => e.exercise_id !== exercise.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, { exercise_id: exercise.id, target_reps: 0 }];
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      await saveExercises(
        selectedExercises.map((e) => ({
          user_id: user.id,
          exercise_id: e.exercise_id,
          target_reps: e.target_reps,
        }))
      );

      router.push('/(app)/(protected)');
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading exercises...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold mb-4">Select Your Exercises</Text>
        <Text className="mb-4">Choose up to 3 exercises and set your target reps for each.</Text>

        <View className="mb-6">
          {exercises.map((exercise) => {
            const isSelected = selectedExercises.some(
              (e) => e.exercise_id === exercise.id
            );
            const selectedExercise = selectedExercises.find(
              (e) => e.exercise_id === exercise.id
            );

            return (
              <View
                key={exercise.id}
                className={`p-4 mb-2 rounded-lg border ${
                  isSelected ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-semibold">{exercise.name}</Text>
                    <Text className="text-gray-600">{exercise.description}</Text>
                  </View>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    onPress={() => toggleExercise(exercise)}
                  >
                    <Text>{isSelected ? 'Selected' : 'Select'}</Text>
                  </Button>
                </View>

                {isSelected && (
                  <View className="mt-4">
                    <Text className="mb-2">Target Reps per Set:</Text>
                    <Input
                      keyboardType="numeric"
                      value={selectedExercise?.target_reps.toString()}
                      onChangeText={(text) => updateTargetReps(exercise.id, text)}
                      placeholder="Enter target reps"
                      className="w-full"
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

        <View className="p-4">
          <Button
            disabled={selectedExercises.length === 0}
            onPress={handleSave}
            className="w-full"
          >
            <Text>Save Exercises</Text>
          </Button>
        </View>
    </SafeAreaView>
  );
}
