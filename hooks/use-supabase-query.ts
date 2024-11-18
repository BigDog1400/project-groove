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
      const { data, error } = await supabase
        .from("user_exercises")
        .select("*, exercises(*)")
        .eq("user_id", userId)
        .eq("active", true);
      if (error) throw error;
      return data;
    },
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
      // First, deactivate all existing exercises
      const { error: deactivateError } = await supabase
        .from("user_exercises")
        .update({ active: false })
        .eq("user_id", exercises[0].user_id);
      
      if (deactivateError) throw deactivateError;

      // Then insert new exercises as active
      const { error } = await supabase
        .from("user_exercises")
        .upsert(exercises.map(e => ({ ...e, active: true })));
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-exercises", variables[0].user_id] });
      queryClient.invalidateQueries({ queryKey: ["today-exercise", variables[0].user_id] });
    },
  });
}

export function useCompleteDailyExercise(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("daily_exercise_assignments")
        .update({ completed: true })
        .eq("user_id", userId)
        .eq("date", new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-exercise", userId] });
    },
  });
}

export function useLogSet() {
  const queryClient = useQueryClient();
  
  return useMutation({
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
}
