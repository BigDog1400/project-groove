import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { H1, H2, Muted } from '@/components/ui/typography';
import Animated, { FadeIn, FadeInLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function HowToUseScreen() {
  return (
    <View className="flex-1 px-4">
      <Animated.View 
        entering={FadeIn.delay(200).springify()}
        className="mb-8"
      >
        <H1 className="text-center text-3xl mb-2">How to Use the App</H1>
        <Muted className="text-center text-lg px-4">
          Follow these simple steps to get started with your practice
        </Muted>
      </Animated.View>

      <Animated.View 
        entering={FadeInLeft.delay(400).springify()}
        className="flex-1"
      >
        <View className="space-y-6">
          {/* Step 1 */}
          <View className="bg-card p-6 rounded-2xl border-2 border-foreground shadow-neo">
            <View className="flex-row items-center gap-x-4 mb-4">
              <View className="w-12 h-12 items-center justify-center bg-primary rounded-xl border-2 border-foreground">
                <Text className="text-2xl font-bold">1</Text>
              </View>
              <View className="flex-1">
                <H2>Choose Your Exercises</H2>
              </View>
            </View>
            <Text className="text-muted-foreground mb-4">
              Select up to 3 exercises you want to improve. Start with one if you're new to the method.
            </Text>
            <View className="flex-row items-center gap-x-2">
              <Ionicons name="barbell-outline" size={20} />
              <Text>Examples: Pull-ups, Push-ups, Squats</Text>
            </View>
          </View>

          {/* Step 2 */}
          <View className="bg-card p-6 rounded-2xl border-2 border-foreground shadow-neo">
            <View className="flex-row items-center gap-x-4 mb-4">
              <View className="w-12 h-12 items-center justify-center bg-secondary rounded-xl border-2 border-foreground">
                <Text className="text-2xl font-bold">2</Text>
              </View>
              <View className="flex-1">
                <H2>Set Your Target Reps</H2>
              </View>
            </View>
            <Text className="text-muted-foreground mb-4">
              Choose a number of reps you can do with perfect form, always keeping 2-3 reps in reserve.
            </Text>
            <View className="flex-row items-center gap-x-2">
              <Ionicons name="fitness-outline" size={20} />
              <Text>Example: If max is 10, set target to 6-7 reps</Text>
            </View>
          </View>

          {/* Step 3 */}
          <View className="bg-card p-6 rounded-2xl border-2 border-foreground shadow-neo">
            <View className="flex-row items-center gap-x-4 mb-4">
              <View className="w-12 h-12 items-center justify-center bg-accent rounded-xl border-2 border-foreground">
                <Text className="text-2xl font-bold">3</Text>
              </View>
              <View className="flex-1">
                <H2>Practice Throughout the Day</H2>
              </View>
            </View>
            <Text className="text-muted-foreground mb-4">
              Do your sets throughout the day whenever you have a few minutes. Aim for 6-10 sets per day.
            </Text>
            <View className="flex-row items-center gap-x-2">
              <Ionicons name="time-outline" size={20} />
              <Text>Spread sets out with 1-2 hours between them</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
} 