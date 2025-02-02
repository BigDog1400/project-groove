import { router } from "expo-router";
import { View, SafeAreaView, Alert } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useTodayExercise, useLogSet, useProgressMetrics } from "@/hooks/use-supabase-query";
import { useSocialShare } from "@/hooks/use-social-share";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, H3, Muted } from "@/components/ui/typography";
import { Fab } from "@/components/ui/fab";
import { StreakFlame } from "@/components/ui/streak-flame";
import { useEffect, useRef } from "react";
import { ShareableStreak } from "@/components/ShareableStreak";

const RECOMMENDED_DAILY_SETS = 6;

export default function Home() {
	const { user } = useAuth();
	const { data: todayExercises, isLoading } = useTodayExercise(user?.id || "");
	const { data: metrics } = useProgressMetrics(user?.id || "");
	const todayExercise = todayExercises?.[0];
	const logSet = useLogSet();
	const socialShare = useSocialShare();
	const shareableRef = useRef(null);

	// If no exercises and not loading, redirect to onboarding
	useEffect(() => {
		if (!isLoading && (!todayExercises || todayExercises.length === 0)) {
			router.push('/(app)/(protected)/onboarding');
		}
	}, [isLoading, todayExercises]);

	const handleLogSet = async () => {
		console.debug('handleLogSet called');
		if (!todayExercise?.user_exercise_id || !todayExercise?.daily_assignment_id) return;
		
		try {
			 logSet.mutate({
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

	const handleShare = async () => {
		if (!user?.id || !metrics) return;
		console.log('handleShare called', metrics);
		
		try {
			await socialShare.mutateAsync({
				viewRef: shareableRef,
				streak: metrics.currentStreak,
				dailyCompletion: metrics.dailyCompletion,
			});
		} catch (error) {
			console.error('Error sharing:', error);
			Alert.alert(
				'Error',
				'Failed to share your progress. Please try again.',
				[{ text: 'OK' }]
			);
		}
	};

	const getProgressMessage = (setsCount: number) => {
		if (setsCount === 0) return "Start your first set!";
		if (setsCount < RECOMMENDED_DAILY_SETS) return `${RECOMMENDED_DAILY_SETS - setsCount} more sets recommended today`;
		return "Daily goal achieved! 🎉";
	};

	return (
		<SafeAreaView className="flex-1 bg-muted">
			<View className="flex-1 justify-center px-4">
				<View className="items-center">
					<H1 className="mb-2">Today's Practice</H1>
					<Muted className="mb-8 text-center">Practice frequently throughout the day for best results</Muted>
					
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
							<View className="w-full rounded-2xl p-6 mb-6  border-2 border-primary bg-white">
								<View className="items-center mb-6">
									<Text className="text-2xl font-bold text-center mb-2">
										{todayExercise.exercise_name}
									</Text>
									<Text className="text-base text-muted-foreground">
										Target: {todayExercise.target_reps} reps this set
									</Text>
								</View>
								
								{/* Progress Section */}
								<View className="items-center mb-6">
									<H3 className="mb-2">Today's Progress</H3>
									<StreakFlame 
										count={todayExercise.sets_count} 
										className="mb-2"
									/>
									<Text className="text-base text-center text-muted-foreground">
										{getProgressMessage(todayExercise.sets_count)}
									</Text>
									<View className="w-full h-3 rounded-full mt-4 border-2 border-border">
										<View 
											className="bg-main h-full rounded-full" 
											style={{ 
												width: `${Math.min((todayExercise.sets_count / RECOMMENDED_DAILY_SETS) * 100, 100)}%` 
											}} 
										/>
									</View>
								</View>
								
								{/* <TallyMarks count={6}/> */}
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
											: `Complete Set of ${todayExercise.target_reps} ${todayExercise.exercise_name}`
										}
									</Text>
								</Button>

								{todayExercise.sets_count >= RECOMMENDED_DAILY_SETS && (
									<Button
										className="w-full mt-4"
										variant="neutral"
										onPress={handleShare}
										disabled={socialShare.isPending}
									>
										<Text>
											{socialShare.isPending ? 'Sharing...' : 'Share Your Progress! 🎉'}
										</Text>
									</Button>
								)}

								{todayExercise.sets_count > 0 && (
									<Muted className="text-center mt-4">
										Last set completed: {new Date().toLocaleTimeString()}
									</Muted>
								)}
							</View>

							{/* Methodology Explanation */}
							<View className="mt-6 relative w-full border-2 border-border p-4 rounded-xl text-mtext bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
								<Text className="text-md font-base [&_p]:leading-relaxed">
									💡 Grease the Groove: Practice frequently throughout the day with perfect form, staying fresh and never reaching fatigue.
								</Text>
							</View>
						</View>
					)}
				</View>
			</View>
			<Fab onPress={() => router.push("/(app)/(protected)/exercise-selection")} />

			{/* Add ShareableStreak component hidden off-screen */}
			<View className="absolute -left-[9999px]">
				<ShareableStreak
					ref={shareableRef}
					streak={12}
					dailyCompletion={metrics?.totalRepsToday ?? 0}
				/>
			</View>
		</SafeAreaView>
	);
}
