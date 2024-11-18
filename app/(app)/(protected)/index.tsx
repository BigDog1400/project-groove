import { router } from "expo-router";
import { View, SafeAreaView, Alert } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useTodayExercise, useLogSet } from "@/hooks/use-supabase-query";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Fab } from "@/components/ui/fab";
import { useEffect } from "react";

export default function Home() {
	const { user } = useAuth();
	const { data: todayExercises, isLoading } = useTodayExercise(user?.id || "");
	const todayExercise = todayExercises?.[0]; // Get first exercise for now
	const logSet = useLogSet();

	// If no exercises and not loading, redirect to onboarding
	useEffect(() => {
		if (!isLoading && (!todayExercises || todayExercises.length === 0)) {
			router.push('/(app)/(protected)/onboarding');
		}
	}, [isLoading, todayExercises]);

	const handleLogSet = async () => {
		if (!todayExercise?.user_exercise_id || !todayExercise?.daily_assignment_id) return;
		
		try {
			await logSet.mutateAsync({
				user_exercise_id: todayExercise.user_exercise_id,
				reps: todayExercise.target_reps,
				daily_assignment_id: todayExercise.daily_assignment_id,
			});
		} catch (error) {
			console.error('Error logging set:', error);
			Alert.alert(
				'Error',
				'Failed to log set. Please try again.',
				[{ text: 'OK' }]
			);
		}
	};

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
						<Text className="mt-2 text-muted-foreground">
							Sets completed today: {todayExercise.sets_count}
						</Text>
						<Button 
							className="mt-4 w-full" 
							onPress={handleLogSet}
							disabled={logSet.isPending}
						>
							<Text>
								{logSet.isPending 
									? 'Logging...' 
									: 'Log Set'
								}
							</Text>
						</Button>
					</View>
				)}
			</View>
			<Fab onPress={() => router.push("/(app)/(protected)/exercise-selection")} />
		</SafeAreaView>
	);
}
