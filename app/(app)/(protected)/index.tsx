import { router } from "expo-router";
import { View, SafeAreaView, Alert } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useTodayExercise, useLogSet } from "@/hooks/use-supabase-query";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { Fab } from "@/components/ui/fab";
import { StreakFlame } from "@/components/ui/streak-flame";
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
			<View className="flex-1 justify-center px-4">
				<View className="items-center">
					<H1 className="mb-8">Today's Focus</H1>
					
					{isLoading ? (
						<Muted>Loading your exercise...</Muted>
					) : !todayExercise ? (
						<View className="items-center gap-y-4">
							<Muted>No exercise selected for today.</Muted>
							<Button
								onPress={() => router.push("/(app)/(protected)/exercise-selection")}
							>
								<Text>Select Exercises</Text>
							</Button>
						</View>
					) : (
						<View className="w-full items-center">
							{/* Exercise Card */}
							<View className="bg-card w-full rounded-2xl p-6 items-center">
								<Text className="text-2xl font-bold text-center mb-2">
									{todayExercise.exercise_name}
								</Text>
								<Text className="text-base text-muted-foreground mb-6">
									{todayExercise.target_reps} reps per set
								</Text>
								
								{/* Streak Section */}
								<StreakFlame 
									count={todayExercise.sets_count} 
									className="mb-6"
								/>
								
								{/* Log Set Button */}
								<Button 
									className="w-full h-14" 
									size="lg"
									onPress={handleLogSet}
									disabled={logSet.isPending}
								>
									<Text className="text-lg">
										{logSet.isPending 
											? 'Logging...' 
											: 'Log Set'
										}
									</Text>
								</Button>
							</View>

							{/* Motivational Text */}
							<Muted className="mt-6 text-center px-6">
								Remember: Frequent practice throughout the day is key to mastery.
							</Muted>
						</View>
					)}
				</View>
			</View>
			<Fab onPress={() => router.push("/(app)/(protected)/exercise-selection")} />
		</SafeAreaView>
	);
}
