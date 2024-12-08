import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/config/supabase';
import { useProgressMetrics } from '@/hooks/use-supabase-query';
import { useAuth } from '@/hooks/use-auth';

type ProgressMetrics = {
  currentStreak: number;
  longestStreak: number;
  dailyCompletion: number;
  weeklyProgress: {
    date: string;
    completion: number;
  }[];
  exerciseProgress: {
    exerciseName: string;
    completedSets: number;
    targetSets: number;
  }[];
};

export default function ProgressScreen() {
const { user } = useAuth();
  const { data: metrics, isLoading } = useProgressMetrics(user?.id || "");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView className="flex-1">
        <View className="px-4 space-y-6">
          {isLoading || !metrics ? (
            <View className="flex-1 justify-center items-center">
              <Text>Loading metrics...</Text>
            </View>
          ) : (
            <>
              {/* Current Streak Card */}
              <View className="bg-card p-4 rounded-lg">
                <Text className="text-lg font-semibold mb-2">Current Streak</Text>
                <Text className="text-3xl font-bold">{metrics.currentStreak} {metrics.currentStreak === 1 ? 'day' : 'days'}</Text>
                <Text className="text-sm text-gray-500">Longest Streak: {metrics.longestStreak} {metrics.longestStreak === 1 ? 'day' : 'days'}</Text>
              </View>

              {/* Daily Completion Card */}
              <View className="bg-card p-4 rounded-lg">
                <Text className="text-lg font-semibold mb-2">Today's Progress</Text>
                <View className="h-4 bg-muted rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${metrics.dailyCompletion}%` }}
                  />
                </View>
                <Text className="mt-2">{Math.round(metrics.dailyCompletion)}% Complete</Text>
              </View>

              {/* Exercise Progress Card */}
              <View className="bg-card p-4 rounded-lg space-y-2">
                <Text className="text-lg font-semibold">Exercise Progress (Today)</Text>
                {metrics.exerciseProgress.map((exercise) => (
                  <View key={exercise.exerciseName} className="flex-row justify-between">
                    <Text>{exercise.exerciseName}</Text>
                    <Text>
                      {exercise.completedSets} / {exercise.targetSets} sets
                    </Text>
                  </View>
                ))}
              </View>

              {/* Weekly Progress Summary */}
              <View className="bg-card p-4 rounded-lg">
                <Text className="text-lg font-semibold mb-2">Weekly Progress</Text>
                <View className="flex-row justify-between">
                  {metrics.weeklyProgress.map((item) => (
                    <View key={item.date} className="items-center">
                      <Text className="text-xs">{item.date.slice(5)}</Text>
                      <View
                        className="mt-1 h-10 w-4 bg-muted rounded-full overflow-hidden"
                      >
                        <View
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.completion}%` }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 