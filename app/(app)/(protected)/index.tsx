import { router } from "expo-router";
import { View, SafeAreaView } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useTodayExercise } from "@/hooks/use-supabase-query";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Fab } from "@/components/ui/fab";

export default function Home() {
	const { user } = useAuth();
	const { data: todayExercises, isLoading } = useTodayExercise(user?.id || "");
	const todayExercise = todayExercises?.[0]; // Get first exercise for now

	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 p-4 gap-y-6">
				<H1 className="text-center">Today's Focus</H1>
				
				{isLoading ? (
					<Muted className="text-center">Loading your exercise...</Muted>
				) : !todayExercise ? (
					<View className="items-center gap-y-4">
						<Muted className="text-center">No exercise selected for today.</Muted>
						<Button
							onPress={() => router.push("/(app)/(protected)/exercise-selection")}
						>
							<Text>Select Exercises</Text>
						</Button>
					</View>
				) : (
					<View className="bg-card p-4 rounded-lg">
						<Text className="text-xl font-bold">{todayExercise.exercise_name}</Text>
						<Text className="mt-4 font-medium">Target: {todayExercise.target_reps} reps</Text>
						{todayExercise.completed && (
							<Text className="mt-2 text-green-500">✓ Completed</Text>
						)}
						<Button 
							className="mt-4 w-full" 
							onPress={() => {/* TODO: Implement set logging */}}
							disabled={todayExercise.completed}
						>
							<Text>{todayExercise.completed ? 'Completed' : 'Log Set'}</Text>
						</Button>
					</View>
				)}
			</View>
			<Fab onPress={() => router.push("/(app)/(protected)/exercise-selection")} />
		</SafeAreaView>
	);
}
