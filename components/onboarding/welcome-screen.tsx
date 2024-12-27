import React from 'react';
import { View } from 'react-native';
import { Image } from '@/components/image';
import { Text } from '@/components/ui/text';
import { H1, Muted } from '@/components/ui/typography';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export function WelcomeScreen() {
  return (
    <View className="flex-1 px-4">
      <Animated.View 
        className="flex-1 items-center justify-center pt-8"
        entering={FadeInUp.delay(200).springify()}
      >
        <Image
          source={require('@/assets/icon.png')}
          className="w-32 h-32 rounded-3xl border-4 border-foreground shadow-neo mb-8"
        />
        <H1 className="text-center text-4xl mb-4">Welcome to Groove!</H1>
        <Muted className="text-center text-lg px-8 mb-8">
          Master your strength with simple, consistent Grease the Groove practice
        </Muted>
      </Animated.View>

      <Animated.View 
        className="mb-8"
        entering={FadeInDown.delay(400).springify()}
      >
        <View className="flex-row items-center gap-x-4 mb-6">
          <View className="w-12 h-12 items-center justify-center bg-primary rounded-2xl border-2 border-foreground shadow-neo">
            <Text className="text-2xl">💪</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg mb-1">Build Real Strength</Text>
            <Text className="text-muted-foreground">Practice throughout the day, never to failure</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-x-4 mb-6">
          <View className="w-12 h-12 items-center justify-center bg-secondary rounded-2xl border-2 border-foreground shadow-neo">
            <Text className="text-2xl">📈</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg mb-1">Track Progress</Text>
            <Text className="text-muted-foreground">Watch your strength grow day by day</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-x-4">
          <View className="w-12 h-12 items-center justify-center bg-accent rounded-2xl border-2 border-foreground shadow-neo">
            <Text className="text-2xl">🎯</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-lg mb-1">Stay Consistent</Text>
            <Text className="text-muted-foreground">Build lasting habits with daily practice</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
} 