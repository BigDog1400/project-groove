import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { H1, H2, Muted } from '@/components/ui/typography';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export function ExplanationScreen() {
  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-4 pb-6">
        <Animated.View 
          entering={FadeIn.delay(200).springify()}
          className="mb-8"
        >
          <H1 className="text-center text-3xl mb-2">What is Grease the Groove?</H1>
          <Muted className="text-center text-lg px-4">
            A proven method to build strength efficiently without burnout
          </Muted>
        </Animated.View>

        <View className="flex-1">
          {/* Core Principles */}
          <Animated.View 
            entering={FadeInRight.delay(400).springify()}
            className="mb-8"
          >
            <H2 className="mb-4">Core Principles</H2>
            <View className="gap-6">
              <View className="flex-row items-start gap-x-4 bg-card p-4 rounded-2xl border-2 border-foreground shadow-neo">
                <View className="w-10 h-10 items-center justify-center bg-primary rounded-xl border-2 border-foreground">
                  <Ionicons name="repeat" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-lg mb-1">Practice Frequently</Text>
                  <Text className="text-muted-foreground">
                    Do multiple sets throughout the day instead of all at once
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-x-4 bg-card p-4 rounded-2xl border-2 border-foreground shadow-neo">
                <View className="w-10 h-10 items-center justify-center bg-secondary rounded-xl border-2 border-foreground">
                  <Ionicons name="battery-charging" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-lg mb-1">Never Train to Failure</Text>
                  <Text className="text-muted-foreground">
                    Keep 2-3 reps in reserve to stay fresh and prevent fatigue
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-x-4 bg-card p-4 rounded-2xl border-2 border-foreground shadow-neo">
                <View className="w-10 h-10 items-center justify-center bg-accent rounded-xl border-2 border-foreground">
                  <Ionicons name="checkmark-circle" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-lg mb-1">Perfect Form</Text>
                  <Text className="text-muted-foreground">
                    Focus on quality over quantity in every rep
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-x-4 bg-card p-4 rounded-2xl border-2 border-foreground shadow-neo">
                <View className="w-10 h-10 items-center justify-center bg-destructive rounded-xl border-2 border-foreground">
                  <Ionicons name="calendar" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-lg mb-1">Be Consistent</Text>
                  <Text className="text-muted-foreground">
                    Practice daily to build lasting strength and habits
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
} 