import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { H1, H2 } from '@/components/ui/typography';
import { ExerciseSelectionForm } from '@/components/exercises/exercise-selection-form';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <H1 className="text-center mb-8">Welcome to Groove</H1>
          
          <View className="mb-8">
            <H2 className="mb-4">What is Grease the Groove?</H2>
            <Text className="text-muted-foreground mb-4">
              Grease the Groove (GTG) is a training method developed by Pavel Tsatsouline that focuses on practicing a movement frequently throughout the day, but never to failure.
            </Text>
            <Text className="text-muted-foreground mb-4">
              The key principles are:
            </Text>
            <View className="mb-4 gap-y-2">
              <Text>• Practice frequently throughout the day</Text>
              <Text>• Never train to failure - stay fresh</Text>
              <Text>• Focus on perfect form every time</Text>
              <Text>• Be consistent with daily practice</Text>
            </View>
          </View>

          <View className="mb-8">
            <H2 className="mb-4">How to Use This App</H2>
            <View className="gap-y-2">
              <Text>1. Select up to 3 exercises you want to improve</Text>
              <Text>2. Set your target reps for each exercise</Text>
              <Text>3. Practice your exercises multiple times throughout the day</Text>
              <Text>4. Log each set to track your progress</Text>
            </View>
          </View>

          <View className="mb-8">
            <H2 className="mb-4">Let's Get Started!</H2>
            <Text className="text-muted-foreground mb-4">
              Choose your exercises below and set your target reps. Remember to pick a rep count that you can do with perfect form, leaving 2-3 reps in reserve.
            </Text>
          </View>

          <ExerciseSelectionForm 
            showTitle={false}
            onSaved={() => router.push('/(app)/(protected)')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
