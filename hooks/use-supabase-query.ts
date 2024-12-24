import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import { Database } from "../types/supabase";

type Tables = Database["public"]["Tables"];

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exercises").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useUserExercises(userId: string) {
  return useQuery({
    queryKey: ["user-exercises", userId],
    queryFn: async () => {
      
      if (!userId) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from("user_exercises")
          .select("*, exercises(*)")
          .eq("user_id", userId)
          .eq("active", true);

        if (error) {
          throw error;
        }

        console.debug('useUserExercises data:', data);
        return data;
      } catch (e) {
        throw e;
      }
    },
    enabled: Boolean(userId),
  });
}

export function useTodayExercise(userId: string) {
  return useQuery({
    queryKey: ["today-exercise", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_or_create_daily_exercise", { p_user_id: userId });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveUserExercises() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (exercises: { user_id: string; exercise_id: string; target_reps: number }[]) => {
      console.debug('Starting useSaveUserExercises mutation with:', exercises);
      
      // First, deactivate all existing exercises
      console.debug('Deactivating existing exercises for user:', exercises[0].user_id);
      const { error: deactivateError } = await supabase
        .from("user_exercises")
        .update({ active: false })
        .eq("user_id", exercises[0].user_id);
      
      if (deactivateError) {
        console.error('Error deactivating exercises:', deactivateError);
        throw deactivateError;
      }
      console.debug('Successfully deactivated existing exercises');

      // Then upsert new exercises with ON CONFLICT DO UPDATE
      console.debug('Upserting new exercises:', exercises);
      const { error } = await supabase
        .from("user_exercises")
        .upsert(
          exercises.map(e => ({ 
            ...e, 
            active: true 
          })), 
          { 
            onConflict: 'user_id,exercise_id',
            ignoreDuplicates: false 
          }
        );
      
      if (error) {
        console.error('Error upserting exercises:', error);
        throw error;
      }
      console.debug('Successfully upserted exercises');
    },
    onSuccess: (_, variables) => {
      console.debug('Mutation successful, invalidating queries for user:', variables[0].user_id);
      queryClient.invalidateQueries({ queryKey: ["user-exercises", variables[0].user_id] });
      queryClient.invalidateQueries({ queryKey: ["today-exercise", variables[0].user_id] });
    },
  });
}


export function useLogSet() {
  const queryClient = useQueryClient();
  
  const { mutate, isPending,data,error,status } = useMutation({
    mutationFn: async ({ 
      user_exercise_id, 
      reps, 
      daily_assignment_id 
    }: { 
      user_exercise_id: string; 
      reps: number;
      daily_assignment_id: string;
    }) => {
      // Insert the set
      const { error: setError } = await supabase
        .from("sets")
        .insert({
          user_exercise_id,
          reps,
          daily_assignment_id,
          timestamp: new Date().toISOString(),
        });
      
      if (setError) throw setError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-exercise"] });
    },
  });

  return { mutate, isPending, data, error ,status};
}

// Type for exercise progress
type ExerciseProgress = {
  exerciseName: string;
  completedSets: number;
  targetSets: number;
};

export function useProgressMetrics(userId: string) {
  return useQuery({
    queryKey: ["progress-metrics", userId],
    queryFn: async () => {
      const { data: sets, error } = await supabase
        .from("sets")
        .select(`
          *,
          user_exercises(*, exercises!inner(*)),
          daily_assignment_id
        `)
        .eq("user_exercises.user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      return calculateMetrics(sets, new Date().toISOString().split("T")[0]);
    },
  });
}

const calculateMetrics = (
  sets: any[],
  today: string
): {
  currentStreak: number;
  longestStreak: number;
  dailyCompletion: number;
  weeklyProgress: { date: string; completion: number }[];
  exerciseProgress: ExerciseProgress[];
} => {
  // Organize sets by date
  const setsByDate = sets.reduce((acc: any, set: any) => {
    const date = new Date(set.timestamp).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(set);
    return acc;
  }, {});

  // Calculate current streak
  let currentStreak = 0;
  let streakPreviousDate = today;

  while (setsByDate[streakPreviousDate]?.length > 0) {
    currentStreak++;
    const prevDate = new Date(streakPreviousDate);
    prevDate.setDate(prevDate.getDate() - 1);
    streakPreviousDate = prevDate.toISOString().split("T")[0];
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let previousDate = "";

  for (const date in setsByDate) {
    if (!previousDate) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(previousDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const expectedPreviousDate = prevDate.toISOString().split("T")[0];

      if (date === expectedPreviousDate) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    previousDate = date;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Calculate daily completion
  const todaySets = setsByDate[today] || [];
  const dailyCompletion = todaySets.length > 0
    ? (todaySets.length / (todaySets[0]?.user_exercises?.target_sets || 1)) * 100
    : 0;

  // Calculate weekly progress
  const weeklyProgress: { date: string; completion: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    const dailySets = setsByDate[dateString] || [];
    const completion = dailySets.length > 0
      ? (dailySets.length / (dailySets[0]?.user_exercises?.target_sets || 1)) * 100
      : 0;
    weeklyProgress.push({ date: dateString, completion: Math.min(100, completion) });
  }

  // Calculate exercise progress for today
  const exerciseProgress: ExerciseProgress[] = todaySets.reduce(
    (acc: ExerciseProgress[], set: any) => {
      const exerciseName = set.user_exercises.exercises.name;
      const targetSets = set.user_exercises.target_sets;
      const existingExercise = acc.find(
        (e) => e.exerciseName === exerciseName
      );
      if (existingExercise) {
        existingExercise.completedSets++;
      } else {
        acc.push({ exerciseName, completedSets: 1, targetSets });
      }
      return acc;
    },
    []
  );

  return {
    currentStreak,
    longestStreak,
    dailyCompletion: Math.min(100, dailyCompletion),
    weeklyProgress,
    exerciseProgress,
  };
};
